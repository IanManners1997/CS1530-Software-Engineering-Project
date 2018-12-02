import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, Platform, ScrollView, Share, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Moment from 'moment';
import Modal from "react-native-modal";

import { height, width } from '../../utils/getDimensions';
import { IP } from '../../utils/constants';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'

export default class Pittition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      viewer: props.viewer,
      author: props.author,
      profile_URL: props.img_url,
      title: props.title,
      likes: props.likes,
      liked: props.likes.includes(props.viewer.userName),
      followed: props.followed,
      status: props.status,
      description: props.description,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        likes: nextProps.likes,
        liked: nextProps.likes.includes(nextProps.viewer.userName),
    })
  }

  handleClickLike() {
    if(this.props.status === 'Dismissed' || this.props.status === 'Resolved') {
      Alert.alert("Pittition is " + this.props.status.toLowerCase() + ", no further action possible");
      return
    }
    const likes = this.state.likes;
    var liked = !this.state.liked;

    if(!this.state.liked) {
      likes.push(this.state.viewer.userName);
    }
    else {
      const index =   likes.indexOf(this.state.viewer.userName);
      if (index > -1) likes.splice(index, 1);
    }
    // TODO: Move into actions
    let data = {
      method: 'POST',
      body: JSON.stringify({ likes: likes }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      }
    }
    fetch(IP + 'like/' + this.state.id, data)
        .then(response => {
          response.json()
        })
        .catch(function(error) {
          console.log('There was a problem: ' + error);
          liked = this.state.liked; // there was an issue so don't update UI
          throw error;
        });
  
     this.setState({ liked, likes })
  }
  handleClickShare() {
    Share.share(
      {
        title: this.state.title,
        message: this.state.description,
        url: 'https://facebook.com',
      }
    );
  }

  renderRow(rowData, rowID, highlighted) {
   var color = 'black';
   var text = rowData;
   if(rowData === 'follow') {
      if(this.props.followed) {
        color = '#42A5F5';
        text = 'followed';
      }
   }
    return (
        <View style={{ padding: 10 }}>
          <Text style={{ color }}>{text}</Text>
        </View>
    );
  }
  renderStatus (status) {
    let icon = "minus"
    let color = '#9E9E9E';
    if(status === 'Resolved') {
      icon = "check";
      color = "#4CAF50";
    }
    else if(status === 'Dismissed') {
      icon = "x";
      color = "#F44336";
    }
    else if(status === "In Process") {
      icon = "wrench"
    }
    return (
      <View style={{ flexDirection: 'row', opacity: 0.6 }}>
        <FoundationIcon name={icon} color={color} size={icon === 'wrench' ? 20 : 18} />
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 5 }}>
          <Text style={{ textAlign: 'center', color, fontWeight: '700'}}>{status}</Text>
        </View>
      </View>
    )
  }
   

  render() {
    const C_UNSELECTED = '#BDBDBD';
    const C_SELECTED = '#64B5F6';

    const { id, viewer, author, title, description, shares, comments, updates, likes, img_url, status, followed } = this.props;

    const statusComponent = this.renderStatus(status)
    
    // TODO: Resolve this
    for(var i in comments) 
      if(!comments[i].comment) comments.splice(i, 1);
    
    const options = ['follow', 'report']

    if(viewer.userName === author) options.push('delete');
    if(viewer.type === 'admin') options.unshift('update status');

    return (
    	<View style={style}>
        
        <View style={styles.headerStyle}>
          <Image
            style={{ alignSelf: 'center', width: 50, height: 50, borderRadius: 25}}
            source={{uri: img_url }} />
          <View style={{ padding: 5, flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 5, }}>{title}</Text>
            <Text style={{ fontSize: 14, color: '#9E9E9E', marginLeft: 5 }}>{author}</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => { this.props.handleClickOption(this.props.num) }}>
          <View style={{ flex: 0.1, alignSelf: 'flex-start', alignItems: 'flex-end', padding: 10 }}>
            <ModalDropdown onSelect={(idx, value) => this.props.handleOpenCloseStatus(idx, value)} onDropdownWillShow={() => { this.props.handleClickOption(this.props.num) }} options={options}  renderRow={this.renderRow.bind(this)} style={{ height: 50 }} dropDownStyle={{ height: 50 }}>
              <SimpleLineIcon name="options-vertical" size={18} color={C_UNSELECTED} style={{ width: 50, height: 25, alignSelf: 'center', textAlign: 'right' }}/>
            </ModalDropdown>
          </View>
          </TouchableWithoutFeedback>
        </View>
        
        
  
        <View style={styles.contentStyle}>
          <Text style={{ fontSize: 14, color: '#757575', fontWeight: '400' }}>{description}</Text>
        </View>


      <View style={styles.metaDataStyle}>
         {/*<Text style={{ color: '#47B536', fontWeight: '500'}}>{status}</Text>*/} 
         {statusComponent}
          <View style={{ flex: 1, justifyContent: 'flex-end', paddingRight: 25}}>
            <Text style={{ textAlign: 'right', color: '#9E9E9E'}}>{this.props.date}</Text>
          </View>
        </View>
        <View style={{...styles.lineStyle,...styles.lineStyleMargin}} />

        <View style={styles.actionsStyle}>
        
          <View style={styles.actionStyle}>
            <TouchableWithoutFeedback onPress={() => { this.handleClickLike() }}>
              <FoundationIcon name="pencil" size={25} color={this.state.liked ? C_SELECTED : C_UNSELECTED}  />
            </TouchableWithoutFeedback>
              <Text style={{ fontSize: 12, color: C_UNSELECTED, fontWeight: '500' }}>{likes.length}</Text> 
          </View>
          
          <View style={styles.actionStyle}>
            <FoundationIcon name="comments" size={25} color={C_UNSELECTED}/>
            <Text style={{ fontSize: 12, color: C_UNSELECTED, fontWeight: '500' }}>{comments.length + updates.length}</Text> 
          </View>
           <View style={styles.actionStyle}>
            <TouchableWithoutFeedback onPress={() => { this.handleClickShare() }}>
              <EntypoIcon name="share" size={25} color={C_UNSELECTED}  />
            </TouchableWithoutFeedback>
            <Text style={{ fontSize: 12, color: C_UNSELECTED, fontWeight: '500' }}>{shares}</Text> 
          </View>
        
        </View>

      </View>
       
    );
  }
}


const styles = {
  headerStyle: {
    flex: 0.6,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
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
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '95%',
  backgroundColor: 'white',
  height: 245,
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


