import {firestore} from 'firebase-admin'
import CollectionReference = firestore.CollectionReference
import Query = firestore.Query
import SetOptions = firestore.SetOptions
import UpdateData = firestore.UpdateData

export default abstract class FirestoreRepository<T> {
    abstract getId(item: T): string

    abstract getCollectionRef(): CollectionReference<T>

    getQuery(): Query<T> {
        return this.getCollectionRef()
    }

    async get(itemId: string): Promise<T | null> {
        const docRef = this.getCollectionRef().doc(itemId)
        const snapshot = await docRef.get()
        return snapshot.exists ? snapshot.data() as T : null
    }

    async getAll(): Promise<T[]> {
        const snapshot = await this.getQuery().get()
        return snapshot.docs.map(snap => snap.data() as T)
    }

    async save(item: T, setOptions: SetOptions = {merge: true}) {
        const docRef = this.getDocRefForItem(item)
        await docRef.set(item, setOptions)
        return docRef.id
    }

    update(itemId: string, data: UpdateData<T>) {
        return this.getCollectionRef()
            .doc(itemId)
            .update(data)
    }

    delete(itemId: string) {
        return this.getCollectionRef()
            .doc(itemId)
            .delete()
    }

    async transactedGet(t: FirebaseFirestore.Transaction, itemId: string): Promise<T | null> {
        const docRef = this.getCollectionRef().doc(itemId)
        const snapshot = await t.get(docRef)
        return snapshot.exists ? snapshot.data() as T : null
    }

    transactedUpdate(t: FirebaseFirestore.Transaction, itemId: string, data: UpdateData<T>) {
        const docRef = this.getCollectionRef().doc(itemId)
        return t.update(docRef, data)
    }

    transactedSet(t: FirebaseFirestore.Transaction, item: T) {
        const docRef = this.getDocRefForItem(item)
        t.set(docRef, item)
        return docRef.id
    }

    transactedDelete(t: FirebaseFirestore.Transaction, itemId: string) {
        const docRef = this.getCollectionRef().doc(itemId)
        return t.delete(docRef)
    }

    protected getDocRefForItem(item: T) {
        const itemId = this.getId(item)
        const alreadyHaveId = itemId != null && itemId.length > 0
        const collectionRef = this.getCollectionRef()
        return alreadyHaveId ? collectionRef.doc(itemId) : collectionRef.doc()
    }
}
