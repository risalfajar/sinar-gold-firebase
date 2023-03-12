import FirestoreRepository from "../../../lib/data/firestoreRepository"
import {Goods, goodsConverter} from "./goods"
import {db} from "../../../lib/firebaseConfig"
import {COLLECTION_GOODS} from "../../../lib/constants"

export default class GoodsRepository extends FirestoreRepository<Goods> {
	getCollectionRef(): FirebaseFirestore.CollectionReference<Goods> {
		return db.collection(COLLECTION_GOODS).withConverter(goodsConverter)
	}

	getId(item: Goods): string {
		return item.id
	}
}
