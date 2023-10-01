import { doc, getDoc } from '@firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../../firebaseConfig';
import { Dispatch } from 'redux';
import { USER_STATE_CHANGE } from '../constants/index';


export function fetchUser() {
    return (dispatch: Dispatch) => {
        const user = FIREBASE_AUTH.currentUser;

        console.log("+++++++user+++++", user?.uid, "+++++++")
        
        if (user) {
            const userRef = doc(FIREBASE_FIRESTORE, 'users', user.uid);
            
            getDoc(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    dispatch({
                        type: USER_STATE_CHANGE,
                        currentUser: snapshot.data()
                    });
                } else {
                    console.log('No such user!');
                }
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
            });
        } else {
            console.log('No user is currently authenticated.');
        }
    };
}
