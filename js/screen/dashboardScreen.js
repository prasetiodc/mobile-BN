import React, { Component } from 'react'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableHighlight, Dimensions, Image, RefreshControl, BackHandler, Linking } from 'react-native';
import { Icon, Badge, Input, Item, Fab, List, ListItem, Left, Right } from 'native-base';
import Popover from 'react-native-popover-view'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { API, BaseURL } from '../../config/API';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

class dashboardScreen extends Component {
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
      loadingText: false
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })

    await this.fetchNotif()
    await this.fetchData()

    this.setState({
      loading: false
    })
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
  }

  fetchNotif = async () => {
    // let token = await AsyncStorage.getItem('token')
    try {
      let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkJITjAwMSIsImVtYWlsIjoiQkhOMDAxQGdtYWlsLmNvbSIsImlhdCI6MTU4NDg2MTc5NH0.D85cWtQIDzZ2kXHvaIM4BnXCc9c2GVXFA2bqKl2sSIE'
      let allNotif = await API.get('/notification', { headers: { token } })

      let newNotif = await allNotif.data.data.find(element => Number(element.read) === 0)

      this.setState({
        dataNotification: allNotif.data.data,
        newNotif: newNotif ? true : false,
      })
    } catch (err) {
      console.log(err)
      alert(err)
    }
  }

  fetchData = async () => {
    // let token = await AsyncStorage.getItem('token')
    try {
      let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkJITjAwMSIsImVtYWlsIjoiQkhOMDAxQGdtYWlsLmNvbSIsImlhdCI6MTU4NDg2MTc5NH0.D85cWtQIDzZ2kXHvaIM4BnXCc9c2GVXFA2bqKl2sSIE'
      let allVisit = await API.get('/visit?page=1', { headers: { token } })

      this.setState({
        data: allVisit.data.data,
        dataForDisplay: allVisit.data.data,
      })
    } catch (err) {
      alert(err)
    }
  }

  logout = async () => {

    await AsyncStorage.clear()

    alert("logout sukses")
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Login' })],
    // });
    // this.props.navigation.dispatch(resetAction);

    // this.setState({
    //   proses: false
    // })
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

    await this.fetchData()

    this.setState({
      loading: false
    })
  }

  handleOpenNotif = async (id, url) => {
    try {
      // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkJITjAwMSIsImVtYWlsIjoiQkhOMDAxQGdtYWlsLmNvbSIsImlhdCI6MTU4NDg2MTc5NH0.D85cWtQIDzZ2kXHvaIM4BnXCc9c2GVXFA2bqKl2sSIE'

      // let updateNotif = await API.put(`/notification/${id}`, { headers: { token } })

      // if (updateNotif) {
      this.closePopover()
      // this.fetchNotif()
      Linking.openURL(url);
      // }
    } catch (err) {
      alert(err)
    }
  }

  fetchDataLoadMore = async () => {
    try {
      let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkJITjAwMSIsImVtYWlsIjoiQkhOMDAxQGdtYWlsLmNvbSIsImlhdCI6MTU4NDg2MTc5NH0.D85cWtQIDzZ2kXHvaIM4BnXCc9c2GVXFA2bqKl2sSIE'
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
      alert(err)
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

  render() {
    function getFormatDate(args) {
      let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

      return `${new Date(args).getDate()} ${months[new Date(args).getMonth()]} ${new Date(args).getFullYear()}`
    }
    return (
      <>
        <SafeAreaView style={{ height: '100%', backgroundColor: '#0079C2', padding: 15 }}>
          <View style={styles.header}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold', marginRight: 10 }}>BHN MD</Text>

              {
                this.state.newNotif
                  ? <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} ref={ref => this.touchable = ref} onPress={() => this.showPopover()}>
                    <>
                      <Ionicons active name="ios-notifications" size={30} style={{ color: 'white' }} />
                      <Badge style={{ height: 10 }}></Badge>
                    </>
                  </TouchableHighlight>
                  : <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} ref={ref => this.touchable = ref} onPress={() => this.showPopover()}>
                    <Ionicons active name="ios-notifications-outline" size={30} style={{ color: 'white' }} />
                  </TouchableHighlight>
              }

            </View>
            <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => this.logout()}>
              <>
                <FontAwesome name='power-off' style={{ color: 'white', marginRight: 10 }} size={28} />
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
                ? <Text>Loading</Text>
                : this.state.dataForDisplay.map(element =>
                  <View style={{ backgroundColor: 'white', minHeight: 470, height: 'auto', marginBottom: 20 }} key={element.visit_id}>
                    <Image source={{ uri: `${BaseURL}/${element.img_store}` }} style={{ width: '100%', height: 400 }} />

                    <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10, paddingRight: 10 }}>
                      <Text style={{
                        fontSize: 20
                      }}>{element.tbl_store.tbl_retailer.initial} - {element.tbl_store.store_name} ({element.tbl_store.store_code})</Text>
                      <Text style={{ fontSize: 15, color: '#F0F0F0' }}>Dikunjungi tanggal {getFormatDate(element.visit_date)}</Text>
                    </View>
                  </View>
                )
            }
            {
              this.state.loadingText && this.state.data.length > 0 && <Text style={{ alignSelf: 'center', margin: 5, color: 'white' }}>Loading more...</Text>
            }
          </ScrollView>
          <Fab
            active={this.state.active}
            containerStyle={{}}
            style={{ backgroundColor: 'white', marginBottom: 70 }}
            position="bottomRight"
            onPress={() => this.refresh()}>
            <Ionicons name="md-refresh" style={{ color: "black" }} />
          </Fab>
          <Fab
            active={this.state.active}
            containerStyle={{}}
            style={{ backgroundColor: 'green' }}
            position="bottomRight"
          // onPress={() => this.setState({ active: !this.state.active })}>
          >
            <Feather name="plus" />
          </Fab>
        </SafeAreaView >

        <Popover
          isVisible={this.state.isVisible}
          fromView={this.touchable}
          onRequestClose={() => this.closePopover()}>
          <List>
            {
              this.state.dataNotification.map(element =>
                <ListItem selected key={element.id} onPress={() => this.handleOpenNotif(element.id, `${BaseURL}/${element.path_file}`)} style={{ dispaly: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  {/* <Left> */}
                  <Text>{element.message}</Text>
                  {/* </Left> */}
                  {
                    Number(element.read) === 0 && <Badge style={{ marginLeft: 10, height: 10 }} />
                  }
                  {/* <Right>
                  </Right> */}
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

export default connect()(dashboardScreen)