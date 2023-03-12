import FirestoreRepository from "../../../lib/data/firestoreRepository"
import {Sales, salesConverter} from "./sales"
import {db} from "../../../lib/firebaseConfig"
import {COLLECTION_SALES} from "../../../lib/constants"

export default class SalesRepository extends FirestoreRepository<Sales> {
	getCollectionRef(): FirebaseFirestore.CollectionReference<Sales> {
		return db.collection(COLLECTION_SALES).withConverter(salesConverter)
	}

	getId(item: Sales): string {
		return item.id
	}
}
