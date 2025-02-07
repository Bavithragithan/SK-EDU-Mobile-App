import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from '../../constant/Colors'
import Button from '../../components/Shared/Button'
import { GenerateCourseAIModel, GenerateTopicsAIModel } from '../../config/AiModel'
import Prompt from '../../constant/Prompt'
import { db } from './../../config/firebaseConfig'
import { UserDetailContext } from './../../context/UserDetailsContext'
import { useRouter } from 'expo-router'
import { doc, setDoc } from 'firebase/firestore'

export default function AddCourse() {

    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [userInput, setUserInput] = useState();
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const router = useRouter();
    const onGenerateTopic = async () => {
        try {
            setLoading(true);

            if (!userInput) {
                console.error("User input is empty");
                setLoading(false);
                return;
            }

            const PROMPT = userInput + Prompt.IDEA;

            const topicIdea = await GenerateTopicsAIModel(PROMPT);

            console.log(topicIdea);

            setTopics(topicIdea);
        } catch (error) {
            console.error("Error generating topic:", error);
        } finally {
            setLoading(false);
        }
    };

    const onTopicSelect = (topic) => {
        const isAlreadyExist = selectedTopics.find((item => item == topic));
        if (!isAlreadyExist) {
            setSelectedTopics(prev => [...prev, topic])
        }
        else {
            const topics = selectedTopics.filter(item => item !== topic);
            setSelectedTopics(topics);
        }
    }

    const isTopicSelected = (topic) => {
        const selection = selectedTopics.find(item => item == topic);
        return selection ? true : false
    }

    /**
     * Used to Generate Course using AI Model
     */

    const onGenerateCourse = async () => {
        setLoading(true);

        const PROMPT = selectedTopics + Prompt.COURSE;

        try {
            const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
            const textResponse = await aiResp.response.text();
            const courses = JSON.parse(textResponse);

            console.log(courses);

            for (const course of courses) {
                const docId = Date.now().toString();
                await setDoc(doc(db, 'Courses', docId), {
                    ...course,
                    createdOn: new Date(),
                    createdBy: userDetail?.email,
                    docId: docId
                });
            }

            router.push('/(tabs)/home');
            setLoading(false);
        } catch (e) {
            console.error("Error generating courses:", e);
            setLoading(false);
        }
    }


    return (
        <ScrollView style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            flex: 1
        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 30
            }}>Create New Course</Text>

            <Text style={{
                fontFamily: 'outfit',
                fontSize: 25
            }}>What you want to learn today?</Text>

            <Text style={{
                fontFamily: 'outfit',
                fontSize: 20,
                marginTop: 8,
                color: Colors.GRAY
            }}> Write what course you want to create (Ex. Learn React Js, Digital Marketing Guide, Learn Python) </Text>

            <TextInput placeholder='(Ex. Learn Python, Learn Chemistry)'
                style={styles.textInput}
                numberOfLines={2}
                multiline={true}
                onChangeText={(value) => setUserInput(value)}
            />

            <Button text={'Generate Topic'} type='outline' onPress={() => onGenerateTopic()} loading={loading} />

            <View style={{
                marginTop: 15,
                marginBottom: 15
            }}>
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 14
                }}>Select all topics which you want ot add in your course</Text>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 10,
                    marginTop: 6
                }}>
                    {topics.map((item, index) => (
                        <Pressable key={index} onPress={() => onTopicSelect(item)}>
                            <Text style={{
                                fontSize: 11,
                                padding: 7,
                                borderWidth: 0.4,
                                borderRadius: 99,
                                paddingHorizontal: 15,
                                backgroundColor: isTopicSelected(item) ? Colors.PRIMARY : null,
                                color: isTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY
                            }}>{item}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {selectedTopics?.length > 0 && <Button text='Generate Course'
                onPress={() => onGenerateCourse()}
                loading={loading}
            />}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    textInput: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        height: 70,
        marginTop: 5,
        alignItems: 'flex-start',
        fontSize: 15
    }
})