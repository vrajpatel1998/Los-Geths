import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native';
import Styles from '../constants/styles';

/* 
* Home screen provides the user with the option to either go to create a room or join a room
* It navigates them to the appropriate room based on thier choice.
*/
export default function HomeScreen({ navigation }: any) {
  return (
    <View style={Styles.outerView}>
    <View style={Styles.innerView}>
      <Text style={Styles.title}>Los Gehts</Text>   
      {/* <Image source={require('../assets/icon.png')} /> */}
      <View>
        
        <TouchableOpacity
          style={Styles.button}
          onPress={() => navigation.navigate('CreateRoom')}
        >
          <Image source={require('../assets/buttons/createRoom.png')} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={Styles.button}
          onPress={() => navigation.navigate('JoinRoom')}
        >
          <Image source={require('../assets/buttons/joinRoom.png')} />
        </TouchableOpacity>
        
      </View>
    </View>
    </View>
  );
}
