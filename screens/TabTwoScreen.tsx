import * as React from 'react';
import { useState , useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, View , Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Card } from '../components/card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import foodplacespics from '../constants/foodplaces';
import url from '../constants/url';
import Styles from '../constants/styles';
import Timer from '../components/timer'

const swiperRef: any = React.createRef();

export default function TabTwoScreen({ navigation, route }: any) {

  const [ids, setIds] = useState(["verve"]);

  /* 
  * Function: SendSwipes()
  * Params: none
  * Usage: function used to send the user votes to the server.
  *       The server will use the room code that was passed from the previous screen to send the data to the appropriate room.
  */

  const sendSwipes = () => {
		ids.shift(); // to get rid of placeholder id
    return fetch(url + '/send-swipes/' + route.params.roomCode,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userID': route.params.uID,
        swipes: ids
      })

    })
    .then((response) => {
      if (response.status != 200 ){
        console.log("Error" + response.status)
      }
      else{
        console.log(response.status);
        setIds(["reset"]);
      }
    })
  }

  /* 
  * Function: navigateToDec()
  * Params: none
  * Usage: function used to navigate the user to the decision screen after thier votes have been sent to the server.
  *        Passes the list of restaurants UserID, and room code onto the next screen.
  */

  const navigateToDec = () => {
    navigation.navigate('Decision', 
    {
      screen: 'DecisionScreen',
      params:
        {
          rlist: route.params.rlist,
          uID: route.params.uID,
          roomCode: route.params.roomCode
        } 
    }
  );
  }

    return (
      <SafeAreaView style={styles.container}>
          <View style = {styles.swiperContianer}>
            <Swiper
              ref = {swiperRef}
              cards = {route.params.rlist}
              renderCard = {Card}
              infinite
              backgroundColor = "#c2d6f"
              cardHorizontalMargin= {0}
              stackSize={2}
              disableBottomSwipe    
              disableTopSwipe
              onSwipedRight = {(id) => {
                let temp = ids.concat([route.params.rlist[id].restID]);
                setIds(temp);
              }}
              overlayLabels = {{
                left: {
                  title: 'NOPE',       //on swipe left this msg will show up on top right corner of the card
                  style: {
                    label: {
                      backgroundColor: 'red',
                      borderColor: 'black',
                      color: 'white',
                      borderWidth: 1,
                      fontSize: 24
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 10,
                      marginLeft: 7
                    }
                  }
                },
                right: {
                  title: 'VOTE',    //on swipe right msg "vote" will show up on the left side of the card
                  style: {
                    label: {
                      backgroundColor: 'green',
                      borderColor: 'black',
                      color: 'white',
                      borderWidth: 1,
                      fontSize: 24
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 10,
                      marginLeft: -10
                    }
                  }
                }
              }}
            />
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomButtons}>
                <MaterialCommunityIcons.Button        
                    name = 'close'
                    size = {95}
                    backgroundColor = 'transparent'
                    activeOpacity = {0.4}
                    color = 'red'
                    onPress={() => swiperRef.current.swipeLeft()}
                  />

                  <View style={styles.bottomContainer}>
                  {Timer(
                    route.params.rTimer, () => {
                      sendSwipes();
                      navigateToDec();
                    })
                  }
                  </View>

                  <MaterialCommunityIcons.Button
                    name = 'circle-outline'
                    size = {95}
                    backgroundColor = 'transparent'
                    activeOpacity = {0.4}
                    color = 'green'
                    onPress={() => swiperRef.current.swipeRight()}
                  />
            </View>
          </View>
        {/* </View> */}
      </SafeAreaView>
    )
  }

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c2d6f6',
    flex: 1,
    justifyContent: 'center'
  },
  swiperContianer: {
    backgroundColor: '#c2d6f6',
    flex: 0.55,
    alignItems: 'center'
  },
  bottomContainer:{
    flex: 0.45,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
})

