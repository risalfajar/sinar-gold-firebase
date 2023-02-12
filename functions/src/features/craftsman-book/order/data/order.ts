import {OrderMaterial} from "./material"
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from "firebase-admin/firestore"
import {firestore} from "firebase-admin"
import {Salesman} from "../../../master-data/salesman/salesman"
import FieldValue = firestore.FieldValue

export type CraftsmanOrder = {
    id: string
    created?: Date
    finished?: Date | null
    craftsman: string
    salesman: Salesman
    modelCount: number
    material: OrderMaterial
    finishedWeight: number
    totalCost: number
}

export const craftsmanOrderConverter: FirestoreDataConverter<CraftsmanOrder> = {
    toFirestore(model: CraftsmanOrder): DocumentData {
        const any = model as any
        if (!any.created) any.created = FieldValue.serverTimestamp()
        delete any.id
        return any
    },
    fromFirestore(snap: QueryDocumentSnapshot): CraftsmanOrder {
        const data = snap.data()
        return {...data, id: snap.id, created: data.created?.toDate()} as CraftsmanOrder
    }
}
