import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './navigation'

export default function App() {
  // in the future we may want to have things load, and have a different view
  // e.g. 'loading...' To implement we need a hook and to use state to update 
  // from false to true as needed.
  // I didnt make a dummy hook, for now just leaving it as true
  const isLoadingComplete = true;
  // const colorScheme, might want in future?
  
  if (!isLoadingComplete) {
    // future loading screen
    return null;
  } else {
    return (
      // Safe area deals with varying screen header things on different devices
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    );
  } 
}
