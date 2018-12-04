import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, Platform, ScrollView, Share, Alert } from 'react-native';


export default class Pittition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.rresourceId,
      name: props.name,
      available: props.available
    };
  }

  componentWillReceiveProps(nextProps) {
  }


  render() {
    const C_UNSELECTED = '#BDBDBD';
    const C_SELECTED = '#64B5F6';

    const { name, available, reservedBy, viewer, num } = this.props;
    
    // Note: Better to have a id for the user instead of comparing fullnames
    var fullName = viewer.firstName + " " + viewer.lastName

    return (
    	<View style={style}>
       <View style={{ flex: 0.05, backgroundColor: this.props.available ? '#2ECC40' : '#FF4136' }}>
        </View>
        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{ name }</Text>
        </View>
        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
        </View>
        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
          <Text >{ reservedBy }</Text>
        </View>
        <TouchableWithoutFeedback onPress={() => { this.props.handleAddCart(num) }} style={{ backgroundColor: 'red' }}>
          <View>
            <Text>Reserve</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    
    );
  }
}


const styles = {
  headerStyle: {
    flex: 0.6,
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center',
    display: 'inline',
  },
  contentStyle: {
    // backgroundColor: 'red',
    marginTop: 15,
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  lineStyle: {
    // backgroundColor: 'blue',
    borderTopWidth: 1,
    borderColor:'#E0E0E0',
    marginBottom: 0
  },
  lineStyleMargin: {
    // margin: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  metaDataStyle: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  actionsStyle: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
  },
  actionStyle: {

    flexDirection: 'column',
    alignItems: 'center',
  }
}
const style = {
  alignSelf: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '95%',
  backgroundColor: 'white',
  height: 150,
  borderRadius: 5,
  padding: 0,
  marginTop: 15,

  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 3
  },
  shadowRadius: 5,
  shadowOpacity: 0.07
 
}


