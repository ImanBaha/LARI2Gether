import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import Create from './MenuTab/Run';
import Explore from './MenuTab/Activity';
import Profile from './MenuTab/profile';
import TabBar1 from './MenuTab/TabBar1';
import Home from './MenuTab/Home';
import EditProfile from './Profile/EditProfile';
import ActivityChart from './screens/ActivityChart';
import PastRuns from './screens/PastRuns';
import ArenaDetails from './Places/ArenaDetails';
import OldCampusLoopDetails from './Places/OldCampusLoopDetails';
import KZCollegeDetails from './Places/KZCollegeDetails';
import NewCampusLoopDetails from './Places/NewCampusLoopDetails';
import Challenge from './MenuTab/Challenge';
import AddCh from './Challenge/AddCh';
import UpdateCh from './Challenge/UpdateCh';
import ViewCh from './Challenge/ViewCh';
import Note from './Notes/Note';
import AddNote from './Notes/AddNote';
import UpdateNote from './Notes/UpdateNote';
import UserProfile from './Profile/UserProfile';
import ViewRL from './screens/ViewRL';
import ViewLeaderboard from './screens/ViewLeaderboard';
import RunTracker from './MenuTab/Run';
import HealthProfile from './screens/HealthProfile';
import ViewParticipants from './Challenge/ViewParticipants';
import ViewHP from './Challenge/ViewHP';



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
        <Stack.Screen name="ArenaDetails" component={ArenaDetails} />
        <Stack.Screen name="OldCampusLoopDetails" component={OldCampusLoopDetails}/>
        <Stack.Screen name="KZCollegeDetails" component={KZCollegeDetails}/>
        <Stack.Screen name="NewCampusLoopDetails" component={NewCampusLoopDetails}/>
        <Stack.Screen name="Challenge" component={Challenge}/>
        <Stack.Screen name="AddCh" component={AddCh}/>
        <Stack.Screen name="UpdateCh" component={UpdateCh}/>
        <Stack.Screen name="ViewCh" component={ViewCh}/>
        <Stack.Screen name="Note" component={Note}/>
        <Stack.Screen name="AddNote" component={AddNote}/>
        <Stack.Screen name="UpdateNote" component={UpdateNote}/>
        <Stack.Screen name="UserProfile" component={UserProfile}/>
        <Stack.Screen name="ViewRL" component={ViewRL}/>
        <Stack.Screen name="ViewLeaderboard" component={ViewLeaderboard}/>
        <Stack.Screen name="RunTracker" component={RunTracker}/>
        <Stack.Screen name="HealthProfile" component={HealthProfile}/>
        <Stack.Screen name="ViewParticipants" component={ViewParticipants}/>
        <Stack.Screen name="ViewHP" component={ViewHP}/>
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;