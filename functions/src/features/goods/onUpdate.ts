import * as functions from "firebase-functions"
import {CLOUD_FUNCTIONS_DEFAULT_REGION, COLLECTION_GOODS} from "../../lib/constants"
import {goodsConverter} from "./data/goods"
import {GoodsHistory, HistoryType} from "./history/history"
import GoodsHistoryRepository from "./history/repository"

exports.onGoodsUpdate = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
	.firestore
	.document(`${COLLECTION_GOODS}/{id}`)
	.onUpdate(snapshot => {
		const oldGoods = goodsConverter.fromFirestore(snapshot.before)
		const goods = goodsConverter.fromFirestore(snapshot.after)

		if (oldGoods.storefrontCode === goods.storefrontCode && oldGoods.chamferCode === goods.chamferCode && oldGoods.itemType === goods.itemType)
			return

		const repository = new GoodsHistoryRepository()
		const history: GoodsHistory = {
			id: "",
			created: null,
			type: HistoryType.MOVE,
			oldGoods,
			goods
		}

		return repository.save(history)
	})
