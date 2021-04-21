import * as React from 'react';
import { StyleSheet, Text, View , TextInput, TouchableOpacity, Image} from 'react-native';
import url from '../constants/url';
import Styles from '../constants/styles';

export default function JoinRoom({ navigation }: any) {
  // room code
  const [value, onChangeText] = React.useState('');
  const[isDisabled, setDisabled] = React.useState(false);

  /* 
  * Function: joinRoom()
  * Params: none
  * Usage: function used to make a fetch call to the backend server to join a room.
  *       The server will use the room code that was entered by the user and request to join that room.
  *       Returns a room, user ID, time and list of restaurants from the server.
  *       Navigates the user to the Ready up room.
  */
  const joinRoom = () => {
    setDisabled(true);
    let room = value;
    fetch(url + '/join-room/' + value)
    .then((response) => response.json())
    .then((json) => {navigation.navigate('ReadyUpScreen', {
                      rlist: json.restaurants,
                      uID: json.userID,
                      roomCode: json.roomCode,
                      rTimer: json.duration
                    });
                   })
    .catch((error) => {
      console.log("Error joining room:")
      console.error(error);
      setDisabled(false);
    })
  }


  return (
    <View style={Styles.outerView}>
      <View style={Styles.innerView}>
        <Text style={styles.title}>Enter a room code</Text>
        <TextInput
          style={styles.userentry}
          placeholder = 'room code'
          onChangeText={text => onChangeText(text)}
          value={value}
        />

        {isDisabled ? <Text>Loading Room</Text>:
          <TouchableOpacity
            disabled = {isDisabled}
            onPress = {joinRoom}
          >
            <Image source={require('../assets/buttons/join.png')}/>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#33FFEC',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userentry: {
     height: 40,
     borderColor: 'black',
     borderWidth: 1,
     margin: 4, 
     padding: 10,
  }
})