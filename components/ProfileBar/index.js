import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';

// import { Toolbar } from 'react-native-material-ui';
// import { UITheme } from '../../utils/MuiTheme';
import { height, width } from '../../utils/getDimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class ProfileBar extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tabValue: 0,
    }
  }
  handleYours() {
    this.setState({ tabValue: 0 });
    this.props.sortByYours();
  }

  handleFollowed() {
    this.setState({ tabValue: 1 });
    this.props.sortByFollowed();
  }
  render() {
    const BORDER_WIDTH_ACTIVE = 3;
    return (
    	<View style={wrapperStyle}>
        <View style={style}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => {this.props.handleSidebarToggle(true)}}>
              <FoundationIcon name="align-left" size={30} color='white' style={{ marginLeft: 15 }} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 1, alignItems: 'center'}}>
            <MaterialIcon name="person" size={35} color='white' />
          </View>
          <TouchableWithoutFeedback onPress={() => { this.props.handleOpen() }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <EntypoIcon name="plus" size={30} color='white' style={{ marginRight: 15 }} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => { this.handleYours() }}>
            <View style={{ flex: 1, alignItems: 'center', paddingBottom: 15, justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: this.state.tabValue === 0 ? BORDER_WIDTH_ACTIVE : 0 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}>PITTITIONS</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { this.handleFollowed() }}>
            <View style={{ flex: 1, alignItems: 'center', paddingBottom: 15, justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: this.state.tabValue === 1 ? BORDER_WIDTH_ACTIVE : 0}}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}>FOLLOWED</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
       
    );
  }
}


const wrapperStyle = {
  flexDirection: 'column', 
  // flex: 0.2,  
  height: height/6,
  backgroundColor: '#2196F3',
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 3
  },
  shadowRadius: 5,
  shadowOpacity: 0.2
}
const style = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  height: (Platform.OS === 'ios') ? 100 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
  height: height/7.5,
  paddingTop: (Platform.OS === 'ios') ? 30 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
}