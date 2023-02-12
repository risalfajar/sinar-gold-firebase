import * as functions from 'firebase-functions'
import {CLOUD_FUNCTIONS_DEFAULT_REGION, COLLECTION_CRAFTSMAN_ORDER, COLLECTION_CRAFTSMAN_ORDER_DEPOSIT} from "../../../lib/constants"
import CraftsmanOrderModelRepository from "./data/modelRepository"

exports.onDepositCreate = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
    .firestore
    .document(`${COLLECTION_CRAFTSMAN_ORDER}/{orderId}/${COLLECTION_CRAFTSMAN_ORDER_DEPOSIT}/{depositId}`)
    .onCreate((snapshot, context) => {
        const modelRepository = new CraftsmanOrderModelRepository(context.params.orderId)
        const modelId = context.params.depositId // depositId is taken from its corresponding model's id
        return modelRepository.update(modelId, {isFinished: true})
    })
