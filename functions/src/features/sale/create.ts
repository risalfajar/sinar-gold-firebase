import * as functions from "firebase-functions"
import {CLOUD_FUNCTIONS_DEFAULT_REGION, LOCALE_INDONESIA} from "../../lib/constants"
import {Sales, SalesStatus} from "./data/sales"
import {CallableContext} from "firebase-functions/lib/common/providers/https"
import {db} from "../../lib/firebaseConfig"
import {firestore} from "firebase-admin"
import GoodsRepository from "../goods/data/repository"
import {throwExpression} from "../../lib/utils/throwExpression"
import {GoodsStatus} from "../goods/data/goodsStatus"
import {sumBy} from "lodash"
import SalesRepository from "./data/repository"
import {requireUserSignedIn} from "../auth/verification"
import Transaction = firestore.Transaction

exports.createSales = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
	.https
	.onCall(async (data: Sales, context: CallableContext) => {
		const auth = requireUserSignedIn(context)

		try {
			await db.runTransaction(async (t: Transaction) => {
				await validate(t)
				saveSales(t)
				updateGoods(t)
			})
			console.log("Successfully creating sales", data.createdBy)
		} catch (err) {
			console.error("Failed to create sales", err)
			throw err
		}

		async function validate(t: Transaction) {
			const goodsRepository = new GoodsRepository()
			const soldGoods = Object.values(data.goods)
			const priceTotal = sumBy(soldGoods, (it) => it.price.total)
			const paymentTotal = sumBy(data.payments, (it) => it.amount)

			for (const goods of soldGoods) {
				const source = await goodsRepository.transactedGet(t, goods.id)

				if (!source)
					throwExpression("failed-precondition", `Data barang ${goods.name} tidak dapat ditemukan`)
				if (source.status === GoodsStatus.BOOKED)
					throwExpression("failed-precondition", `Barang ${goods.name} sudah dibooking pembeli`)
				if (source.status === GoodsStatus.SOLD)
					throwExpression("failed-precondition", `Barang ${goods.name} sudah terjual`)
				if (source.details.price !== goods.price.goodsPrice)
					throwExpression("failed-precondition", `Harga barang ${goods.name} sudah berubah menjadi ${source.details.price.toLocaleString(LOCALE_INDONESIA)}`)
				// TODO check price negotiation tolerance
				// if ((goods.price.goodsPrice - goods.price.salePrice) > priceTolerance)
				if ((goods.price.salePrice + goods.price.cost) !== goods.price.total)
					throwExpression("invalid-argument", `Total harga jual barang ${goods.name} tidak sesuai`)
			}

			for (const payment of data.payments) {
				if (payment.amount <= 0)
					throwExpression("invalid-argument", "Nominal pembayaran harus di atas 0")
			}

			if (priceTotal !== data.priceDetails.sale)
				throwExpression("invalid-argument", `Total harga tidak sesuai: ${data.priceDetails.sale}, padahal seharusnya ${priceTotal}`)
			// TODO accommodate down payment
			if (paymentTotal !== priceTotal)
				throwExpression("invalid-argument", `Jumlah pembayaran tidak sama dengan total harga`)
		}

		function saveSales(t: Transaction) {
			const repository = new SalesRepository()
			repository.transactedSet(t, {...data, createdAt: null, createdBy: auth.uid, status: SalesStatus.WAITING})
		}

		function updateGoods(t: Transaction) {
			const repository = new GoodsRepository()
			const goods = Object.values(data.goods)

			goods.forEach(goods => repository.transactedUpdate(t, goods.id, {status: GoodsStatus.BOOKED}))
		}
	})
