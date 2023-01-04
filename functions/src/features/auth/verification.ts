import * as functions from 'firebase-functions'
import {throwExpression} from "../../lib/utils/throwExpression"
import {Role} from "../user/types/role"
import {CUSTOM_CLAIMS_ROLE} from "../../lib/constants"
import {auth} from '../../lib/firebaseConfig'

// Authority data of a user is stored in two places:
// 1. Firestore
// 2. Auth custom claims
// Storing it in firestore allows admins to change a user's authority easily, then if a change is detected,
// a firestore onUpdate trigger will be called, and it will update the corresponding user's custom claims.
// Storing it in custom claims allows the system to check user's authority without accessing the firestore db,
// saving cost on read calls.

export function requireUserSignedIn(context: functions.https.CallableContext) {
    return context.auth ?? throwExpression('unauthenticated', 'User need to sign in first')
}

export async function isAdminOrHigher(username: string): Promise<boolean> {
    const role = await getRole(username)
    return role === Role.ADMIN || role === Role.OWNER
}

export async function getRole(username: string): Promise<string> {
    const userRecord = await auth.getUser(username)
    return userRecord.customClaims?.[CUSTOM_CLAIMS_ROLE] ?? ''
}

export function setUserRole(username: string, role: Role) {
    return auth.setCustomUserClaims(username, {[CUSTOM_CLAIMS_ROLE]: role})
}

export function clearCustomClaims(username: string) {
    return auth.setCustomUserClaims(username, null)
}
