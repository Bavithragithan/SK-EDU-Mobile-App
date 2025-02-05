import { FlatList, View } from 'react-native';
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

  useEffect(() => {
    if (userDetail) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    try {
      const q = query(collection(db, 'Courses'), where("createdBy", "==", userDetail?.email));
      const querySnapshot = await getDocs(q);

      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() });
      });

      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View style={{ padding: 25, flex: 1, backgroundColor: Colors.WHITE }}>
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
      } />
  );
}
