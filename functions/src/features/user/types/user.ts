import {Role} from "./role"
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from "firebase-admin/firestore"
import {firestore} from "firebase-admin"
import WithFieldValue = firestore.WithFieldValue

export type User = {
    username: string
    password: string
    name: string
    role: Role
    pages: string[]
    created?: Date
}

export const userConverter: FirestoreDataConverter<User> = {
    toFirestore: (user: WithFieldValue<User>): DocumentData => {
        const {username, ...data} = user
        return data
    },
    fromFirestore: (snap: QueryDocumentSnapshot): User => {
        const data = snap.data()
        return {...data, username: snap.id, created: data.created?.toDate()} as User
    }
}
