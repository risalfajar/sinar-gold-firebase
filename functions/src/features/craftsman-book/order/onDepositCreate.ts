import * as functions from 'firebase-functions'
import {CLOUD_FUNCTIONS_DEFAULT_REGION, COLLECTION_CRAFTSMAN_ORDER, COLLECTION_CRAFTSMAN_ORDER_DEPOSIT} from "../../../lib/constants"
import CraftsmanOrderModelRepository from "./data/source/modelRepository"
import {db} from "../../../lib/firebaseConfig"
import CraftsmanOrderRepository from "./data/source/orderRepository"
import {FieldValue} from "firebase-admin/firestore"
import {depositConverter} from "./data/deposit"

exports.onDepositCreate = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
    .firestore
    .document(`${COLLECTION_CRAFTSMAN_ORDER}/{orderId}/${COLLECTION_CRAFTSMAN_ORDER_DEPOSIT}/{depositId}`)
    .onCreate(async (snapshot, context) => {
        const deposit = depositConverter.fromFirestore(snapshot)
        await updateModel()
        await updateOrder()

        function updateModel() {
            const modelRepository = new CraftsmanOrderModelRepository(context.params.orderId)
            const modelId = context.params.depositId // depositId is taken from its corresponding model's id
            return modelRepository.update(modelId, {isFinished: true})
        }

        function updateOrder() {
            return db.runTransaction(async (t) => {
                const modelRepository = new CraftsmanOrderModelRepository(context.params.orderId)
                const unfinishedModels = await modelRepository.getUnfinished(t)
                const hasOrderFinished = unfinishedModels.length === 0

                const orderRepository = new CraftsmanOrderRepository()
                const order = await orderRepository.transactedGet(t, context.params.orderId)
                const finishedWeight = +(order!.finishedWeight + deposit.finishedMaterial.goldWeight).toFixed(2)
                const totalCost = order!.totalCost + deposit.totalCost

                orderRepository.transactedUpdate(t, context.params.orderId, {
                    finished: hasOrderFinished ? FieldValue.serverTimestamp() : null,
                    finishedWeight,
                    totalCost
                })
            })
        }
    })

