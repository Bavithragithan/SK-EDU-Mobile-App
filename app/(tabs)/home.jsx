import { FlatList, Image, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Home/Header';
import Colors from '../../constant/Colors';
import NoCourse from '../../components/Home/NoCourse';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './../../config/firebaseConfig';
import { UserDetailContext } from '../../context/UserDetailsContext';
import CourseList from '../../components/Home/CourseList';
import PracticeSection from '../../components/Home/PracticeSection';
import CourseProgress from '../../components/Home/CourseProgress';

export default function Home() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetail) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'Courses'), where("createdBy", "==", userDetail?.email));
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

  return (
    <FlatList
      data={[]}
      onRefresh={() => GetCourseList()}
      refreshing={loading}
      ListHeaderComponent={
        <View style={{
          flex: 1,
          backgroundColor: Colors.WHITE
        }}>
          <Image source={require('./../../assets/images/wave.png')}
            style={{
              position: 'absolute',
              width: '100%',
              height: 700
            }}
          />
          <View style={{
            padding: 25,

          }}>
            <Header />
            {courseList.length === 0 ?
              <NoCourse /> :
              <View>
                <CourseProgress courseList={courseList} />
                <PracticeSection />
                <CourseList courses={courseList} />
              </View>
            }
          </View>
        </View>
      } />
  );
}
