import {GoodsType} from "./goodsType"
import {DocumentData, FieldValue, FirestoreDataConverter, QueryDocumentSnapshot} from "firebase-admin/firestore"
import {firestore} from "firebase-admin"
import PartialWithFieldValue = firestore.PartialWithFieldValue

export type Goods = {
	id: string
	created: Date | null
	type: GoodsType
	category: string
	kindCode: string
	chamferCode: string
	storefrontCode: string
	supplierCode: string
	itemType: string
	photoUrl: string
}

export const goodsConverter: FirestoreDataConverter<Goods> = {
	toFirestore(data: PartialWithFieldValue<Goods>): DocumentData {
		delete data.id
		if (!data.created) data.created = FieldValue.serverTimestamp()
		return data
	},
	fromFirestore(snapshot: QueryDocumentSnapshot): Goods {
		const data = snapshot.data()
		return {...data, id: snapshot.id, created: data.created?.toDate()} as Goods
	}
}
