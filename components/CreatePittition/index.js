import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import IonIcon from 'react-native-vector-icons/Ionicons';

import { addPittitionToAPI } from '../../redux/actions';
import { connect } from 'react-redux';



class CreatePittition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      title: '',
      description: '',
      user: props.user
    }
    this.handleCreate = this.handleCreate.bind(this);
  }
  

  handleCreate() {
    const newPittition = {title: this.state.title, date: Date.now(), description: this.state.description, status: "waiting", author: this.state.user.userName, img_url: this.state.user.img_url, likes: [], comments: [], shares: [], followers: [], updates: []};
    this.props.dispatch(
      addPittitionToAPI(newPittition)
    );
    this.props.handleCreatePittition(newPittition);
    this.props.handleClose();
  }

  render() {

    const radio_props = [{ label: 'I agree to the terms and conditions', value: 0 }];
    return (
    	<View style={{ height: '100%', marginTop: 0}}>
        
        <View style={{ flexDirection: 'column', backgroundColor: '#42A5F5', flex: 0.4, height: '100%', alignItems: 'flex-start', padding: 25, paddingBottom: 50  }}>
          
            <TouchableWithoutFeedback onPress={() => this.props.handleClose()}>
              <IonIcon name="ios-close" size={60} color='white' style={{ alignSelf: 'flex-end', marginTop: 10 }}/>
            </TouchableWithoutFeedback>
          
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', alignSelf: 'center'  }}>Create a Pittition</Text>
        </View>
      
        <View style={{ flexDirection: 'column', flex: 0.3, height: '100%', padding: 15, marginTop: 25 }}>
          <Text style={headerTextStyle}>Whats the problem?</Text>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TextInput
              style={{ padding: 10, width: '100%', height: 40, borderWidth: 0, backgroundColor: '#F7F8FC' }}
              value={this.state.title}
              onChangeText={(title) => this.setState({title})}
              placeholder="The Problem" />
          </View>
        </View>
        
        <View style={{ flexDirection: 'column', flex: 1, padding: 15 }}>
          <Text style={headerTextStyle}>Describe it?</Text>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TextInput
              style={{ padding: 10, width: '100%', height: '100%', backgroundColor: '#F7F8FC' }}
              value={this.state.description}
              onChangeText={(description) => this.setState({description})}
              placeholder="Describe it" 
              multiline={true}/>
          </View>
        </View>

           <View style={{ flexDirection: 'column', flex: 1, height: '100%', paddingTop: 15, paddingLeft: 25, paddingRight: 25, justifyContent: 'flex-start'}}>

            <RadioForm
              radio_props={radio_props}
              initial={this.state.value}
              borderWidth={1}
              buttonSize={15}
              buttonOuterSize={25}
              onPress={(value) => { this.setState({value: 1 }) }} />
              <View style={{ height: 20 }}/>
              <TouchableWithoutFeedback onPress={() => { this.handleCreate() }}>
                <View style={{ backgroundColor: '#42A5F5', height: 60, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20}}>Create Pittition</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
      </View>     
    );
  }
}

const headerTextStyle = {
  color: '#212121', 
  fontSize: 20, 
  fontWeight: '400', 
  alignSelf: 'flex-start',
  paddingBottom: 10
}

function mapDispatchToProps (dispatch) {
  return {
    getPittion: () => dispatch(addPittitionToAPI())
  }
}



export const CreatePittitionContainer = connect(
 mapDispatchToProps
)(CreatePittition);

export default CreatePittitionContainer;

