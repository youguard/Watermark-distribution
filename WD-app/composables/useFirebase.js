import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDDRskIYK_PeAJaUhevqzFo_ESdRrR6_uM",
    authDomain: "youguard-3fdd4.firebaseapp.com",
    projectId: "youguard-3fdd4",
    storageBucket: "youguard-3fdd4.firebasestorage.app",
    messagingSenderId: "126772319506",
    appId: "1:126772319506:web:b4f92d813d0372bfc44fcb",
    measurementId: "G-BPCDWG7XWP"
}

export const useFirebase = () => {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    const saveDraftToFirebase = async (draft) => {
        try {
            const docRef = await addDoc(collection(db, 'drafts'), draft)
            console.log('Document written with ID: ', docRef.id)
            return docRef.id
        } catch (e) {
            console.error('Error adding document: ', e)
            throw e
        }
    }

    const getDraftsFromFirebase = async () => {
        const drafts = []
        const querySnapshot = await getDocs(collection(db, 'drafts'))
        querySnapshot.forEach((doc) => {
            drafts.push({ id: doc.id, ...doc.data() })
        })
        return drafts
    }

    const getDraftFromFirebase = async (id) => {
        try {
            const docRef = doc(db, 'drafts', id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() }
            } else {
                console.log('No such document!')
                return null
            }
        } catch (e) {
            console.error('Error getting document:', e)
            throw e
        }
    }

    const updateDraftInFirebase = async (id, draft) => {
        try {
            const docRef = doc(db, 'drafts', id)
            await updateDoc(docRef, draft)
            console.log('Document updated successfully')
        } catch (e) {
            console.error('Error updating document: ', e)
            throw e
        }
    }

    return {
        saveDraftToFirebase,
        getDraftsFromFirebase,
        getDraftFromFirebase,
        updateDraftInFirebase
    }
}