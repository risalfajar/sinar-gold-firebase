import FirestoreRepository from "../../../../lib/data/firestoreRepository"
import {modelConverter, OrderModel} from "./model"
import {db} from "../../../../lib/firebaseConfig"
import {COLLECTION_CRAFTSMAN_ORDER, COLLECTION_CRAFTSMAN_ORDER_MODEL} from "../../../../lib/constants"

export default class CraftsmanOrderModelRepository extends FirestoreRepository<OrderModel> {
    private readonly orderId: string

    constructor(orderId: string) {
        super()
        this.orderId = orderId
    }

    getCollectionRef(): FirebaseFirestore.CollectionReference<OrderModel> {
        return db.collection(COLLECTION_CRAFTSMAN_ORDER)
            .doc(this.orderId)
            .collection(COLLECTION_CRAFTSMAN_ORDER_MODEL)
            .withConverter(modelConverter)
    }

    getId(item: OrderModel): string {
        return item.id
    }
}
