import {User, userConverter} from "../types/user"
import {COLLECTION_USERS} from "../../../lib/constants"
import FirestoreRepository from "../../../lib/data/firestoreRepository"
import {CollectionReference} from "firebase-admin/firestore"
import {db} from "../../../lib/firebaseConfig"

export class UserRepository extends FirestoreRepository<User> {
	getId(item: User): string {
		return item.username
	}

	getCollectionRef(): CollectionReference<User> {
		return db.collection(COLLECTION_USERS).withConverter(userConverter)
	}
}
