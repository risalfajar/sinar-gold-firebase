import {Goods} from "../data/goods"
import {DocumentData, FieldValue, FirestoreDataConverter, QueryDocumentSnapshot} from "firebase-admin/firestore"
import {firestore} from "firebase-admin"
import PartialWithFieldValue = firestore.PartialWithFieldValue

export type GoodsHistory = {
	id: string
	created: Date | null
	type: HistoryType
	goods: Goods
	oldGoods?: Goods
}

export enum HistoryType {
	IN = "IN",
	MOVE = "MOVE",
	SOLD = "SOLD",
}

export const goodsHistoryConverter: FirestoreDataConverter<GoodsHistory> = {
	toFirestore(data: PartialWithFieldValue<GoodsHistory>): DocumentData {
		delete data.id
		if (!data.created) data.created = FieldValue.serverTimestamp()
		return data
	},
	fromFirestore(snapshot: QueryDocumentSnapshot): GoodsHistory {
		const data = snapshot.data()
		return {...data, id: snapshot.id, created: data.created?.toDate()} as GoodsHistory
	}
}
