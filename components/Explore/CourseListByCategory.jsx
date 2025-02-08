import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { imageAssets } from '../../constant/Option';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import CourseList from '../Home/CourseList';

export default function CourseListByCategory({ category, heading }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        GetCourseListByCategory();
    }, [category]);

    const GetCourseListByCategory = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'Courses'), where('category', '==', category));
            const querySnapshot = await getDocs(q);
            const fetchedCourses = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
            setCourses(fetchedCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
        setLoading(false);
    };

    return (
        <View>
            {courses?.length > 0 && <CourseList courses={courses} heading={category} enroll={true} />}
        </View>
    );
}
