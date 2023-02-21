import {auth} from "firebase-admin"
import {Role} from "../src/features/user/types/role"
import UserRecord = auth.UserRecord

const admin = require("firebase-admin")
const serviceAccount = require("./adminsdk.json")

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
})

const accountDetails = {
	uid: "owner",
	email: "owner@sinar-gold.com",
	password: "owner123",
	displayName: "Owner Toko"
}

admin
	.auth()
	.createUser(accountDetails)
	.then((user: UserRecord) => {
		console.log("Successfullly created user: ", user)

		admin
			.auth()
			.setCustomUserClaims(user.uid, {role: Role.OWNER})
			.then(() => {
				console.log("Successfully granted owner access")
			})
	})
