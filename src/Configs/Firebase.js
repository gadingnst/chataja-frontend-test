import Firebase from 'firebase'
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID,
    FIREBASE_APP_ID
} from 'react-native-dotenv'

const FirebaseSDK = () => {
    if (!Firebase.apps.length) {
        return Firebase.initializeApp({
            apiKey: FIREBASE_API_KEY,
            authDomain: FIREBASE_AUTH_DOMAIN,
            databaseURL: FIREBASE_DATABASE_URL,
            projectId: FIREBASE_PROJECT_ID,
            appId: FIREBASE_APP_ID
        })
    }
    return Firebase.app()
}

export default FirebaseSDK()
