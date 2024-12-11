import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import Create from './MenuTab/Run';
import Explore from './MenuTab/Activity';
import Profile from './MenuTab/profile';
import TabBar1 from './MenuTab/TabBar1';
import Home from './MenuTab/Home';
import EditProfile from './screens/EditProfile';
import ActivityChart from './screens/ActivityChart';
import PastRuns from './screens/PastRuns';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="TabBar1" component={TabBar1} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="create" component={Create} />
        <Stack.Screen name="explore" component={Explore} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ActivityChart" component={ActivityChart} />
        <Stack.Screen name="PastRuns" component={PastRuns} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;