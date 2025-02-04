import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useContext, useState } from 'react';
import Colors from './../../constant/Colors';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailsContext';

export default function SignUp() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {userDetail,setUserDetail}=useContext(UserDetailContext)

    const CreateNewAccount = () => {
        if (!email || !password || !fullName) {
            console.log("Please enter all fields!");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (resp) => {
                const user = resp.user;
                console.log("User created:", user);
                await SaveUser(user);
            })
            .catch(e => {
                console.log("Firebase Auth Error:", e.message);
            });
    };

    const SaveUser = async (user) => {
        try {
            const data={
                name: fullName,
                email: email,
                member: false,
                uid: user.uid
            }
            await setDoc(doc(db, 'users', user.uid), data );
            console.log("User saved to Firestore");

            setUserDetail(data)

            // Navigate to new screen after successful sign-up
            // router.push('/home'); 
        } catch (error) {
            console.log("Firestore Error:", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Create New Account</Text>

            <TextInput 
                placeholder='Full Name' 
                onChangeText={setFullName} 
                style={styles.textInput} 
            />
            <TextInput 
                placeholder='Email' 
                onChangeText={setEmail} 
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput} 
            />
            <TextInput 
                placeholder='Password' 
                onChangeText={setPassword} 
                secureTextEntry={true} 
                style={styles.textInput} 
            />

            <TouchableOpacity onPress={CreateNewAccount} style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <Pressable onPress={() => router.push('/auth/signIn')}>
                    <Text style={styles.linkText}>Sign In Here</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: 100,
        flex: 1,
        padding: 25,
        backgroundColor: Colors.WHITE
    },
    logo: {
        width: 180,
        height: 180
    },
    title: {
        fontSize: 30,
        fontFamily: 'outfit-bold'
    },
    textInput: {
        borderWidth: 1,
        width: '100%',
        padding: 15,
        fontSize: 18,
        marginTop: 20,
        borderRadius: 8
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        marginTop: 25,
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'outfit',
        fontSize: 20,
        color: Colors.WHITE,
        textAlign: 'center'
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        marginTop: 20
    },
    footerText: {
        fontFamily: 'outfit'
    },
    linkText: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold'
    }
});
