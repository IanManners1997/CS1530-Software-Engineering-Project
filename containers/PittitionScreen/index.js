import React from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, Alert, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import { connect } from 'react-redux';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';

import { addCommentToPittition } from '../../redux/actions';

import SideMenu from 'react-native-side-menu';
import Comment from '../../components/Comment';

import { height, width } from '../../utils/getDimensions';

class PittitionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(this.props.user.user),
      pittition: props.activePittition.activePittition,
      likes: props.activePittition.activePittition.likes,
      liked: props.activePittition.activePittition.likes.includes(JSON.parse(this.props.user.user).userName),
      comment: '',
      comments: props.activePittition.activePittition.comments ? props.activePittition.activePittition.comments : [],
    }
    this.handleAddComment = this.handleAddComment.bind(this);
  }

  handleAddComment() {
    if(this.state.comment.length > 2) {
      const comments = this.state.comments;
      const userType = this.props.type;
      const pittitionId = this.state.pittition._id;
      const newComment = { user: JSON.parse(this.props.user.user).userName, img_url: JSON.parse(this.props.user.user).img_url, comment: this.state.comment, userType: this.state.user.type, type: 'regular', date: Date.now(), pittitionId};
      this.props.dispatch(
        addCommentToPittition(this.props.activePittition.activePittition, newComment)
      );
      comments.unshift(newComment);
      this.setState({comments, comment: '', commentFocused: false});
    }
  }

  sortComments(comments) {
    return comments.sort(function(commentA, commentB) {
      const timeA = parseInt(new Date(commentA.date).getTime());
      const timeB = parseInt(new Date(commentB.date).getTime());

      return timeB - timeA;
    });
  }

  handleClickLike() {
    const likes = this.state.likes;
    var liked = !this.state.liked;

    if(!this.state.liked) {
      likes.push(this.state.user.userName);
    }
    else {
      const index =   likes.indexOf(this.state.user.userName);
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
    fetch('http://localhost:3000/like/' + this.state.pittition._id, data)
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
  render() {  
    const img_url = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";

    const { activePittition } = this.props.activePittition;
    const comments = this.sortComments(activePittition.comments);

    var { user } = this.props.user;

    try {
      user = JSON.parse(user);
    } catch(error) {
      user = {}
    }

    const pinnedIndex = comments.findIndex(function(comment) {
      return comment.type == "pinned"
    });
    
    // move pinned to the begginning of comments
    if(pinnedIndex > -1) {
      comments.unshift(comments.splice(pinnedIndex, 1)[0]);
    } 
 
    const C_UNSELECTED = '#BDBDBD';
    const C_SELECTED = '#64B5F6';
    const SIGN_COLOR = this.state.liked ? C_SELECTED : C_UNSELECTED
    
    //#FF9800
    return (
      <View style={{ flexDirection: 'column', flex: 1, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 50, backgroundColor: '#42A5F5', width: '100%'}}>
          <TouchableWithoutFeedback onPress={() => { this.props.navigation.goBack() }}>
            <EntypoIcon name="chevron-left" size={30} color="white" style={{ paddingRight: 5, paddingLeft: 5 }}/>
          </TouchableWithoutFeedback>
           <Image
            style={{ alignSelf: 'center', width: 60, height: 60, borderRadius: 30}}
            source={{ uri: activePittition.img_url }} />
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: 'white' }}>{activePittition.title}</Text>
              <Text style={{ fontSize: 16, color: 'white' }}>{activePittition.author}</Text>
            </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#42A5F5', padding: 25 }}>
           <Text style={{ fontSize: 16, textAlign: 'left', fontWeight: '600', color: 'white'  }}>{activePittition.description} {activePittition.description}</Text>
        </View>
        
        <View style={{flexDirection: 'row', padding: 10, width: '100%', borderBottomColor: '#E0E0E0', borderBottomWidth: 1}}>
          <TouchableWithoutFeedback onPress={() => { this.handleClickLike() }}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
              <FoundationIcon name="pencil" size={25} color={SIGN_COLOR}  />
              <Text style={{ fontSize: 14, color: SIGN_COLOR, fontWeight: '700', paddingLeft: 5 }}>Sign</Text>
            </View>
          </TouchableWithoutFeedback>
          
          <TouchableWithoutFeedback onPress={() => {this.refs.comment.focus(); }}>
            <View style={{ flexDirection: 'row',flex: 1, alignItems: 'center',justifyContent: 'center', alignSelf: 'center' }}>
              <FoundationIcon name="comments" size={25} color={C_UNSELECTED}/>
              <Text style={{ fontSize: 14, color: C_UNSELECTED, fontWeight: '700', paddingLeft: 5 }}>Comment</Text>
            </View>
           </TouchableWithoutFeedback>
            <View style={{ flexDirection: 'row',flex: 1, alignItems: 'center',justifyContent: 'center', alignSelf: 'center' }}>
                <EntypoIcon name="share" size={25} color={C_UNSELECTED}  />
                <Text style={{ fontSize: 14, color: C_UNSELECTED, fontWeight: '700', paddingLeft: 5 }}>Share</Text>
            </View>
         

        </View>
        <View style={{ flexDirection: 'row', paddingLeft: 0, paddingTop: 20, paddingBottom: 0 }}>
          <View style={{ flexDirection: 'row',flex: 1, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', borderBottomColor: C_SELECTED, borderBottomWidth: 2, paddingBottom: 15 }}>
              <Text style={{ fontSize: 16, color: C_SELECTED, fontWeight: '900', paddingLeft: 5, textAlign: 'center' }}>Comments ({comments ? comments.length : 0})</Text>
          </View>
          <View style={{ flexDirection: 'row',flex: 1, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', paddingBottom: 15 }}>
            <Text style={{ fontSize: 16, color: C_UNSELECTED, fontWeight: '700', paddingLeft: 5 }}>Solutions</Text>
          </View>
        </View>

        
        <ScrollView>
        <Text style={{ fontStyle: 'italic', fontSize: 16, color: 'gray', paddingLeft: 30, paddingTop: 10 }}>Pinned</Text>
        

        { 
          comments.map(function(comment, i) {
            console.log(comment);
            if(i === 0) {
              if(comment.type === 'pinned') {
                return (
                  <Comment key={i} user={comment.user} img_url={comment.img_url} posted={comment.date} comment={comment.comment} admin={comment.userType === 'admin'} pinned/>
                )
              } 
              return (
                <View key={i}>
                  <Text style={{ fontSize: 16, color: 'gray', paddingLeft: 30, paddingBottom: 20 }}>No pinned comments</Text>
                  <Comment user={comment.user} img_url={comment.img_url} posted={comment.date} comment={comment.comment} admin={comment.userType === 'admin'} pinned/>
                </View>
              )
            }
            return (
              <Comment key={i}  img_url={comment.img_url} user={comment.user} posted={comment.date} comment={comment.comment} admin={comment.userType === 'admin'}/>
            )
          })
        }
        </ScrollView>
         <KeyboardAvoidingView behavior="padding" style={{ flexDirection: 'row'}}>
          <TextInput
              style={{ padding: 10, position: 'relative', width: '100%', height: 50, backgroundColor: '#F7F8FC', borderRadius: 20 }}
              value={this.state.comment}
              onChangeText={(comment) => this.setState({comment})}
              onSubmitEditing={this.handleAddComment}
              placeholder="Comment"
              ref="comment"
              returnKeyType="done">
          </TextInput>
  
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const styles ={
  statusBarStyle: {
    flexDirection: 'row', 
    alignSelf: 'center', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#2196F3', 
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 50
    },
    shadowRadius: 10,
    shadowOpacity: 0.7
  }
}
function mapStateToProps (state) {
  return {
    activePittition: state.activePittition,
    user: state.user
  }
}

function mapDispatchToProps (dispatch) {
  return {
   
  }
}


export const PittitionContainer = connect(
 mapStateToProps
)(PittitionScreen);
// Overview = connect()(Overview);
export default PittitionContainer;
