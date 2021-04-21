// https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks
import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet} from 'react-native';


const Timer = (time:number, func:Function) => {
  const [seconds, setSeconds] = useState(time);
  const [flag, setFlag]= useState(false);


  /* 
      function: secsToMins(time)
      params: takes in number of seconds 
      function outputs a string in the form of minutes:seconds used in the timer component of the swiping screen
  */
  function secsToMins(time: number) {
    let minutes:number = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    if (minutes === 0 && seconds === 0 && !flag) {
      setFlag(true);  
      func();
    }
    if (seconds >= 10) {
        return minutes+":"+seconds
    } else {
        return minutes+":0"+seconds
    }
    
  }

  useEffect(() => {
    let interval:any = null;
    if (seconds === 0) {
      return;
    }
    // counts down in one second interval
    interval = setInterval(() => {      
      setSeconds(seconds => seconds - 1); 
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <View>
      <Text>{secsToMins(seconds)}</Text>
    </View>
  );
};


export default Timer;