import * as functions from 'firebase-functions'
import {CLOUD_FUNCTIONS_DEFAULT_REGION, MIN_PASSWORD_LENGTH} from "../../lib/constants"
import {User} from "./types/user"
import {isAdminOrHigher, requireUserSignedIn} from "../auth/verification"
import {throwExpression} from "../../lib/utils/throwExpression"
import {UpdateRequest} from "firebase-admin/lib/auth"
import {auth} from "../../lib/firebaseConfig"
import {setRole} from "./setClaims"
import {Role} from './types/role'
import {UserRepository} from "./data/userRepository"

exports.updateUser = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
    .https
    .onCall(async (data: User, context) => {
        const user = requireUserSignedIn(context)
        const isPasswordChanged = data.password.length >= MIN_PASSWORD_LENGTH
        const isRoleValid = Object.values(Role).includes(data.role)

        if (!isRoleValid)
            throwExpression('invalid-argument', `Invalid role: ${data.role}`)
        if (!await isAdminOrHigher(user.uid))
            throwExpression('permission-denied', 'Only admin can call this function')

        await updateAccount()
        await setRole(data.username, data.role)
        await writeToDb()

        function updateAccount() {
            const request: UpdateRequest = {
                displayName: data.name,
                password: isPasswordChanged ? data.password : undefined
            }
            return auth.updateUser(data.username, request)
        }

        function writeToDb() {
            const repository = new UserRepository()
            const {created, password, username, ...updateData} = data
            return repository.update(data.username, updateData)
        }
    })
