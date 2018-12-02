import React from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, TouchableWithoutFeedback, Picker, TextInput, Image, RefreshControl, KeyboardAvoidingView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import CustomModal from 'react-native-modal'
import { fetchPittitionFromAPI, getActivePittition, updatePittitionStatusAPI, deletePittitionFromAPI, followPittitionAPI } from '../../redux/actions';

import SideMenu from 'react-native-side-menu';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Sidebar from 'react-native-sidebar';

import AppBar from '../../components/AppBar';
import Pittition from '../../components/Pittition';
import Trending from '../../components/Trending';
import CreatePittition from '../../components/CreatePittition';
import MySideMenu from '../../components/SideMenu';
import { height, width } from '../../utils/getDimensions';

import Moment from 'moment'

const pittitionStatuses = [
  {
    status: 'In Process',
    description: 'You have viewed the pittition and looking into it',
  },
  {
    status: 'Resolved',
    description: 'A solution for the Pittition has been proposed and accepted',
  },
  {
    status: 'Dismissed',
    description: 'The problem raised by the Pittition is infeasible',
  },
  {
    status: 'Remove',
    description: 'The Pittition violates the guidelines and will be removed entirely',
  },
 
]

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      sidebarVisible: false,
      pittitions: props.pittition.pittition,
      pittitionFetcher: props.pittition,
      statusModalVisible: false,
      activePittitionOpen: 0,
      activePittitionStatus: 0,
      statusUpdateMessage: '',
      refreshing: false,
    }
    this.handleOpenClose = this.handleOpenClose.bind(this);
    this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
    this.handleCreatePittition = this.handleCreatePittition.bind(this);
    this.sortByPopularity = this.sortByPopularity.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.handleClickOption = this.handleClickOption.bind(this);
    this.handleOpenCloseStatus = this.handleOpenCloseStatus.bind(this);
    this.handleClickStatusBar = this.handleClickStatusBar.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(
      fetchPittitionFromAPI()
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pittitionFetcher: nextProps.pittition,
      pittitions: this.initPittitions(nextProps.pittition.pittition),
      activePittitionStatus: pittitionStatuses.findIndex(function(status) {
        if(nextProps.pittition.pittition.length === 0) return false;
        else
          return status.status === nextProps.pittition.pittition[0].status
      }),
    })
  }
  
  onRefresh() {
    this.props.dispatch(
      fetchPittitionFromAPI()
    );
  }

  handleOpenClose() {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  handleOpenCloseStatus(idx, value) {
    if(value === 'update status') {
      this.setState({
        statusModalVisible: !this.state.statusModalVisible,
      });
    }
    else if(value === 'delete') {
      this.handleDeletePittition()
    }
    else if(value === 'follow') {
      this.handleFollowPittition();
    }
  }

  // TODO -> Fix issue: Creating a pittition and deleting it without refreshing server causes server side error, because no ID is assigned
  //                    to pittition until after server refresh. Need to use Redux for this
  handleDeletePittition() {
     const pittitions = this.state.pittitions;
      this.props.dispatch(
        deletePittitionFromAPI(pittitions[this.state.activePittitionOpen]._id)
      )

      pittitions.splice(this.state.activePittitionOpen, 1);
      this.setState({ pittitions, statusModalVisible: false, activePittitionOpen: 0 });
  }

  handleFollowPittition() {
    const pittitions = this.state.pittitions;
    const activePittition = pittitions[this.state.activePittitionOpen];
    const user = JSON.parse(this.props.user.user);

    // follow -> add user to list of followers
    if(!activePittition.followers.includes(user.userName)) {
      activePittition.followers.push(user.userName);
    }
    // otherwise unfollow -> remove user from list of followers
    else {
      const index =   activePittition.followers.indexOf(user.userName);
      if (index > -1) activePittition.followers.splice(index, 1);
    }

    this.props.dispatch(
      followPittitionAPI(activePittition._id, activePittition.followers)
    )

    this.setState({ pittitions, activePittitionOpen: 0 });
  }

  handleSidebarToggle(isOpen) {
    this.setState({
      sidebarVisible: isOpen,
    });
  }

  handleViewPittition(props, i) {
    props.dispatch(
      getActivePittition(props.pittition.pittition[i])
    );
    props.navigation.navigate("PittitionScreen");
  }

  initPittitions(pittitions) {
    return pittitions.sort(function(pittA, pittB) {
      return pittB.likes.length - pittA.likes.length;
    });
  }

  sortByPopularity() {
    const pittitions = this.state.pittitions;
    pittitions.sort(function(pittA, pittB) {
      return pittB.likes.length - pittA.likes.length;
    });
    this.setState({ pittitions })
    return pittitions;
  }

  sortByDate() {
    const pittitions = this.state.pittitions;

    pittitions.sort(function(pittA, pittB) {
      const timeA = parseInt(new Date(pittA.date).getTime());
      const timeB = parseInt(new Date(pittB.date).getTime());

      return timeB - timeA;
    });

    this.setState({ pittitions })

  }

  handleClickStatusBar(activePittitionStatus) {
    this.setState({ activePittitionStatus })
  }

  handleClickOption(activePittitionOpen) {
    const props = this.props;
    const activePittitionStatus = pittitionStatuses.findIndex(function(status) {
      if(props.pittition.pittition.length === 0) return false;
      else
        return status.status === props.pittition.pittition[activePittitionOpen].status
    });
    this.setState({ 
      activePittitionOpen,
      activePittitionStatus,
    })
  }

  handleUpdateStatus() {

    const index = this.state.activePittitionOpen;
    const pittitions = this.state.pittitions;
    const currentStatus = pittitions[index].status;
    const newStatus = pittitionStatuses[this.state.activePittitionStatus].status;
    const update = pittitions[index].updates;
    if(!newStatus || newStatus === currentStatus) this.setState({ statusModalVisible: false });
    else if(newStatus === 'Remove')  this.handleDeletePittition();
    else {
      const newUpdate = { stateBefore: currentStatus, stateAfter: newStatus, user: JSON.parse(this.props.user.user).userName, comment: this.state.statusUpdateMessage, img_url: JSON.parse(this.props.user.user).img_url };
      update.unshift(newUpdate);
      this.props.dispatch(
        updatePittitionStatusAPI(this.state.pittitions[index]._id, newStatus, update)
      );
      pittitions[index].status = newStatus;

      this.setState({ pittitions, statusUpdateMessage: '', statusModalVisible: false });
    }
  }

  handleCreatePittition(pittition) {
    const pittitions = this.state.pittitions;
    pittitions.unshift(pittition);

    this.setState({ pittitions });
  }
  render() {
    const { pittition, isFetching } = this.props.pittition;
    const activePittition = pittition[this.state.activePittitionOpen];

    const this_pt = this;
    var { user } = this.props.user;
    console.log("USER IS " + JSON.stringify(user))
    try {
      user = JSON.parse(user);
    } catch(error) {
      user = {}
    }
    // !this.props.pittition.isFetching &&
  
    const menu = this.state.sidebarVisible ? <MySideMenu user={user} navigation={this.props.navigation} /> : <Text></Text>;
     if(this.state.pittitionFetcher.isFetching) {
      return(<View />)
    }
    if( !this.state.pittitionFetcher.isFetching && (this.state.pittitions === undefined || this.state.pittitions.length === 0)) {      
      return ( 
        <SideMenu menu={menu} isOpen={this.state.sidebarVisible} onChange={isOpen => this.handleSidebarToggle(isOpen)}>
          <AppBar navigation={this.props.navigation} sortByPopularity={this.sortByPopularity} sortByDate={this.sortByDate} handleOpen={this.handleOpenClose} handleSidebarToggle={this.handleSidebarToggle} />
          <Text style={styles.emptyTextStyle}>No pittitions.</Text>
           <Modal visible={this.state.modalVisible} animationType={'slide'}>
             <View>
                <CreatePittition user={user} handleCreatePittition={this.handleCreatePittition} handleClose={this.handleOpenClose} />
             </View>
          </Modal>
        </SideMenu>
      )
    }

    return (
     
        <SideMenu 
          menu={menu} 
          isOpen={this.state.sidebarVisible}
          onChange={isOpen => this.handleSidebarToggle(isOpen)}
        >

          <AppBar navigation={this.props.navigation} sortByPopularity={this.sortByPopularity} sortByDate={this.sortByDate} handleOpen={this.handleOpenClose} handleSidebarToggle={this.handleSidebarToggle} />

          <ScrollView style={scrollViewStyle} 
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)} />
        }
          >
          
            {
              this.state.pittitions.map(function(pitt, i){

                return (
                  <TouchableWithoutFeedback key={i} onPress={() => { this_pt.handleViewPittition(this_pt.props, i) }}>
                    <View>
                      <Pittition
                        num={i}
                        id={pitt._id}
                        viewer={user}
                        author={pitt.author}
                        img_url={pitt.img_url}
                        date={Moment(pitt.date).fromNow()}
                        title={pitt.title}
                        description={pitt.description}
                        status={pitt.status}
                        shares={pitt.shares}
                        followers={pitt.followers}
                        followed={pitt.followers.includes(user.userName)}
                        comments={pitt.comments}
                        updates={pitt.updates}
                        likes={pitt.likes}
                        handleClickOption={this_pt.handleClickOption} 
                        handleOpenCloseStatus={this_pt.handleOpenCloseStatus} />
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
           
          </ScrollView>

          <Modal
            visible={this.state.modalVisible}
            animationType={'slide'}
         
            >
             <View>
                <CreatePittition user={user} handleCreatePittition={this.handleCreatePittition} handleClose={this.handleOpenClose} />
             </View>
          </Modal>
    

          <Modal visible={this.state.statusModalVisible}  animationType={'slide'}>
              <View style={styles.modalStyle}>
                <View style={{ flexDirection: 'column', flex: height > 700 ? 0.35 : 0.5, backgroundColor: '#42A5F5', paddingBottom: 20}}>
                  
                  <View style={{ backgroundColor: '#42A5F5', height: 50 }}/>
                  <View style={{ flexDirection: 'row', flex: 0.6, alignItems: 'center', paddingLeft: 20, backgroundColor: '#42A5F5' }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Update Status</Text>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 20 }}>
                      <TouchableWithoutFeedback onPress={() => this.setState({ statusModalVisible: false, statusUpdateMessage: '' })}>
                        <IonIcon name="ios-close" size={50} color='white' style={{ alignSelf: 'flex-end' }}/>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                 
                  <View style={styles.headerStyle}>
                    <Image
                      style={{ alignSelf: 'center', width: 50, height: 50, borderRadius: 25}}
                      source={{uri: activePittition ? activePittition.img_url : '' }} />
                    <View style={{ paddingLeft: 20 }}>
                      <Text style={{ fontSize: 16, color: 'white', fontWeight: '400' }}>{activePittition ? activePittition.title : ''}</Text>
                      <Text style={{ fontSize: 14, color: 'white', marginLeft: 0 }}>{activePittition ? activePittition.author : ''}</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#42A5F5', marginTop: 10, paddingRight: 10}}>
                    <Text style={{ fontSize: 14, color: 'white', fontWeight: '600', paddingLeft: 20 }}>{activePittition.description}</Text>
                  </View>
                </View>

                  <View style={{ flexDirection: 'column', flex: 1 }}>
                  <ScrollView>
                   {

                    pittitionStatuses.map(function(status, i) {

                    if(this_pt.state.pittitions.length === 0)  return 

                    const selected = this_pt.state.activePittitionStatus === i;
                    const style = selected ? styles.activeStatusStyle : styles.statusStyle;
                    const color = selected ? '#42A5F5' : 'gray';
                    const icon = selected ? <IonIcon name="ios-checkmark" size={40} color="#42A5F5" /> : <View />
                    const fontWeight = selected ? 'bold' : '500';

                    return (
                      <TouchableWithoutFeedback key={i} onPress={ () => {this_pt.handleClickStatusBar(i)}}>
                        <View style={styles.statusBarStyle}>
                          <View style={style}>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                              <Text style={{ fontSize: 20, color, fontWeight, textAlign: 'left' }}>{status.status}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-start'}}>
                              <Text style={{ color: 'gray' }}>{status.description}</Text>
                            </View>
                          </View>
                          <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 20 }}>
                            {icon}
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    )
                  })
                }
               
                   <KeyboardAwareScrollView>
                    <TextInput
                      style={{ padding: 10, position: 'relative', width: '100%', backgroundColor: '#F7F8FC', height: 100 }}
                      value={this_pt.state.statusUpdateMessage}
                      onChangeText={(statusUpdateMessage) => this_pt.setState({ statusUpdateMessage })}
                      placeholder="Reason" 
                      multiline={true}/>
                  </KeyboardAwareScrollView>
               
                  <TouchableWithoutFeedback  onPress={ () => {this_pt.handleUpdateStatus()}}>
                    <View style={{ backgroundColor: '#42A5F5', height: 60, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20}}>Update status</Text>
                    </View>
                  </TouchableWithoutFeedback>

                </ScrollView>
                </View>
              </View>
          </Modal>
        </SideMenu>
     
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: "white",
    height: '100%',

  },
  statusStyle:{
    alignItems: 'flex-start',
    paddingLeft: 20,
    height: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 0.85,
  },
  statusBarStyle: {
    flexDirection: 'row',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
   activeStatusStyle:{
    alignItems: 'flex-start',
    paddingLeft: 20,
    height: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 0.85,
  },
  container: {
    backgroundColor: '#F7F8FC',
  },
  emptyTextStyle: {
    textAlign: 'center',
    color: '#999',
    fontSize: 20,
    marginTop: 50
  },
  headerStyle: {
    flex: 0.6,
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
    marginTop: 20,
    backgroundColor: '#42A5F5',
    alignItems: 'center',
  },
});

const scrollViewStyle = {
  // marginTop: height/7.5,
  width: '100%',

}


function mapStateToProps (state) {
  return {
    pittition: state.pittition,
    activePittition: state.activePittition,
    user: state.user
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getPittion: () => dispatch(fetchPittitionFromAPI()),
    getActivePittition: () => dispatch(getActivePittition())
  }
}


export const HomeScreenContainer = connect(
 mapStateToProps
)(HomeScreen);
// Overview = connect()(Overview);
export default HomeScreenContainer;
