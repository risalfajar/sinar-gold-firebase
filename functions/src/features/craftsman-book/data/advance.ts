import {DocumentData, FieldValue, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue} from "firebase-admin/firestore"

export type CashAdvance = {
    id: string
    created: Date | null
    amount: number
}

export const cashAdvanceConverter: FirestoreDataConverter<CashAdvance> = {
	toFirestore: function (data: WithFieldValue<CashAdvance>): DocumentData {
		const any = data as any
		delete any.id
		if (!any.created) any.created = FieldValue.serverTimestamp()
		return any
	},
	fromFirestore: function (snap: QueryDocumentSnapshot): CashAdvance {
		const data = snap.data()
		return {...data, id: snap.id, created: data.created?.toDate()} as CashAdvance
	}
}
