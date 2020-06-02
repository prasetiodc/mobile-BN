import React, { Component } from 'react'

import { Text, View, Image, Alert } from 'react-native';
import { Button } from 'native-base';

export default class cardPendingVisit extends Component {
  state = {
    storeCode: '',
    dateVisit: ''
  }

  async componentDidMount() {
    let storeCode = await this.props.data.find(el => el[0] === "store_code")
    let dateVisit = await this.props.data.find(el => el[0] === "visit_date")

    this.setState({
      storeCode: storeCode[1],
      dateVisit: dateVisit[1]
    })
  }

  delete = () => {
    Alert.alert(
      "Warning",
      "Are you sure to delete this visit ?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => this.props.delete(this.props.order)
        }
      ],
      { cancelable: false }
    );

  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', borderRadius: 5, flexDirection: 'row', marginBottom:5 }}>
        <View style={{ padding: 10, width: '85%' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Store code :</Text>
            <Text style={{ fontWeight: 'bold', marginLeft: 5 }}>{this.state.storeCode}</Text>
          </View>
          <Text>Visit date : {this.state.dateVisit}</Text>
        </View>
        <Button onPress={this.delete} style={{ backgroundColor: 'red', width: '15%', height: '100%', borderTopRightRadius: 5, borderBottomRightRadius: 5, justifyContent: 'center', alignItems: 'center' }} disabled={this.props.loading}>
          <Image source={require('../asset/delete.png')} style={{
            width: 30, height: 30,
            resizeMode: 'cover'
          }} />
        </Button>
      </View>
    )
  }
}
