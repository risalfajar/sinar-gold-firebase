import {auth} from "../../lib/firebaseConfig"
import {CUSTOM_CLAIMS_ROLE} from "../../lib/constants"
import {Role} from "./types/role"

export function setRole(username: string, role: Role) {
	return auth.setCustomUserClaims(username, {
		[CUSTOM_CLAIMS_ROLE]: role
	})
}
