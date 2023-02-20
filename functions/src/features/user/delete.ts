import * as functions from 'firebase-functions'
import {CLOUD_FUNCTIONS_DEFAULT_REGION} from "../../lib/constants"
import {havePageAccess, requireUserSignedIn} from "../auth/verification"
import {throwExpression} from "../../lib/utils/throwExpression"
import {auth} from "../../lib/firebaseConfig"
import {UserRepository} from "./data/userRepository"

exports.deleteUser = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
    .https
    .onCall(async (username: string, context) => {
        const user = requireUserSignedIn(context)

        if (!await havePageAccess(user.uid, 'dashboard/users'))
            throwExpression('permission-denied', 'You dont have access')

        await deleteAccount()
        await deleteFromDb()

        function deleteAccount() {
            return auth.deleteUser(username)
        }

        function deleteFromDb() {
            const repository = new UserRepository()
            return repository.delete(username)
        }
    })
