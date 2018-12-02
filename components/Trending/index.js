import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';

// import { Toolbar } from 'react-native-material-ui';
// import { UITheme } from '../../utils/MuiTheme';
import { height, width } from '../../utils/getDimensions';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

export default class Trending extends React.Component {
  render() {
    return (
    	<View style={style}>
        <View>
          <Feather name="trending-up" color='#42A5F5' size={24} />
        </View>
        <View style={{ paddingLeft: 10 }}>
          <Text style={{ color: '#42A5F5', fontSize: 24, fontWeight: '700' }}>Trending</Text>
        </View>
      </View>
       
    );
  }
}


const style = {
  alignSelf: 'center',
  flex: 1,
  flexDirection: 'row',
  width: '95%',
  backgroundColor: 'white',
  height: 200,
  borderRadius: 5,
  padding: 20,
  marginTop: 15,

  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 3
  },
  shadowRadius: 5,
  shadowOpacity: 0.13
 
}

const headerText = {
  fontSize: 25,
  color: '#42A5F5',
}


