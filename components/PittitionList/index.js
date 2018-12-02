import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, Platform, ScrollView, Share } from 'react-native';
import Pittition from '../../components/Pittition';

import Moment from 'moment';

export default class PittitionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pittitions: props.pittitions
    };
  }

  render() {
    // const img_url = "../../img/demo.jpg";
    var { user } = this.props.user;
    try {
      user = JSON.parse(user);
    } catch(error) {
      user = {}
    }
    return (
      <ScrollView style={scrollViewStyle} >
        {
          this.props.pittitions.map( (pitt, i) => {
            return (
              <Pittition
                key={i}
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
                comments={pitt.comments}
                updates={pitt.updates}
                likes={pitt.likes} />
            )
          })
        }
      </ScrollView>
    )
  }
}

const scrollViewStyle = {
  // marginTop: height/7.5,
  width: '100%',
}