import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from "firebase-admin/firestore"

export type OrderModel = {
    id: string
    size: string,
    details: string,
    photoUrl: string,
    quantity: number,
    isFinished: boolean
}

export const modelConverter: FirestoreDataConverter<OrderModel> = {
	toFirestore(model: OrderModel): DocumentData {
		const any = model as any
		delete any.id
		return any
	},
	fromFirestore(snap: QueryDocumentSnapshot): OrderModel {
		const data = snap.data()
		return {...data, id: snap.id} as OrderModel
	}
}
