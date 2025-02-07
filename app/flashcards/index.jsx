import { View, Text, Image, Pressable, FlatList, Dimensions, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';
import Button from '../../components/Shared/Button'
import FlipCard from 'react-native-flip-card';
import * as Progress from 'react-native-progress';



export default function Flashcards() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const flashcard = course?.flashcards;
    const [currentPage, setCurrentPage] = useState(0);
    const router = useRouter();
    const width = Dimensions.get('screen').width

    const onScroll = (event) => {
        const index = Math.round(event?.nativeEvent?.contentOffset.x / width)
        setCurrentPage(index);
    }

    const GetProgress = (currentPage) => {
        const perc = (currentPage / flashcard?.length);
        return perc;
    }

    return (
        <View>
            <Image source={require('./../../assets/images/wave.png')}
                style={{
                    height: 700,
                    width: '100%'
                }}
            />
            <View style={{
                position: 'absolute',
                padding: 25,
                width: '100%'
            }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </Pressable>
                    <Text style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 25,
                        color: Colors.WHITE
                    }}>{currentPage + 1} of {flashcard?.length}</Text>
                </View>

                <View style={{
                    marginTop: 20
                }}>
                    <Progress.Bar progress={GetProgress(currentPage+1)} width={Dimensions.get('window').width * 0.85} color={Colors.WHITE} height={10} />
                </View>

                <FlatList
                    data={flashcard}
                    horizontal={true}
                    pagingEnabled
                    onScroll={onScroll}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                height: 500,
                                marginTop: 60
                            }}>
                            <FlipCard style={styles.flipCard}>
                                {/* Face Side */}
                                <View style={styles.frontCard}>
                                    <Text style={{
                                        fontFamily: 'outfit-bold',
                                        fontSize: 28
                                    }}>{item?.front}</Text>
                                </View>
                                {/* Back Side */}
                                <View style={styles.backCard}>
                                    <Text style={{
                                        width: Dimensions.get('screen').width * 0.78,
                                        fontFamily: 'outfit',
                                        fontSize: 28,
                                        padding: 30,
                                        textAlign: 'center',
                                        color: Colors.WHITE
                                    }}>{item?.back}</Text>
                                </View>
                            </FlipCard>
                        </View>
                    )}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    flipCard: {
        width: Dimensions.get('screen').width * 0.78,
        height: 400,
        backgroundColor: Colors.WHITE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginHorizontal: Dimensions.get('screen').width * 0.05,
    },

    frontCard: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    backCard: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        padding: 20,
        borderRadius: 20,
    }
});
