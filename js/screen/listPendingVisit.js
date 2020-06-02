import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";

import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableHighlight, Image, ActivityIndicator, BackHandler } from 'react-native';
import { Button, Toast } from 'native-base'

import { API } from '../../config/API';

import CardPendingVisit from '../component/cardPendingVisit';

class ListPendingVisitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataNotification: [],
      data: [],
      loading: false
    };
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener('backPress', this.handleBackPress);

    this.setState({
      loading: true
    })

    await this.fetchData()

    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        await this.fetchNotif()
      } else {
        Toast.show({
          text: "No connection",
          buttonText: "Okay",
          duration: 3000,
          type: "danger"
        })
      }
    })

    this.setState({
      loading: false
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('backPress', this.handleBackPress);
  }

  fetchNotif = async () => {
    try {
      let token = await AsyncStorage.getItem('token_bhn_md')
      let allNotif = await API.get('/notification', { headers: { token } })

      let newNotif = await allNotif.data.data.find(element => Number(element.read) === 0)

      this.setState({
        dataNotification: allNotif.data.data,
        newNotif: newNotif ? true : false,
      })
    } catch (err) {
      Toast.show({
        text: "Fetch notification failed",
        buttonText: "Okay",
        duration: 3000,
        type: "danger"
      })
    }
  }

  fetchData = async () => {
    let listPendingVisit = await AsyncStorage.getItem('visit_pending')
    let dataPending = JSON.parse(listPendingVisit) || []

    this.setState({
      data: dataPending
    })
  }

  logout = async () => {
    await AsyncStorage.clear()
    this.props.navigation.navigate("Login")

    this.setState({
      proses: false
    })
  }

  sendPendingVisit = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        let token = await AsyncStorage.getItem('token_bhn_md'), listFailed = []

        this.setState({ loading: true })
        let promises = []

        await this.state.data.forEach(async element => {
          let storeCode
          var formData = new FormData();

          await element.forEach(el => {
            if (el[0] === "store_code") storeCode = el[1]
            formData.append(el[0], el[1])
          })

          promises.push(API.post('/visit', formData, { headers: { token } }))
        })

        Promise.all(promises)
          .then(async response => {

            let listStoreCode = []
            await response.forEach(({ data }) => {
              listStoreCode.push(data.data.store_code)
            })

            Toast.show({
              text: `Add pending data visit code store ${listStoreCode.join()} success`,
              buttonText: "Okay",
              duration: 3000,
              type: "success"
            })

            this.setState({ loading: false })

            if (listFailed.length > 0) await AsyncStorage.setItem('visit_pending', JSON.stringify(listFailed))
            else {
              await AsyncStorage.removeItem('visit_pending')
              this.setState({ sendPendingVisit: false })
            }
            await this.fetchData()
          })
          .catch(err => {
            Toast.show({
              text: `Please try again`,
              buttonText: "Okay",
              duration: 2000,
              type: "danger"
            })

            this.setState({ loading: false })
          })
      } else {
        Toast.show({
          text: "No connection",
          buttonText: "Okay",
          duration: 3000,
          type: "danger"
        })
      }
    })
  }

  delete = async order => {
    let newData = this.state.data
    this.setState({ data: [] })
    newData.splice(order, 1)

    if (newData.length > 0) {
      await AsyncStorage.setItem('visit_pending', JSON.stringify(newData))
    } else {
      await AsyncStorage.removeItem('visit_pending')
    }

    this.setState({
      data: newData
    })
  }

  handleBackPress = () => {
    if (this.props.isFocused === true) {
      this.props.route.params.sendPendingVisit()
    }
  }

  render() {
    return (
      <SafeAreaView style={{ height: '100%', backgroundColor: '#0079C2', padding: 15 }}>
        <View style={styles.header}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold', marginRight: 10 }}>BHN MD</Text>

            {
              this.state.newNotif
                ? <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} ref={ref => this.touchable = ref} onPress={() => this.showPopover()} underlayColor="transparent">
                  <Image source={require('../asset/notif-new.png')} style={{
                    height: 30,
                    width: 33,
                    resizeMode: 'cover'
                  }} />
                </TouchableHighlight>
                : <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} ref={ref => this.touchable = ref} onPress={() => this.showPopover()} underlayColor="transparent">
                  <Image source={require('../asset/notif.png')} style={{
                    height: 27,
                    width: 27,
                    resizeMode: 'cover'
                  }} />
                </TouchableHighlight>
            }

          </View>
          <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => this.logout()} underlayColor="transparent">
            <>
              <Image source={require('../asset/logout.png')} style={{
                height: 27,
                width: 27,
                resizeMode: 'cover',
                marginRight: 5
              }} />
              <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Keluar</Text>
            </>
          </TouchableHighlight>
        </View>

        <View style={{ backgroundColor: 'white', marginTop: 15, marginBottom: 15, alignItems: 'center', padding: 5 }}>
          <Text style={{ fontSize: 18 }}>List Pending</Text>
        </View>

        <ScrollView>
          {
            this.state.data.map((el, index) =>
              <CardPendingVisit data={el} key={index} order={index} delete={this.delete} loading={this.state.loading} />
            )
          }
        </ScrollView>
        <Button success style={{ justifyContent: 'center' }} onPress={() => this.sendPendingVisit()} disabled={this.state.data.length === 0 || this.state.loading}>
          {
            this.state.loading
              ? <ActivityIndicator />
              : <Text style={{ color: 'white' }}>Send All</Text>
          }
        </Button>

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30
  },
})

function ListPendingVisit(props) {
  const isFocused = useIsFocused();

  return <ListPendingVisitScreen {...props} isFocused={isFocused} />;
}

export default ListPendingVisit
