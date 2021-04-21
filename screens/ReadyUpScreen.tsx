import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import url from '../constants/url';
import Styles from '../constants/styles';

export default function ReadyUpScreen({ navigation, route }: any) {

  const waitRoom = () => {
    fetch(url + '/ready/' + route.params.roomCode)
    .then((response) => {
        if (response.status != 200) {
          console.log("Ready up error");
        } else {

          navigation.navigate('TabTwo',
            { screen: 'TabTwoScreen' ,
              params:
                { rlist: route.params.rlist,
                  uID: route.params.uID,
                  roomCode: route.params.roomCode,
                  rTimer: route.params.rTimer
                }}
          )
        }
      })
  }
   
  const checkRoom = () => {
    return fetch(url + '/ready/' + route.params.roomCode,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'Content-Type': 'application/x-www-form-urlencoded'
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: route.params.uID
        })
      })
      .then((response) => {
          console.log(response.status)
          if(response.status == 200){
            navigation.navigate('TabTwo',
            { screen: 'TabTwoScreen' ,
              params:
                { rlist: route.params.rlist,
                  uID: route.params.uID,
                  roomCode: route.params.roomCode,
                  rTimer: route.params.rTimer}}
          )
          }
          else{
              console.log("Invalid user trying to start")
              //Alert.alert("Only the owner can start?")
          }
          });
   }
  
  waitRoom() //call wait. This shouldn't matter if the host is doing this too
  //Render screen
  return (
        <View style={Styles.outerView}>
          <View style={Styles.innerView}>
            <Text style={styles.text}>The Room Code: {route.params.roomCode}</Text>
            {route.params.uID ==1?
                <TouchableOpacity
                    onPress={checkRoom}
                >
                <Image source={require('../assets/buttons/ready.png')}/>
                </TouchableOpacity>:
                <Text style= {styles.title}>Waiting for the Host to start!</Text>
            }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        includeFontPadding: true,
        textDecorationStyle: 'double',
        margin: 4
    }
})