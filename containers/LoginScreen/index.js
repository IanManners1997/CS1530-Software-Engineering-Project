import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableWithoutFeedback, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import TimerMixin from 'react-timer-mixin';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";

import { connect } from 'react-redux';

import { login } from '../../redux/actions';
import { IP } from '../../utils/constants';

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      userName: '',
      password: '',
    }
  }
// login(this.state.userName.toLowerCase(), this.state.password.toLowerCase())
  handleLogIn(navigation) {
     this.setState({modalVisible: true});
     Keyboard.dismiss();
     
     // TODO: FOR DEVELOPMENT PURPOSES ONLY, REMOVE THIS WHEN FINISHED
     if(this.state.userName === '' && this.state.password === '') {
         this.props.dispatch(
            login("admin", "admin")
      );
     }
     else {
      this.props.dispatch(
        login(this.state.userName.toLowerCase(), this.state.password.toLowerCase())
      );
     }
     
  }
  renderModelContentLoading () {
     return (
      <View>
        <ActivityIndicator size="large" color='#2196F3' />
        <Text style={{ marginTop: 20, fontSize: 17 }}>Logging you in</Text>
      </View>
    )
  }
  renderModelContentRetry () {
     return (
      <View>
        <Text style={{ fontSize: 17 }}>Incorrect Username or Password</Text>
        <TouchableWithoutFeedback onPress={ () => { this.setState({ modalVisible: false }) }}>
          <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
            <Text style={{ fontSize: 17 }}>OK</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
  render() {
    console.log("IP" + IP)
    var { user, error, isFetching } = this.props.user;
    var loading = this.state.modalVisible;
    var modalContent = this.renderModelContentLoading();

    if(error) {
      console.log("error")
      console.log(error)
      modalContent = this.renderModelContentRetry();
    }
    try {
      user = JSON.parse(user);
      if(user.id !== null) {
        modalContent = null; //this.renderModelContentLoading();
        loading = false;
        setTimeout(() => {  this.props.navigation.navigate("Home") }, 0);
      }
    }
    catch(err) {
      // loading = false;
      console.log("error" + JSON.stringify(err))
    }
   
    return (
     <View style={{ height: '100%', marginTop: 0}}>
        <View style={{ flexDirection: 'column', backgroundColor: '#42A5F5', flex: 0.4, height: '100%', alignItems: 'flex-start', padding: 25  }}>
          <View style={{ flexDirection: 'row', flex: 1, alignSelf: 'flex-start', marginTop: 20  }}>
            <View style={{ alignSelf: 'center', marginTop: 10  }}><Text style={{ color: 'white', fontSize: 28, fontWeight: '300' }}><Text style={{ fontWeight: '800'}}>Pitt</Text>ition</Text></View>
          </View>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '700', alignSelf: 'center', marginTop: 10  }}>University of Pittsburgh</Text>
        </View>
      
        <View style={{ flexDirection: 'column', flex: 0.1, height: '100%', marginTop: 60  }}>
        <Text style={{ fontSize: 26, paddingLeft: 25 }}>Sign in</Text>
        </View>
          <View style={{ flexDirection: 'row', padding: 15, alignSelf: 'center' }}>
           <View style={{  alignItems: 'center', justifyContent: 'center', backgroundColor: '#42A5F5', height: 50,  width: 50 }}>
              <IonIcon name="md-person" color="white" size={25} />
           </View>
            <TextInput
              style={{ padding: 10, width: '80%', height: 50, borderWidth: 0, backgroundColor: '#F7F8FC' }}
              value={this.state.userName}
              onChangeText={(userName) => this.setState({userName})}
              placeholder="Username" />
          </View>
          <View style={{ flexDirection: 'column', flex: 0.4, height: '100%' }}>
            <View style={{ flexDirection: 'row', padding: 15, alignSelf: 'center' }}>
           <View style={{  alignItems: 'center', justifyContent: 'center', backgroundColor: '#42A5F5', height: 50,  width: 50 }}>
              <IonIcon name="md-lock" color="white" size={25} />
           </View>
            <TextInput
              style={{ padding: 10, width: '80%', height: 50, borderWidth: 0, backgroundColor: '#F7F8FC' }}
              value={this.state.password}
              onChangeText={(password) => this.setState({password})}
              placeholder="Password"
              secureTextEntry={true} />
          </View>
          </View>
          
           <View style={{ flexDirection: 'column', flex: 1, height: '100%', paddingTop: 15, paddingLeft: 25, paddingRight: 25}}>
              <TouchableWithoutFeedback onPress={() => {this.handleLogIn(this.props.navigation)}}>
                <View style={{ backgroundColor: '#42A5F5', height: 60, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20}}>Sign in</Text>
                </View>
              </TouchableWithoutFeedback>
                <View style={{ paddingTop: 25}}>
                  <Text style={{ color: 'gray', alignSelf: 'center', fontSize: 14}}>Forgot your Password? <Text style={{ color: '#42A5F5'}}>Change it here</Text></Text>
                </View>
            </View>
            {/*<Modal isVisible={loading}>
              <View style={modalStyle}>
                {modalContent}
              </View>
            </Modal>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#F7F8FC',
    height: '100%'


  },
});

const modalStyle = {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    height: '20%',
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
}

const scrollViewStyle = {
  // marginTop: height/7.5,
  width: '100%',
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps (dispatch) {
  return {
    login: () => dispatch(login())
  }
}


export const LoginContainer = connect(
  mapStateToProps,
)(LoginScreen);
// Overview = connect()(Overview);
export default LoginContainer;

