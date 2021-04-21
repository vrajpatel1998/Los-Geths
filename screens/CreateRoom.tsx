import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Modal, Button} from 'react-native';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import url from '../constants/url';
import { max } from 'react-native-reanimated';
import Styles from '../constants/styles';
import { ActivityIndicator, Colors } from 'react-native-paper';


export default function CreateRoom({ navigation }: any) {
  const[isDisabled, setDisabled] = useState(false);
  const [errmsg, setErrmsg]= useState('')
  const [location, setLocation]= useState({})
  const [Longitude, setLongitude]= useState('')
  const [Latitude, setLatitude]= useState('')
  const [time, setTime] = useState(60)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1)

  
  useEffect(() => {
    getLocation();
  }, []);
  

  /* 
  * Function: GetLocation()
  * Params: none
  * Usage: function used to perform a permissions call to the user device to get thier location.
  *       This location is used by the server to get nearby restaraunts.
  *       If permission is denied then we will use the default location of Santa Cruz.
  */
  const getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted'){
      console.log("permission not granted");
      setErrmsg("Permission not granted");
      setLatitude('36.9721726');
      setLongitude('-122.0255182');
      return;
    }
    const userLocation = await Location.getCurrentPositionAsync();
    setLongitude( JSON.stringify(userLocation.coords.longitude))
    setLatitude(JSON.stringify(userLocation.coords.latitude))
    setLocation(userLocation)
    return;
  }

  /* 
  * Function: getCode()
  * Params: none
  * Usage: function used to make a fetch call to the backend server to create a room.
  *       The server will take in the time, location and price settings for the search.
  *       Returns a sharable room code and navigates the user to the ready up room.
  */
  const getCode = () => {
    setDisabled(true);
    return fetch(url + '/create-room',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timer: time,
        longitude: Longitude,
        latitude: Latitude,
        minPrice: minPrice,
        maxPrice: maxPrice
      })
    })
    .then((response) => response.json())
    .then((json) => { navigation.navigate('ReadyUpScreen', {
                        rlist: json.restaurants,
                        uID: json.userID,
                        roomCode: json.roomCode,
                        rTimer: json.duration
                      });
                    })
    .catch((error) => {
      console.log("Error in creating room:")
      console.error(error);
      // The request didn't work, so allow the user to retry
      setDisabled(false);
    })
  }
  
  return (
    <View style={Styles.outerView}>
      <View style={Styles.innerView}>
        <Text style={styles.title}>Get a room code</Text>
        <Text>Select Price Range</Text>
        <View style={styles.priceContainer}>
          <TouchableOpacity
            onPress={() => setMaxPrice(1)}
            style= {{
              ...styles.priceButtons,
              backgroundColor: maxPrice == 1 ? '#ffa600' : 'white',
            }}
          >
            <Text style= {styles.priceText}>$</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMaxPrice(2)}
            style= {{
              ...styles.priceButtons,
              backgroundColor: maxPrice == 2 ? '#ffa600' : 'white',
            }}
          >
            <Text style= {styles.priceText}>$$</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMaxPrice(3)}
            style= {{
              ...styles.priceButtons,
              backgroundColor: maxPrice == 3 ? '#ffa600' : 'white',
            }}
          >
            <Text style= {styles.priceText}>$$$</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMaxPrice(4)}
            style= {{
              ...styles.priceButtons,
              backgroundColor: maxPrice == 4 ? '#ffa600' : 'white',
            }}
          >
            <Text style= {styles.priceText}>$$$$</Text>
          </TouchableOpacity>
        </View>
        
        <Text>Select time</Text>
        <View style ={styles.priceContainer}>
          <TouchableOpacity
            onPress={()=> setTime(30)}
            style= {{
              ...styles.priceButtons,
              backgroundColor: time == 30 ? '#ffa600' : 'white',
            }}
          >
            <Text style= {styles.priceText}>30 sec</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=> setTime(60)}
            style= {{
              ...styles.priceButtons,
              backgroundColor: time == 60 ? '#ffa600' : 'white',
            }}
          >
            <Text style= {styles.priceText}>1 min</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=> setTime(180)}
            style= {{
              ...styles.priceButtons,
              backgroundColor: time == 180 ? '#ffa600' : 'white',
            }}
          >
            <Text style= {styles.priceText}>3 min</Text>
          </TouchableOpacity>
        </View>
        
        {isDisabled ?
        <View> 
          <Text>Loading Room</Text>
          <ActivityIndicator animating={true} color={Colors.red800} />
        </View>
        :
          <TouchableOpacity
              disabled={Longitude == '' || Latitude == '' ? true : false}
              onPress={getCode}
          >
            <Image source={require('../assets/buttons/create.png')}/>
          </TouchableOpacity>
        }
      </View>
      <Text>long: {Longitude}</Text>
      <Text>lat: {Latitude}</Text>
    </View>
  )};

/* styles for the create a room */
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
  priceContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    
  },
  priceButtons: {
    margin: 4,
    height: 40,
    width: 50,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'column',
    justifyContent: 'center',
  }, 
  priceText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeButtons: {
    margin: 6,
    height: 40,
    width: 50,
    
  }
})