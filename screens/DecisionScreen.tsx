import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import url from '../constants/url';
import Styles  from '../constants/styles';
import {  Title, Card, Avatar, Paragraph } from 'react-native-paper';

const LeftContent = () => <Avatar.Image size={50} source={require('../assets/icon.png')} />

export default function DecisionScreen({ navigation, route }: any) {
    const [winner, setWinner] = useState("LOS GEHTING A WINNER");
		const [winnerName, setName] = useState("");
		const [winnerImg, setImg] = useState("");
    const [winnerAddr, setAddr]= useState("");
    

  /* 
  * Function: getDecision()
  * Params: none
  * Usage: function used to make a fetch call to the backend server to get the results of the room based on the group's vote.
  *       The function returns the name of the winning restaurant.
  *       It then matches the winning restaurant in the restarant list and finds the winning restaurant 
  *       sets the winning restaurants details into the appropriate states which are later used to neatly display the winners. 
  */
    const getDecision = () => {
         fetch(url + '/decide/' + route.params.roomCode)
        .then((response) => response.json())
        .then((json) => {
            if (json.winner){
              setWinner(json.winner);
              setAddr(json.address);
              for(const element of route.params.rlist) {
                if (json.winner == element.restID) {
                  setName(element.name);
                  setImg('data:image/jpeg;base64,' + element.ImgList[0]);
                  //setAddr(element.location);
                }
              }
            }
            else{
              console.log('Error');
            }
          })
    }



    return(
        <View style={Styles.outerView}>
          <View style={Styles.innerView}>
            {winnerImg == "" ?
              <View>
                <TouchableOpacity
                  onPress={getDecision}
                  style = {styles.decisionButton}
                >
                  <Text style={Styles.title}>Get Results</Text>
                </TouchableOpacity>
              </View>:
              <View>
                <Card style={styles.card}>
                  <Card.Title title= "Winner" subtitle = "The winning restaurant is.." left={LeftContent}/>
                  <Card.Content>
                    <Title>{winnerName}</Title>
                    <Paragraph>Address: {winnerAddr}</Paragraph>
                  </Card.Content>
                  <Card.Cover source={{ uri: winnerImg, width: 500, height: 500}} />
                </Card>
              </View>
            }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#33FFEC',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        justifyContent: 'center'
    },
    card: {
      width: '100%',
      height: '60%',
      justifyContent: 'center'
    },
    decisionButton: {
      margin: 4,
      width: '100%',
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: '#ffa600',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10
    }
})