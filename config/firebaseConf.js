import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, SENDER_ID } from "@env";


export const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectID: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: SENDER_ID
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const removeItem = (item) => {
    //console.log(item.id, 'to be removed');
    onValue(ref(database, 'wines/'), (snapshot) => {
        const data = snapshot.val()
        if (data === null) {
            return;
        } else {
            const keyData = Object.entries(data)
            //console.log(keyData);
            for (const key of keyData) {
                const dbKey = key[0]
                if (key[1].id === item.id) {
                    remove(ref(database, 'wines/' + dbKey))
                    //console.log('data poistettu');
                }
            }
        }
    })
}

export const saveItem = (item) => {
    //console.log(item);
    push(ref(database, 'wines/'), {
        'name': item.name,
        'type': item.type,
        'img': item.img,
        'country': item.country,
        'description': item.description,
        'id': item.id,
    })
}
