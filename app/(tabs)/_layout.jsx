import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{headerShown:false}}>
            <Tabs.Screen name='home'
                options={{
                    tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
                    tabBarLabel: 'Home'
                }}
            />
            <Tabs.Screen name='explore'
                options={{
                    tabBarIcon: ({ color, size }) => <AntDesign name="search1" size={size} color={color} />,
                    tabBarLabel: 'Explore'
                }}
            />
            <Tabs.Screen name='progress'
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="analytics" size={size} color={color} />,
                    tabBarLabel: 'Progress'
                }}
            />
            <Tabs.Screen name='profile'
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
                    tabBarLabel: 'Profile'
                }}
            />
        </Tabs>
    )
}