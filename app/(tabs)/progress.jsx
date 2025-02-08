import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Colors from '../../constant/Colors';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './../../config/firebaseConfig';
import { UserDetailContext } from '../../context/UserDetailsContext';
import CourseProgressCard from '../../components/Shared/CourseProgressCard';
import { useRouter } from 'expo-router';

export default function Progress() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  useEffect(() => {
    if (userDetail) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'Courses'), where("createdBy", "==", userDetail?.email),
        orderBy('createdOn', 'desc'));
      const querySnapshot = await getDocs(q);

      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() });
      });

      setCourseList(courses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const renderHeader = () => (
    <View style={{ width: '100%', padding: 20, marginTop: 20, alignItems: 'center' }}>
      {/* <Image source={require('./../../assets/images/wave.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: 700
        }}
      /> */}
      <Text
        style={{
          fontFamily: 'outfit-bold',
          fontSize: 30,
          color: Colors.BLACK,
          marginBlock: 10,
          textAlign: 'center',  // Centers the text
          zIndex: 1,  // Keeps text above the image
        }}
      >
        Course Progress
      </Text>
    </View>
  );

  return (
    <FlatList
      data={courseList}
      onRefresh={() => GetCourseList()}
      refreshing={loading}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() =>
            route.push({
              pathname: '/CourseView/' + item?.docId,
              params: {
                courseParams: JSON.stringify(item),
              },
            })
          }
        >
          <CourseProgressCard item={item} width={'96%'} />
        </TouchableOpacity>
      )}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
