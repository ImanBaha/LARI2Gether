import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import Profile from './profile';  
import Home from './Home';  
import TabBar from '../components/TabBar'; // Import your custom TabBar
import Run from './Run';
import Activity from './Activity';
import Challenge from './Challenge';
import RunTracker from './Run';

const Tab = createBottomTabNavigator();

export default function TabBar1() {
    return (
        <Tab.Navigator
            initialRouteName="Challenge"
            screenOptions={{
                tabBarActiveTintColor: '#42f44b',
                tabBarInactiveTintColor: 'black',
                headerShown: false, // Hide the header for all screens
            }}
            
            tabBar={props => <TabBar {...props} />} // Use your custom TabBar here
        >
             <Tab.Screen 
                name="Challenge" 
                component={Challenge} 
                options={{ tabBarLabel: 'Challenge' }}  
            />
            <Tab.Screen 
                name="Activity" 
                component={Activity} 
                options={{ tabBarLabel: 'Activity' }}  
            />
            <Tab.Screen 
                name="Home" 
                component={Home} 
                options={{ tabBarLabel: 'Info' }}  
            />
           
            <Tab.Screen 
                name="Profile" 
                component={Profile} 
                options={{ tabBarLabel: 'Profile' }}  
            />
        </Tab.Navigator>
    );
}
