import * as admin from 'firebase-admin'
import {getFunctions} from 'firebase-admin/functions'

export const app = admin.initializeApp()
export const auth = admin.auth(app)
export const db = admin.firestore(app)
export const storage = admin.storage(app)
export const appFunctions = getFunctions(app)
