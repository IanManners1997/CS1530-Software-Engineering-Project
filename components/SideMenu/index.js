import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { height, width } from '../../utils/getDimensions';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import { logout, fetchPittitionFromAPI } from '../../redux/actions';

class SideMenu extends React.Component {
  handleLogout() {
    console.log("IN LOGOUT")
    this.props.dispatch(
      logout()
    );
    console.log("RECENT ACTION")
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Login' })],
    });
    console.log("DISPATCHED")
    this.props.navigation.dispatch(resetAction);
  }
  
  render() {

    const { firstName, lastName, userName, img_url } = this.props.user;
    const { navigate } = this.props.navigation;


    return (
      <View style={style}>
        <View style={{ flexDirection: 'row', flex: 0.15, paddingLeft: 20, paddingRight: 20 }}>
          <View style={{ flexDirection: 'column' }}>
            <Image
                style={imgStyle}
                source={{uri: img_url}} />
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <View>
              <Text style={{ fontSize: 18, textAlign: 'center' }}>{firstName} {lastName}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>{userName}</Text>
            </View>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => {navigate('Home')}}>
           <View style={{ flexDirection: 'row', flex: 0.1, backgroundColor: '#F7F8FC', alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
             <Text style={menuTextStyle, activeStyle}>Home</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {navigate('Profile')}}>
          <View style={{ flexDirection: 'row', flex: 0.1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
              <Text style={menuTextStyle}>Profile</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        
        <TouchableWithoutFeedback onPress={() => {this.handleLogout()}}>
          <View style={{ flexDirection: 'row', flex: 0.1,  alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
              <Text style={menuTextStyle}>Log out</Text>
            </View>
          </View>
         </TouchableWithoutFeedback>
      </View>
       
    );
  }
}
const style = {
  marginTop: 0,

  alignSelf: 'flex-start',
  justifyContent: 'center',
  backgroundColor: 'white',
  flex: 1,
  width: '100%'
}
const menuTextStyle = {
  fontSize: 20,
}

const imgStyle = {
  width: 60, 
  height: 60, 
  borderRadius: 30
}
const activeStyle = {
  color: '#42A5F5',
  fontSize: 20
}

function mapStateToProps (state) {
  return { }
}

function mapDispatchToProps (dispatch) {
  return {
    logout: () => dispatch(logout())
  }
}

export const SideMenuContainer = connect(
 mapStateToProps
)(SideMenu);
export default SideMenuContainer;