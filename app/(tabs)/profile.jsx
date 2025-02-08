import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { ProfileMenu } from './../../constant/Option';
import { UserDetailContext } from '../../context/UserDetailsContext';
import Colors from '../../constant/Colors';

export default function Profile() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const onMenuClick = (menu) => {
    if (menu.name.toLowerCase() === 'logout') {
      signOut(auth)
        .then(() => {
          setUserDetail(null);
          router.push('/');
        })
        .catch((error) => {
          console.error('Logout Error:', error);
        });
    } else if (menu.path) {
      router.push(menu.path);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>

      <View style={{
        alignItems: 'center'
      }}>
        <Image source={require('./../../assets/images/logo.png')} style={{
          width: 180,
          height: 180,
        }} />

        {userDetail ? (
          <View style={{ marginBottom: 20, padding: 15, backgroundColor: Colors.WHITE, borderRadius: 10 }}>
            <Text style={{ fontSize: 25, fontFamily: 'outfit-bold', textAlign: 'center' }}>{userDetail.name}</Text>
            <Text style={{ fontSize: 20, color: Colors.GRAY }}>{userDetail.email}</Text>
          </View>
        ) : (
          <Text style={{ fontSize: 16, color: Colors.RED }}>User details not available</Text>
        )}
      </View>



      <FlatList
        data={ProfileMenu}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            }}
            onPress={() => onMenuClick(item)}
          >
            <Ionicons name={item.icon} size={24} color="black" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
