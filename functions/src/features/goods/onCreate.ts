import * as functions from "firebase-functions"
import {CLOUD_FUNCTIONS_DEFAULT_REGION, COLLECTION_GOODS} from "../../lib/constants"
import {goodsConverter} from "./data/goods"
import {GoodsHistory, HistoryType} from "./history/history"
import GoodsHistoryRepository from "./history/repository"

exports.onGoodsCreate = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
	.firestore
	.document(`${COLLECTION_GOODS}/{id}`)
	.onCreate(snapshot => {
		const goods = goodsConverter.fromFirestore(snapshot)
		const repository = new GoodsHistoryRepository()
		const history: GoodsHistory = {
			id: "",
			created: null,
			type: HistoryType.IN,
			goods
		}

		return repository.save(history)
	})
