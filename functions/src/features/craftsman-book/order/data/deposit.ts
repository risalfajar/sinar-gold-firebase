import {OrderModel} from "./model"
import {CraftsmanOrder} from "./order"
import {OrderMaterial} from "./material"
import {DocumentData, FieldValue, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue} from "firebase-admin/firestore"

export type OrderDeposit = {
    id: string
    created: Date
    order: Omit<CraftsmanOrder, "modelCount">
    model: Omit<OrderModel, "isFinished">
    finishedMaterial: OrderMaterial
    goldWeightGap: number
    laborCost: number
    pricePerGram: number
    totalCost: number
    photoUrl: string
}

export const depositConverter: FirestoreDataConverter<OrderDeposit> = {
    toFirestore: function (model: WithFieldValue<OrderDeposit>): DocumentData {
        const any = {...model} as any
        if (!any.created) any.created = FieldValue.serverTimestamp()
        delete any.id
        return any
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot): OrderDeposit {
        const data = snapshot.data()
        return {
            ...data,
            id: snapshot.id,
            created: data.created?.toDate(),
            order: {...data.order, created: data.order.created.toDate()}
        } as OrderDeposit
    }
}
