import { View, Text, Image } from 'react-native'
import React from 'react'
import Button from '../Shared/Button'
import { useRouter } from 'expo-router'

export default function NoCourse() {
  const router=useRouter();

  return (
    <View style={{
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
    }}>
      <Image source={require('./../../assets/images/book.png')}
      style={{
        height: 300,
        width: 300
      }}
      />
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 25,
        textAlign: 'center',
        marginTop: 25
      }}>You Don't Have Any Course</Text>

      {/* <Button text={'+ Create New Course'} onPress={()=>router.push('/addCourse')} /> */}
      <Button text={'Start Enrolling Courses Here...'} 
         onPress={()=>router.push('/(tabs)/explore')}
      />
      
    </View>
  )
}