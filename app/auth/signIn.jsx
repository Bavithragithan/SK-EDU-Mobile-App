import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable, ToastAndroid } from 'react-native';
import React, { useContext, useState } from 'react';
import Colors from './../../constant/Colors';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailsContext';
import { ActivityIndicator } from 'react-native';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);

    const onSignInClick = () => {
        setLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then(async (resp) => {
                const user = resp.user;
                console.log(user);
                await getUserDetail(user.uid);
                setLoading(false);
                router.replace('/(tabs)/home')
            }).catch(e => {
                console.log(e);
                ToastAndroid.show('Incorrect Email & Password', ToastAndroid.BOTTOM);
                setLoading(false)
            });
    };

    const getUserDetail = async (uid) => {
        try {
            const result = await getDoc(doc(db, 'users', uid));
            if (result.exists()) {
                setUserDetail(result.data());
            } else {
                console.log("User not found in Firestore");
            }
        } catch (error) {
            console.log("Firestore Error:", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/images/logo.png')} style={styles.logo} />

            <Text style={styles.title}>Welcome Back</Text>

            <TextInput
                placeholder='Email'
                keyboardType='email-address'
                autoCapitalize='none'
                style={styles.textInput}
                onChangeText={(value) => setEmail(value)}
            />
            <TextInput
                placeholder='Password'
                secureTextEntry={true}
                style={styles.textInput}
                onChangeText={(value) => setPassword(value)}
            />

            <TouchableOpacity onPress={onSignInClick} disabled={loading} style={styles.button}>
                {!loading ? <Text style={styles.buttonText}>Sign In</Text> : <ActivityIndicator size={'large'} color={Colors.WHITE} />}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <Text style={styles.text}>Don't have an account?</Text>
                <Pressable onPress={() => router.push('/auth/signUp')}>
                    <Text style={styles.signupText}>Create New Here</Text>
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
        borderRadius: 8,
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
    signupContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        marginTop: 20
    },
    text: {
        fontFamily: 'outfit'
    },
    signupText: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold'
    }
});
