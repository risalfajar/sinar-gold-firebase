import FirestoreRepository from "../../../lib/data/firestoreRepository"
import {GoodsHistory, goodsHistoryConverter} from "./history"
import {firestore} from "firebase-admin"
import {db} from "../../../lib/firebaseConfig"
import {COLLECTION_GOODS_HISTORY} from "../../../lib/constants"

export default class GoodsHistoryRepository extends FirestoreRepository<GoodsHistory> {
	getCollectionRef(): FirebaseFirestore.CollectionReference<GoodsHistory> {
		return db.collection(COLLECTION_GOODS_HISTORY).withConverter(goodsHistoryConverter)
	}

	getId(item: GoodsHistory): string {
		return item.id
	}
}
