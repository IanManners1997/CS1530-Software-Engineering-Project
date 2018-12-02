import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, Platform, ScrollView, Share } from 'react-native';
import Moment from 'moment';

import { height, width } from '../../utils/getDimensions';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
  	const { user, img_url, comment, posted, isUpdate, stateBefore, stateAfter } = this.props;

  	const C_UNSELECTED = '#757575';
    const C_ADMIN = '#424242';

    const adminBadge = this.props.admin ? <FoundationIcon name="star" size={18} color='#42A5F5' /> : <View />
    const statusMessage = this.props.isUpdate ? <Text style={{ fontSize: 15, color: C_UNSELECTED, paddingBottom: 5 }}><Text style={{fontWeight: '800', color: '#42A5F5' }}>{stateBefore}</Text> <FoundationIcon name="arrow-right" color={C_UNSELECTED}/> <Text style={{fontWeight: '800', color: '#42A5F5' }}>{stateAfter}</Text></Text> : <View />;
  	return (
  		<View style={{ flexDirection: 'column', flex: 1, backgroundColor: 'white', paddingLeft: 30, paddingTop: this.props.pinned ? 0 : 20, paddingBottom: 20 }}>
        	<View style={{ alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'}}>
	           <Image
	            style={{ alignSelf: 'flex-start', width: 40, height: 40, borderRadius: 20 }}
	            source={{uri: img_url}} />
	            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 10, width: '85%' }}>
	              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: this.props.admin ? '800' : '500', paddingRight: 5 }}>{user}</Text>
                  {adminBadge}
                  <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
                    <Text style={{ textAlign: 'right', fontSize: 12, color: C_UNSELECTED, fontWeight: '500' }}>{Moment(posted).fromNow()}</Text>
                  </View>
                </View>
                {statusMessage}
	              <Text style={{ fontSize: 16, color: this.props.admin ? C_ADMIN : C_UNSELECTED, fontWeight: this.props.admin ? '700' : '500' }}>{comment}</Text>
	            </View>
	        </View>
        </View>
  	)
  }
}