export type Payment = {
	method: PaymentMethod,
	amount: number
	details: CashDetails & TransferDetails & DebitDetails & CreditDetails
}

export enum PaymentMethod {
	CASH = "CASH", TRANSFER = "TRANSFER", DEBIT = "DEBIT", KREDIT = "KREDIT"
}

export type CashDetails = {}

export type TransferDetails = {
	storeAccount: string
	customerAccount: string
}

export type DebitDetails = {
	storeAccount: string
	fee: number
}

export type CreditDetails = {
	storeAccount: string
	cardNumber: string
	fee: number
}
