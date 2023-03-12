import {Payment} from "./payment"
import {DocumentData, FieldValue, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, SetOptions} from "firebase-admin/firestore"

export type Sales = {
	id: string
	createdAt: Date | null
	createdBy: string
	status: SalesStatus
	customer: {
		name: string
		type: CustomerType
		phoneNumber: string
		address: string
		salesmanCode: string
		memberId?: string
	}
	goods: Record<string, SoldGoods>
	priceDetails: {
		sale: number
		paid: number
		remaining: number
	}
	payments: Payment[]
}

export enum SalesStatus {
	WAITING = "WAITING",
	VALIDATED = "VALIDATED",
	CANCELED = "CANCELED"
}

export enum CustomerType {
	MEMBER = "MEMBER",
	NON_MEMBER = "NON_MEMBER"
}

export type SoldGoods = {
	id: string
	marketplace: string
	name: string
	weight: number
	groupCode: string
	attribute: {
		name: string
		price: number
		weight: number
	}
	price: {
		goodsPrice: number
		salePrice: number
		cost: number
		total: number
	}
	note: string
}

export const salesConverter: FirestoreDataConverter<Sales> = {
	toFirestore(data: PartialWithFieldValue<Sales>, options?: SetOptions): DocumentData {
		delete data.id
		if (!data.createdAt) data.createdAt = FieldValue.serverTimestamp()
		return data
	},
	fromFirestore(snap: QueryDocumentSnapshot): Sales {
		const data = snap.data()
		return {...data, id: snap.id, createdAt: data.createdAt.toDate()} as Sales
	}
}
