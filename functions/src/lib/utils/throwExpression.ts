import * as functions from 'firebase-functions'

export function throwExpression(code: functions.https.FunctionsErrorCode, message: string, details?: unknown): never {
    throw new functions.https.HttpsError(code, message, details)
}
