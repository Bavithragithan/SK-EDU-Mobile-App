import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from '../constant/Colors';
import { useRouter } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './../config/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { UserDetailContext } from "@/context/UserDetailsContext";
import { useContext, useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user);
        const result = await getDoc(doc(db, 'users', user.uid));
        if (result.exists()) {
          setUserDetail(result.data());
          router.replace('/(tabs)/home');
        }
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./../assets/images/landing.png')} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to SK EDU</Text>
        <Text style={styles.subtitle}>Transform your ideas into engaging educational content, effortlessly with AI! 📚</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/signUp')}>
          <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Get started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/signIn')} style={[styles.button, styles.secondaryButton]}>
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>Already have an Account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  image: { width: '100%', height: 300, marginTop: 70 },
  content: {
    padding: 25,
    backgroundColor: Colors.PRIMARY,
    height: '100%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35
  },
  title: { fontSize: 30, textAlign: 'center', color: Colors.WHITE, fontFamily: 'outfit-bold' },
  subtitle: { fontSize: 20, color: Colors.WHITE, marginTop: 20, textAlign: 'center', fontFamily: 'outfit' },
  button: { padding: 15, backgroundColor: Colors.WHITE, marginTop: 20, borderRadius: 10 },
  buttonText: { textAlign: 'center', fontSize: 18, fontFamily: 'outfit' },
  secondaryButton: { backgroundColor: Colors.PRIMARY, borderWidth: 1, borderColor: Colors.WHITE }
});
