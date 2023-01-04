import * as functions from 'firebase-functions'
import {CLOUD_FUNCTIONS_DEFAULT_REGION, MIN_PASSWORD_LENGTH, USERNAME_SUFFIX} from "../../lib/constants"
import {User} from "./types/user"
import {isAdminOrHigher, requireUserSignedIn} from "../auth/verification"
import {throwExpression} from "../../lib/utils/throwExpression"
import {CreateRequest} from "firebase-admin/lib/auth"
import {auth} from "../../lib/firebaseConfig"
import {setRole} from "./setClaims"
import {Role} from './types/role'
import {UserRepository} from "./data/userRepository"

exports.createUser = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
    .https
    .onCall(async (data: User, context) => {
        const user = requireUserSignedIn(context)
        const isPasswordValid = data.password.length >= MIN_PASSWORD_LENGTH
        const isRoleValid = Object.values(Role).includes(data.role)

        if (!isPasswordValid)
            throwExpression('invalid-argument', `Password must be at least ${MIN_PASSWORD_LENGTH} chars`)
        if (!isRoleValid)
            throwExpression('invalid-argument', `Invalid role: ${data.role}`)
        if (!await isAdminOrHigher(user.uid))
            throwExpression('permission-denied', 'Only admin can call this function')

        await createAccount()
        await setRole(data.username, data.role)
        await writeToDb()

        function createAccount() {
            const account: CreateRequest = {
                uid: data.username,
                email: data.username + USERNAME_SUFFIX,
                emailVerified: false,
                password: data.password,
                displayName: data.name,
                disabled: false,
            }
            return auth.createUser(account)
        }

        function writeToDb() {
            const repository = new UserRepository()
            return repository.save({...data, password: "", created: new Date()})
        }
    })
