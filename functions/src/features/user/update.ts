import * as functions from "firebase-functions"
import {CLOUD_FUNCTIONS_DEFAULT_REGION, MIN_PASSWORD_LENGTH} from "../../lib/constants"
import {User} from "./types/user"
import {havePageAccess, requireUserSignedIn} from "../auth/verification"
import {throwExpression} from "../../lib/utils/throwExpression"
import {UpdateRequest} from "firebase-admin/lib/auth"
import {auth} from "../../lib/firebaseConfig"
import {setRole} from "./setClaims"
import {UserRepository} from "./data/userRepository"

exports.updateUser = functions.region(CLOUD_FUNCTIONS_DEFAULT_REGION)
	.https
	.onCall(async (data: User, context) => {
		const user = requireUserSignedIn(context)
		const isPasswordChanged = data.password.length >= MIN_PASSWORD_LENGTH

		if (!await havePageAccess(user.uid, "dashboard/users"))
			throwExpression("permission-denied", "You dont have access")

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
