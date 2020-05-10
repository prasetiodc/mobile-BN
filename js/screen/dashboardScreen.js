import React, { Component } from 'react'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";

import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableHighlight, Image, ActivityIndicator, Linking, BackHandler } from 'react-native';
import { Badge, Input, Item, Fab, List, ListItem, Toast } from 'native-base';
import Popover from 'react-native-popover-view'

import CardVisit from '../component/cardVisit';

import { API, BaseURL } from '../../config/API';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cari: "",
      data: [],
      dataForDisplay: [],
      dataNotification: [],
      loading: false,
      isVisible: false,
      newNotif: false,
      page: 1,
      loadingText: false,
      sendPendingVisit: false
    };
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener('backPress', this.handleBackPress);
    await this.refresh()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.cari !== prevState.cari) {
      if (this.state.cari === "") {
        this.setState({ dataForDisplay: this.state.data })
      } else {
        let hasilSearch = await this.state.data.filter(el => el.tbl_store.store_code.toLowerCase().match(new RegExp(this.state.cari.toLowerCase())) || el.tbl_store.store_name.toLowerCase().match(new RegExp(this.state.cari.toLowerCase())) || el.tbl_store.tbl_retailer.initial.toLowerCase().match(new RegExp(this.state.cari.toLowerCase())))
        this.setState({ dataForDisplay: hasilSearch })
      }
    }

    if (this.props.isFocused !== prevProps.isFocused) {
      if (this.props.isFocused === true) {
        await this.sendPendingVisit()
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('backPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.props.isFocused === true) {
      BackHandler.exitApp()
    }
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
    try {
      let token = await AsyncStorage.getItem('token_bhn_md')
      let allVisit = await API.get('/visit?page=1', { headers: { token } })

      this.setState({
        data: allVisit.data.data,
        dataForDisplay: allVisit.data.data,
      })
    } catch (err) {
      console.log(err)
      Toast.show({
        text: "Fetch data visit failed",
        buttonText: "Okay",
        duration: 3000,
        type: "danger"
      })
    }
  }

  logout = async () => {

    await AsyncStorage.clear()
    this.props.navigation.navigate("Login")

    this.setState({
      proses: false
    })
  }

  showPopover() {
    this.setState({ isVisible: true });
  }

  closePopover() {
    this.setState({ isVisible: false });
  }

  refresh = async () => {
    this.setState({
      loading: true
    })

    await this.sendPendingVisit()

    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        await this.fetchNotif()
        await this.fetchData()
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

  handleOpenNotif = async (id, url) => {
    try {
      let token = await AsyncStorage.getItem('token_bhn_md')

      let updateNotif = await API.put(`/notification/${id}`, {}, { headers: { token } })

      if (updateNotif) {
        this.closePopover()
        await this.fetchNotif()
        Linking.openURL(url);
      }
    } catch (err) {
    }
  }

  fetchDataLoadMore = async () => {
    try {
      let token = await AsyncStorage.getItem('token_bhn_md')
      let getData = await API.get(`/visit?page=${this.state.page}`, { headers: { token } })
      let hasilSearch

      if (this.state.cari !== "") {
        hasilSearch = await getData.data.data.filter(el => el.tbl_store.store_code.toLowerCase().match(new RegExp(this.state.cari.toLowerCase())) || el.tbl_store.store_name.toLowerCase().match(new RegExp(this.state.cari.toLowerCase())) || el.tbl_store.tbl_retailer.initial.toLowerCase().match(new RegExp(this.state.cari.toLowerCase())))
      } else {
        hasilSearch = getData.data.data
      }

      this.setState({
        data: [...this.state.data, ...getData.data.data],
        dataForDisplay: [...this.state.dataForDisplay, ...hasilSearch],
      })
    } catch (err) {
      Toast.show({
        text: "Fetch more data visit failed",
        buttonText: "Okay",
        duration: 3000,
        type: "danger"
      })
    }
  }

  loadMore = async () => {
    this.setState({
      page: this.state.page + 1,
      loadingText: true
    })

    await this.fetchDataLoadMore()

    this.setState({
      loadingText: false
    })
  }

  navigateAddScreen = () => {
    this.props.navigation.navigate("AddVisit", { refresh: () => this.refresh() })
  }

  navigateListPendingVisit = () => {
    this.props.navigation.navigate("ListPendingVisit", { sendPendingVisit: () => this.sendPendingVisit() })
  }

  sendPendingVisit = async () => {
    let listPendingVisit = await AsyncStorage.getItem('visit_pending')

    if (listPendingVisit && listPendingVisit !== "[]") {
      this.setState({ sendPendingVisit: true })
    } else {
      this.setState({ sendPendingVisit: false })
    }
  }

  render() {
    return (
      <>
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
                      resizeMode: 'stretch'
                    }} />
                  </TouchableHighlight>
                  : <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} ref={ref => this.touchable = ref} onPress={() => this.showPopover()} underlayColor="transparent">
                    <Image source={require('../asset/notif.png')} style={{
                      height: 27,
                      width: 27,
                      resizeMode: 'stretch'
                    }} />
                  </TouchableHighlight>
              }

            </View>
            <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => this.logout()} underlayColor="transparent">
              <>
                <Image source={require('../asset/logout.png')} style={{
                  height: 27,
                  width: 27,
                  resizeMode: 'stretch',
                  marginRight: 5
                }} />
                <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Keluar</Text>
              </>
            </TouchableHighlight>
          </View>

          <Item style={{ marginTop: 20, marginBottom: 20 }}>
            <Input id='cari'
              placeholder='Cari'
              value={this.state.cari}
              onChangeText={(text) => this.setState({
                cari: text
              })}
              style={{
                backgroundColor: 'white'
              }} />
          </Item>
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                this.loadMore()
              }
            }}
            scrollEventThrottle={400}>
            {
              this.state.loading
                ? <ActivityIndicator size="large" color="#fff" />
                : this.state.dataForDisplay.length > 0
                  ? this.state.dataForDisplay.map((element, index) =>
                    <TouchableHighlight style={{ backgroundColor: 'white', minHeight: 470, height: 'auto', marginBottom: 20 }} key={index} underlayColor="white" onPress={() => this.props.navigation.navigate('DetailVisit', { data: element })}>
                      <CardVisit data={element} />
                    </TouchableHighlight>
                  )
                  : <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image source={require('../asset/search.png')} style={{
                      height: 250,
                      width: 250,
                      resizeMode: 'stretch',
                      marginTop: 50
                    }} />
                  </View>
            }
            {
              this.state.loadingText && this.state.data.length > 0 && <Text style={{ alignSelf: 'center', margin: 5, color: 'white' }}>Loading more...</Text>
            }
          </ScrollView>
          {
            this.state.sendPendingVisit && <Fab
              active={this.state.active}
              style={{ backgroundColor: 'red', marginBottom: 145 }}
              position="bottomRight"
              onPress={() => this.navigateListPendingVisit()}>
              <Image source={require('../asset/pending.png')} style={{
                height: 35,
                width: 35,
                resizeMode: 'stretch'
              }} />
            </Fab>
          }

          <Fab
            active={this.state.active}
            style={{ backgroundColor: 'white', marginBottom: 70 }}
            position="bottomRight"
            onPress={() => this.refresh()}>
            <Image source={require('../asset/refresh.png')} style={{
              height: 20,
              width: 20,
              resizeMode: 'stretch'
            }} />
          </Fab>
          <Fab
            active={this.state.active}
            style={{ backgroundColor: 'green' }}
            position="bottomRight"
            onPress={this.navigateAddScreen}
          >
            <Image source={require('../asset/plus.png')} style={{
              height: 20,
              width: 20,
              resizeMode: 'stretch'
            }} />
          </Fab>
        </SafeAreaView >

        <Popover
          isVisible={this.state.isVisible}
          fromView={this.touchable}
          onRequestClose={() => this.closePopover()}>
          <List>
            {
              this.state.dataNotification.map(element =>
                <ListItem selected key={`${element.id}${element.path_file}`} onPress={() => this.handleOpenNotif(element.id, `${BaseURL}/${element.path_file}`)} style={{ dispaly: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>{element.message}</Text>
                  {
                    Number(element.read) === 0 && <Badge style={{ marginLeft: 10, height: 10 }} />
                  }
                </ListItem>
              )
            }
          </List>
        </Popover>
      </>
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

function Dashboard(props) {
  const isFocused = useIsFocused();

  return <DashboardScreen {...props} isFocused={isFocused} />;
}

export default connect()(Dashboard)