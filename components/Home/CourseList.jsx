import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { imageAssets } from './../../constant/Option'
import Colors from '../../constant/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function CourseList({ courses }) {

    const route = useRouter();
    return (
        <View style={{ marginTop: 15 }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 25 }}>Courses</Text>

            <FlatList
                data={courses}
                horizontal={true}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => route.push({
                            pathname: '/CourseView/' + item?.docId,
                            params: {
                                courseParams: JSON.stringify(item)
                            }
                        })}
                        style={styles.courseContainer}>
                        <Image source={imageAssets[item.banner_image]}
                            style={{
                                width: '100%',
                                height: 150,
                                borderRadius: 15

                            }}
                        />
                        <Text style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 18,
                            marginTop: 10
                        }}>{item.courseTitle}</Text>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                            marginTop: 5
                        }}>
                            <Feather name="book-open" size={24} color="black" />
                            <Text style={{
                                fontFamily: 'outfit'
                            }}>{item?.chapters?.length} Chapters</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    courseContainer: {
        padding: 10,
        backgroundColor: Colors.BG_GRAY,
        margin: 6,
        borderRadius: 15,
        width: 260
    }
})