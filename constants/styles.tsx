import { StyleSheet } from 'react-native';
//import { LinearGradient } from 'expo-linear-gradient';

/* 
*   list of commonly used styles that were called in most of the screens.
*   moved into this file in order to not have to rewrite them over again in each screen.
*/
export const Styles = StyleSheet.create({
  outerView: {
    backgroundColor:'#F89B4F',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  innerView: {
    backgroundColor: '#c2d6f6',
    width: '95%',
    height: '70%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },

  title: {
    padding: '2%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    width: '10%',
    padding: '2%',
  },
  text: {
    padding: '2%',
  },
  userentry: {
    width: '20%',
    padding: '2%',
  },
});

export default Styles;
