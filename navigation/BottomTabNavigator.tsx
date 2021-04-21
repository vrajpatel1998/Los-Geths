import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import HomeScreen from '../screens/HomeScreen'
import TabTwoScreen from '../screens/TabTwoScreen'
import CreateRoom from '../screens/CreateRoom'
import JoinRoom from '../screens/JoinRoom';
import DecisionScreen from '../screens/DecisionScreen';
import ReadyUpScreen from '../screens/ReadyUpScreen';

type BottomTabParamList = {
  Home: undefined;
  TabTwo: undefined;
  Decision: undefined;
};

type HomeParamList = {
  HomeScreen: undefined;
  CreateRoom: undefined;
  JoinRoom: undefined;
  ReadyUpScreen: undefined;
};

type TabTwoParamList = {
  TabTwoScreen: undefined;
};

type DecisionParamList = {
  DecisionScreen: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeNavigator} 
        options= {({route}) => (
          {
            tabBarVisible: false
          }
        )
      }
      />
      <Tab.Screen name="TabTwo" component={TabTwoNavigator} 
        options= {({route}) => (
          {
            tabBarVisible: false
          }
        )
      }
      />
      <Tab.Screen name="Decision" component={DecisionNavigator} 
        options= {({route}) => (
          {
            tabBarVisible: false
          }
        )
      }
      />
    </Tab.Navigator>
  );
}

// Each tab has its own navigation stack, so when switching between tabs they should maintain the current stack they're on
// Basically more screens but they're part of a tab!
const HomeStack = createStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerTitleAlign: 'center', headerTitle: 'Home Screen'  }}
      />
      <HomeStack.Screen
        name="CreateRoom"
        component={CreateRoom}
        options={{headerTitleAlign: 'center', headerTitle: 'Create a Room', headerLeft: () => null}}
      />
      <HomeStack.Screen
        name="JoinRoom"
        component={JoinRoom}
        options={{headerTitleAlign: 'center', headerTitle: 'Join Room', headerLeft: () => null}}
      />
      <HomeStack.Screen
        name="ReadyUpScreen"
        component={ReadyUpScreen}
        options={{headerTitleAlign: 'center', headerTitle: 'Ready Up Room' , headerLeft: () => null}}
      />
    </HomeStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Los Gehts' }}
      />
    </TabTwoStack.Navigator>
  );
}

const DecisionStack = createStackNavigator<DecisionParamList>();
function DecisionNavigator(){
  return(
    <DecisionStack.Navigator>
      <DecisionStack.Screen         //Don't need a stack? unless we want to do something with the winner screen?!
        name = "DecisionScreen"
        component={DecisionScreen}
        options={{headerTitle: 'Decision Screen'}}
      />   
    </DecisionStack.Navigator>
  )
}

