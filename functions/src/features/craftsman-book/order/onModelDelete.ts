import * as functions from 'firebase-functions'
import {CLOUD_FUNCTIONS_DEFAULT_REGION, COLLECTION_CRAFTSMAN_ORDER, COLLECTION_CRAFTSMAN_ORDER_MODEL} from "../../../lib/constants"
import CraftsmanOrderRepository from "./data/source/orderRepository"
import {FieldValue} from "firebase-admin/firestore"

exports.onCraftsmanOrderModelDelete = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
    .firestore
    .document(`${COLLECTION_CRAFTSMAN_ORDER}/{orderId}/${COLLECTION_CRAFTSMAN_ORDER_MODEL}/{modelId}`)
    .onDelete((snapshot, context) => {
        const orderId = context.params.orderId
        const repository = new CraftsmanOrderRepository()
        return repository.update(orderId, {modelCount: FieldValue.increment(-1)})
    })

