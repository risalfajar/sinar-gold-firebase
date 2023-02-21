import * as functions from "firebase-functions"
import {CLOUD_FUNCTIONS_DEFAULT_REGION, COLLECTION_CRAFTSMAN_ORDER, COLLECTION_CRAFTSMAN_ORDER_ADVANCE} from "../../lib/constants"
import {cashAdvanceConverter} from "./data/advance"
import CraftsmanOrderRepository from "./data/source/orderRepository"
import {FieldValue} from "firebase-admin/firestore"

exports.onAdvanceCreate = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
	.firestore
	.document(`${COLLECTION_CRAFTSMAN_ORDER}/{orderId}/${COLLECTION_CRAFTSMAN_ORDER_ADVANCE}/{advanceId}`)
	.onCreate((snapshot, context) => {
		const advance = cashAdvanceConverter.fromFirestore(snapshot)
		const orderId = context.params.orderId
		const orderRepository = new CraftsmanOrderRepository()
		return orderRepository.update(orderId, {advancesTotal: FieldValue.increment(advance.amount)})
	})
