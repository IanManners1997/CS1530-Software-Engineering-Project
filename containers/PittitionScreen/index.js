import React from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, Alert, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';

import { getActivePittition } from '../../redux/actions';

import SideMenu from 'react-native-side-menu';
import Comment from '../../components/Comment';

import { height, width } from '../../utils/getDimensions';

class PittitionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: props.activePittition.activePittition.likes.includes(JSON.parse(this.props.user.user).userName),
      comment: '',
      comments: props.activePittition.activePittition.comments ? props.activePittition.activePittition.comments : [],
    }
    this.handleAddComment = this.handleAddComment.bind(this);
  }

  handleAddComment() {
    if(this.state.comment.length > 2) {
      const comments = this.state.comments;

      comments.push({ user: JSON.parse(this.props.user.user).userName, comment: this.state.comment});
      this.setState({comments, comment: ''});
    }
  }
  render() {  
    const img_url = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
    
    const { activePittition } = this.props.activePittition;
    console.log(activePittition.comments);
    const comments = this.state.comments;
    
    var { user } = this.props.user;
    try {
      user = JSON.parse(user);
    } catch(error) {
      user = {}
    }
   
    const C_UNSELECTED = '#BDBDBD';
    const C_SELECTED = '#64B5F6';
    const SIGN_COLOR = this.state.liked ? C_SELECTED : C_UNSELECTED
    // TODO fix JSON.parse()
    
    // <View style={{ alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 0, backgroundColor: '#42A5F5', width: '100%', height: 150 }}>
    return (
      <View style={{ flexDirection: 'column', flex: 1, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 75, backgroundColor: '#42A5F5', width: '100%'}}>
          <EntypoIcon name="chevron-left" size={30} color="white" style={{ paddingRight: 5, paddingLeft: 5 }}/>
           <Image
            style={{ alignSelf: 'center', width: 60, height: 60, borderRadius: 30}}
            source={{uri: img_url}} />
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: 'white' }}>{activePittition.title}</Text>
              <Text style={{ fontSize: 16, color: 'white' }}>{activePittition.author}</Text>
            </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#42A5F5', padding: 25 }}>
           <Text style={{ fontSize: 16, textAlign: 'left', fontWeight: '600', color: 'white'  }}>{activePittition.description} {activePittition.description}</Text>
        </View>
        
        <View style={{flexDirection: 'row', padding: 10, width: '100%', borderBottomColor: '#E0E0E0', borderBottomWidth: 1}}>
          
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
              <FoundationIcon name="like" size={31} color={SIGN_COLOR}  />
              <Text style={{ fontSize: 14, color: SIGN_COLOR, fontWeight: '700', paddingLeft: 5 }}>Sign</Text>
            </View>
          
           <View style={{ flexDirection: 'row',flex: 1, alignItems: 'center',justifyContent: 'center', alignSelf: 'center' }}>
              <FoundationIcon name="comments" size={25} color={C_UNSELECTED}/>
              <Text style={{ fontSize: 14, color: C_UNSELECTED, fontWeight: '700', paddingLeft: 5 }}>Comment</Text>
            </View>
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
        { comments.map(function(comment, i) {
            return (
              <Comment key={i} user={comment.user} comment={comment.comment} />
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
              returnKeyType="done">
          </TextInput>
  
        </KeyboardAvoidingView>
      </View>
    );
  }
}

function mapStateToProps (state) {
  // console.log(navigation.state.params.user);
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