import FirestoreRepository from "../../../../lib/data/firestoreRepository"
import {CraftsmanOrder, craftsmanOrderConverter} from "../order"
import {db} from "../../../../lib/firebaseConfig"
import {COLLECTION_CRAFTSMAN_ORDER} from "../../../../lib/constants"

export default class CraftsmanOrderRepository extends FirestoreRepository<CraftsmanOrder> {
    getCollectionRef(): FirebaseFirestore.CollectionReference<CraftsmanOrder> {
        return db.collection(COLLECTION_CRAFTSMAN_ORDER)
            .withConverter(craftsmanOrderConverter)
    }

    getId(item: CraftsmanOrder): string {
        return item.id
    }
}
