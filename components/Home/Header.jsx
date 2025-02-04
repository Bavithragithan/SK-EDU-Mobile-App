import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { UserDetailContext } from './../../context/UserDetailsContext';
import Feather from '@expo/vector-icons/Feather';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const db = getFirestore();
            const userDocRef = doc(db, 'users', user.uid);  
            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        setUserDetail(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user details: ", error);
                });
        }
    }, [setUserDetail]);

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <View>
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 25
                }}>Hello, {userDetail?.name || 'User'}</Text>

                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 17
                }}>Let's Get Started!</Text>
            </View>

            <TouchableOpacity>
                <Feather name="settings" size={32} color="black" />
            </TouchableOpacity>
        </View>
    );
}
