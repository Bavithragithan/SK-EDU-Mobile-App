import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button';
import { GenerateCourseAIModel, GenerateTopicsAIModel } from '../../config/AiModel';
import Prompt from '../../constant/Prompt';
import { db } from './../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailsContext';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';

const AddCourse = () => {
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const router = useRouter();

  const handleGenerateTopic = async () => {
    if (!userInput.trim()) {
      console.error("User input is empty");
      return;
    }

    try {
      setLoading(true);
      const prompt = `${userInput} ${Prompt.IDEA}`;
      const topicIdeas = await GenerateTopicsAIModel(prompt);
      setTopics(topicIdeas);
    } catch (error) {
      console.error("Error generating topic:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopics(prevSelectedTopics => 
      prevSelectedTopics.includes(topic)
        ? prevSelectedTopics.filter(item => item !== topic)
        : [...prevSelectedTopics, topic]
    );
  };

  const handleGenerateCourse = async () => {
    if (!selectedTopics.length) {
      console.error("No topics selected");
      return;
    }

    setLoading(true);
    const prompt = `${selectedTopics.join(", ")} ${Prompt.COURSE}`;

    try {
      const aiResponse = await GenerateCourseAIModel.sendMessage(prompt);
      const rawResponse = aiResponse.response.text();
      const parsedResponse = JSON.parse(rawResponse);

      if (Array.isArray(parsedResponse.courses)) {
        for (const course of parsedResponse.courses) {
          const docId = Date.now().toString();
          await setDoc(doc(db, 'Courses', docId), {
            ...course,
            createdOn: new Date(),
            createdBy: userDetail?.email,
            docId,
          });
        }
        router.push('/(tabs)/home');
      } else {
        console.error("Error: 'courses' is not an array:", parsedResponse.courses);
      }
    } catch (e) {
      console.error("Error generating courses:", e);
    } finally {
      setLoading(false);
    }
  };

  const isTopicSelected = (topic) => selectedTopics.includes(topic);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Course</Text>
      <Text style={styles.subtitle}>What you want to learn today?</Text>
      <Text style={styles.description}>
        Write what course you want to create (Ex. Learn React Js, Digital Marketing Guide, Learn Python)
      </Text>
      <Text style={{
        fontFamily: 'outfit',
        color: Colors.RED,
        fontSize: 15
      }}>Generate course is under development!</Text>

      <TextInput
        placeholder="(Ex. Learn Python, Learn Chemistry)"
        style={styles.textInput}
        numberOfLines={2}
        multiline
        onChangeText={setUserInput}
      />

      <Button text="Generate Topic" type="outline" onPress={handleGenerateTopic} loading={loading} />

      <View style={styles.topicSelectionContainer}>
        <Text style={styles.topicSelectionTitle}>Select all topics you want to add to your course</Text>
        <View style={styles.topicsWrapper}>
          {topics.map((item, index) => (
            <Pressable key={index} onPress={() => handleTopicSelect(item)}>
              <Text style={[styles.topicItem, isTopicSelected(item) && styles.selectedTopic]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedTopics.length > 0 && (
        <Button text="Generate Course" onPress={handleGenerateCourse} loading={loading} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 25,
  },
  description: {
    fontFamily: 'outfit',
    fontSize: 20,
    marginTop: 8,
    color: Colors.GRAY,
  },
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 70,
    marginTop: 5,
    fontSize: 15,
  },
  topicSelectionContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  topicSelectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 14,
  },
  topicsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  topicItem: {
    fontSize: 11,
    padding: 7,
    borderWidth: 0.4,
    borderRadius: 99,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    color: Colors.PRIMARY,
  },
  selectedTopic: {
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
  },
});

export default AddCourse;
