import React, { useState } from 'react';
import { Tile } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';

/*
    function: getPrice(number)
    params: a number value
    use: function takes in a price value and returns the appropriate $ conversion used inside the card component
*/
function getPrice(price: number){
  if(price <= 1){
    return '$';
  }
  else if(price == 2){
    return '$$';
  }
  else if(price == 3){
    return '$$$';
  }
  else{
    return '$$$$';
  }
}

type cardcomponenets = {
  name: string;
  ImgList: any;
  price: number;
  location: string;
};

/*
    This is a custom built card component used in the swiper
    takes in a name, image, and a price value and displays that information in a neatly formatted tile.
    This componenet is called in the swiping screen and shows the user the restaurants' information which they swipe on.
*/
export const Card = ({ name, ImgList, price, location }: cardcomponenets) => (

<Tile
  imageSrc={{ uri: ('data:image/jpeg;base64,' + ImgList[0]), width: 200, height: 200 }}
  imageContainerStyle={styles.imageContainer}
  activeOpacity={0.9}
  title={name}
  caption={getPrice(price)}
  titleStyle={styles.title}
  captionStyle={styles.caption}
  containerStyle={styles.container}
  featured
/>
   
  )


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    //width: 160,
    //height: height - 90,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'black',
    overflow: 'hidden',
  },
  title: {
    backgroundColor: 'orange',
    position: 'absolute',
    left: 1,
    bottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    flexDirection: 'column',
  },
  caption: {
    position: 'absolute',
    left: 1,
    bottom: -10,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'orange',

  },
})
