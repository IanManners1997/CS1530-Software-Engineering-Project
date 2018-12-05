import React from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, TouchableWithoutFeedback, Picker, TextInput, Image, RefreshControl, KeyboardAvoidingView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import CustomModal from 'react-native-modal'
import { fetchPittitionFromAPI, getActivePittition, updatePittitionStatusAPI, deletePittitionFromAPI, followPittitionAPI } from '../../redux/actions';
import { SearchBar } from 'react-native-elements'
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
      allPittitions: props.pittition.pittition,
      pittitionFetcher: props.pittition,
      statusModalVisible: false,
      activePittitionOpen: 0,
      activePittitionStatus: 0,
      statusUpdateMessage: '',
      refreshing: false,
      tabOpen: 'all',
      cartPittitions: [],
      reservedPittitions: this.getReserved(props.pittition.pittition, props.user.user)
    }
    this.handleOpenClose = this.handleOpenClose.bind(this);
    this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
    this.handleCreatePittition = this.handleCreatePittition.bind(this);
    this.handleClickOption = this.handleClickOption.bind(this);
    this.handleOpenCloseStatus = this.handleOpenCloseStatus.bind(this);
    this.handleClickStatusBar = this.handleClickStatusBar.bind(this);
    this.handleShowReserved = this.handleShowReserved.bind(this);
    this.handleShowAll = this.handleShowAll.bind(this);
    this.handleShowCart = this.handleShowCart.bind(this);
    this.handleFilterResources = this.handleFilterResources.bind(this);
    this.handleAddCart = this.handleAddCart.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(
      fetchPittitionFromAPI()
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pittitionFetcher: nextProps.pittition,
      pittitions: nextProps.pittition.pittition,
      reservedPittitions: this.getReserved(nextProps.pittition.pittition, nextProps.user.user),
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
  getReserved(pittitions, user) {
    var reserved = []
    var resources = pittitions
    console.log(resources)
    try {
      user = JSON.parse(user);
    } catch(error) {
      user = {}
    }
    var fullName = user.firstName + " " + user.lastName
    for(i in resources) {
      if(resources[i].reservedBy === fullName) reserved.push(resources[i])
    }
    return reserved
  }
  /*
  * HOSPITAL FUNCTIONS
  */
  handleShowReserved() {
    // var reserved = []
    // var resources = this.props.pittition.pittition
    // var user = this.props.user.user
    // try {
    //   user = JSON.parse(user);
    // } catch(error) {
    //   user = {}
    // }
    // var fullName = user.firstName + " " + user.lastName
    // for(i in resources) {
    //   if(resources[i].reservedBy === fullName) reserved.push(resources[i])
    // }
    var reserved = this.state.reservedPittitions
    this.setState({ pittitions: reserved, reservedPittitions: reserved, tabOpen: 'reserved' })
  }
  handleShowAll() {
    this.setState({ pittitions: this.props.pittition.pittition, allPittitions: this.props.pittition.pittition, tabOpen: 'all' })
  }
  handleShowCart() {
    this.setState({ pittitions: this.state.cartPittitions, cartPittitions: this.state.cartPittitions, tabOpen: 'cart' })
  }
  handleFilterResources(inputText) {
    var pittitions = []
    if(this.state.tabOpen === 'reserved') pittitions = this.state.reservedPittitions
    else if(this.state.tabOpen === 'cart') pittitions = this.state.cartPittitions
    else pittitions = this.state.allPittitions
    var filteredResources = pittitions.filter(function(resource) {
      return resource.name.toLowerCase().includes(inputText.toLowerCase());
    });
    this.setState({ pittitions: filteredResources })
  }
  handleAddCart(index) {
    var cart = this.state.cartPittitions
    cart.push(this.state.pittitions[index])
    console.log("CART IS " + JSON.stringify(cart))
    this.setState({ cartPittitions: cart })
  }
  handleCheckOut() {
    console.log("checkout")
    var reservedPittitions = this.state.reservedPittitions
    var cart = this.state.cartPittitions
    var user = this.props.user.user
    try {
      user = JSON.parse(user);
    } catch(error) {
      user = {}
    }
    console.log(this.props.user)
    // Set each cart item to unavailable
    for(i in cart) {
      cart[i].available = false
      cart[i].reservedBy = user.firstName + " " + user.lastName
    }
    newReserved = reservedPittitions.concat(cart)
    this.setState({ reservedPittitions: newReserved, cartPittitions: [], pittitions: [] })
  }

  renderCheckOut() {
    var cartNotEmpty = this.state.pittitions.length > 0
    return ( 
      <TouchableWithoutFeedback onPress={() => { this.handleCheckOut() }} disabled={!cartNotEmpty}>
        <View style={{ width: '100%', height: 50, backgroundColor: cartNotEmpty ? '#2ECC40' : '#d9d9d9', alignItems: 'center', justifyContent: 'center', opacity: cartNotEmpty ? 1 : 0}}>
          <Text style={{ color: cartNotEmpty ? 'white': 'gray' }}>CHECK OUT</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  render() {
    const { pittition, isFetching } = this.props.pittition;
    const this_pt = this;
    var { user } = this.props.user;
    console.log("IT IS " + this.state.tabOpen)
    const checkOutBar = this.state.tabOpen === 'cart' ? this.renderCheckOut() : null
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
          <AppBar navigation={this.props.navigation} handleShowAll={this.handleShowAll} handleShowReserved={this.handleShowReserved} handleShowCart={this.handleShowCart} handleOpen={this.handleOpenClose} handleSidebarToggle={this.handleSidebarToggle} />
          <SearchBar
            lightTheme
            onChangeText={this.handleFilterResources}
            placeholder='Search Resources'
            containerStyle={styles.searchContainerStyle} 
            inputStyle={styles.searchInputStyle}
            placeholderTextColor='white'
            searchIcon={{ color: 'white', size: 54 }} />
          <Text style={styles.emptyTextStyle}>No Resources.</Text>
           <Modal visible={this.state.modalVisible} animationType={'slide'}>
             <View>
                <CreatePittition user={user} handleCreatePittition={this.handleCreatePittition} handleClose={this.handleOpenClose} />
             </View>
          </Modal>
          {checkOutBar}
        </SideMenu>
      )
    }

    return (
     
        <SideMenu 
          menu={menu} 
          isOpen={this.state.sidebarVisible}
          onChange={isOpen => this.handleSidebarToggle(isOpen)}
        >

          <AppBar navigation={this.props.navigation} handleShowAll={this.handleShowAll} handleShowReserved={this.handleShowReserved} handleShowCart={this.handleShowCart} handleSidebarToggle={this.handleSidebarToggle} />
          <SearchBar
            lightTheme
            onChangeText={this.handleFilterResources}
            placeholder='Search Resources'
            containerStyle={styles.searchContainerStyle} 
            inputStyle={styles.searchInputStyle}
            placeholderTextColor='white'
            searchIcon={{ color: 'white', size: 54 }} />

          <ScrollView style={scrollViewStyle} 
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)} />
          }>
            {
              this.state.pittitions.map(function(pitt, i){

                return (
                  <TouchableWithoutFeedback key={i}>
                    <View>
                      <Pittition
                        num={i}
                        id={pitt.id}
                        name={pitt.name}
                        available={pitt.available}
                        viewer={user}
                        reservedBy={pitt.reservedBy}
                        handleClickOption={this_pt.handleClickOption} 
                        handleOpenCloseStatus={this_pt.handleOpenCloseStatus} 
                        handleAddCart={this_pt.handleAddCart} />
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
           
          </ScrollView>
          {checkOutBar}
         
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
  searchContainerStyle: {
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowRadius: 5,
    // shadowOpacity: 0.2,
    backgroundColor: '#2196F3',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
  searchInputStyle: {
    backgroundColor: '#0b7dda',
    color: 'white'
  }
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
