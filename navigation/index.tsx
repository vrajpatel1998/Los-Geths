import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import BottomTabNavigator from './BottomTabNavigator'

export default function Navigation(/*{colorScheme}*/) {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

// in future may have a not found page, or a pop up or something separate from 
// rest of app
type RootStackParamList = {
  Root: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// creates the rootnavigtor containing the bottom tab navigatior that has all of the screens we can navigate to.
function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}