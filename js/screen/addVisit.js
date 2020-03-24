import React, { Component } from 'react'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableHighlight, Dimensions, Image, RefreshControl, BackHandler, Linking } from 'react-native';
import { Icon, Badge, Input, Item, Form, List, ListItem, Picker, Label, Button } from 'native-base';
import Popover from 'react-native-popover-view'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import ImagePicker from 'react-native-image-picker';
// import Camera from 'react-native-camera'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { API, BaseURL } from '../../config/API';

const progressStepsStyle = {
  activeStepIconBorderColor: '#0079C2',
  activeLabelColor: '#0079C2',
  activeStepNumColor: 'white',
  activeStepIconColor: '#0079C2',
  completedStepIconColor: '#0079C2',
  completedProgressBarColor: '#0079C2',
  completedCheckColor: '#4bb543',
};

const buttonTextStyle = {
  color: '#0079C2',
  fontWeight: 'bold'
};

class addVisit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataNotification: [],
      isVisible: false,
      dataAllRetailer: [],
      dataAllStore: [],
      dataAllStoreForDisplay: [],
      idRetailer: '',
      initialRetailer: '',
      nameStore: '',
      dc: '',
      city: '',
      address: '',

      img_store: '',
      img_fixture_in: null,
      img_fixture_out: null,
      idStore: '',
      entryFixComp: 'Iya',
      entryPegComp: 'Iya',
      entryPogComp: 'Iya',
      entryGoogle50k: 'Iya',
      entryGoogle100k: 'Iya',
      entryGoogle150k: 'Iya',
      entryGoogle300k: 'Iya',
      entryGoogle500k: 'Iya',
      entrySpotify1m: 'Iya',
      entrySpotify3m: 'Iya',
      entryPop1: 'Iya',
      entryPop2: 'Iya',
      assistName: '',
      giftCard: 'Iya',
      aktifPOR: 'Iya',
      changeCardGift: 'Iya',
      exitFixComp: 'Iya',
      exitPegComp: 'Iya',
      exitPogComp: 'Iya',
      exitGoogle50k: 'Iya',
      exitGoogle100k: 'Iya',
      exitGoogle150k: 'Iya',
      exitGoogle300k: 'Iya',
      exitGoogle500k: 'Iya',
      exitSpotify1m: 'Iya',
      exitSpotify3m: 'Iya',
      exitPop1: 'Iya',
      exitPop2: 'Iya',
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
    if (this.state.idRetailer !== prevState.idRetailer) {
      let newListStore = await this.state.dataAllStore.filter(el => Number(el.retailer_id) === Number(this.state.idRetailer))

      let initialRetailer = await this.state.dataAllRetailer.find(el => Number(el.id) === Number(this.state.idRetailer))

      this.setState({
        initialRetailer: initialRetailer.initial,
        dataAllStoreForDisplay: newListStore
      })
    }

    if (this.state.idStore !== prevState.idStore) {
      let storeSelected = await this.state.dataAllStoreForDisplay.find(el => el.store_code === this.state.idStore)

      if (storeSelected) {
        this.setState({
          nameStore: storeSelected.store_name,
          dc: storeSelected.tbl_dc.DC_name,
          city: storeSelected.city,
          address: storeSelected.address
        })
      } else {
        this.setState({
          nameStore: "",
          dc: "",
          city: "",
          address: ""
        })
      }
    }
  }

  fetchData = async () => {
    try {
      let token = await AsyncStorage.getItem('token_bhn_md')
      let allRetailer = await API.get('/retailer', { headers: { token } })
      let allStore = await API.get('/store', { headers: { token } })

      allStore = await allStore.data.data.filter(el => Number(el.md_id) === 2)
      this.setState({
        dataAllRetailer: allRetailer.data.data,
        dataAllStore: allStore,
        dataAllStoreForDisplay: allStore
      })
    } catch (err) {
      alert(err)
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
      alert(err)
    }
  }

  showPopover() {
    this.setState({ isVisible: true });
  }

  closePopover() {
    this.setState({ isVisible: false });
  }

  logout = async () => {

    await AsyncStorage.clear()

    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Login' })],
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate("Login")
  }

  onValueChangeRetailer = value => {
    this.setState({
      idRetailer: value
    });
  }

  onValueChangeStore = value => {
    this.setState({
      idStore: value
    });
  }

  submit = async () => {

    try {
      let token = await AsyncStorage.getItem('token_bhn_md')
      var formData = new FormData();

      formData.append("visit_date", `${new Date()}`)
      formData.append("user_id", this.props.user_id)
      formData.append("store_code", this.state.idStore)
      formData.append("entry_fixture_comp", this.state.entryFixComp.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_peg_comp", this.state.entryPegComp.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_pog_comp", this.state.entryPogComp.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_pop_pic_1", this.state.entryPop1.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_pop_pic_2", this.state.entryPop2.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_google50k", this.state.entryGoogle50k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_google100k", this.state.entryGoogle100k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_google150k", this.state.entryGoogle150k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_google300k", this.state.entryGoogle300k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_google500k", this.state.entryGoogle500k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_spotify1M", this.state.entrySpotify1m.toLowerCase() === "iya" ? 1 : 0)
      formData.append("entry_spotify3M", this.state.entrySpotify3m.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_fixture_comp", this.state.exitFixComp.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_peg_comp", this.state.exitPegComp.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_pog_comp", this.state.exitPogComp.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_pop_pic_1", this.state.exitPop1.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_pop_pic_2", this.state.exitPop2.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_google50k", this.state.exitGoogle50k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_google100k", this.state.exitGoogle100k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_google150k", this.state.exitGoogle150k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_google300k", this.state.exitGoogle300k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_google500k", this.state.exitGoogle500k.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_spotify1M", this.state.exitSpotify1m.toLowerCase() === "iya" ? 1 : 0)
      formData.append("exit_spotify3M", this.state.exitSpotify3m.toLowerCase() === "iya" ? 1 : 0)
      formData.append("assistants_name", this.state.assistName)

      formData.append("q1", this.state.giftCard.toLowerCase() === "iya" ? 1 : 0)
      formData.append("q2", this.state.aktifPOR.toLowerCase() === "iya" ? 1 : 0)
      formData.append("q3", this.state.changeCardGift.toLowerCase() === "iya" ? 1 : 0)

      console.log("PROSES 1")

      this.state.img_store && formData.append("files", {
        name: 'img_store.jpg',
        type: 'image/jpeg',
        uri: this.state.img_store.uri
      })

      this.state.img_fixture_in && formData.append("files", {
        name: 'img_fixture_in.jpg',
        type: 'image/jpeg',
        uri: this.state.img_fixture_in.uri
      })


      // formData.append("files", this.state.img_store, 'img_store')
      // formData.append("files", this.state.img_fixture_in, 'img_fixture_in')
      // formData.append("files", this.state.img_fixture_out, 'img_fixture_out')
      console.log("PROSES 2")

      // formData.append("q4", req.body.q4)
      API.post('/visit', formData,
        {
          headers: {
            token
          },
        }
      )
        .then(data => {
          this.resetForm()
          this.props.navigation.navigate('Dashboard')
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
      alert(err)

    }
  }

  launchCamera = (args) => {
    const options = {
      noData: true,
    }
    ImagePicker.launchCamera(options, (response) => {
      if (response.uri) {
        console.log(response)
        this.setState({
          img_store: response
          // filePath: response,
          // fileData: response.data,
          // fileUri: response.uri
        });

      }
    });

  }

  selectImage = () => {
    const options = {
      noData: true,
    }

    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        console.log(response)
        this.setState({ img_store: response })
      }
    })

  }

  onValueChangeNew = (name, value) => {
    console.log(name, value)
    this.setState({
      [name]: value
    })
  }

  takePicture = () => {
    const options = {}

    this.camera.capture({ metadata: options }).then((data) => {
      console.log(data)
    }).catch((error) => {
      console.log(error)
    })
  }

  resetForm = () => {
    this.setState({
      idRetailer: '',
      initialRetailer: '',
      nameStore: '',
      dc: '',
      city: '',
      address: '',

      idStore: '',
      entryFixComp: 'Iya',
      entryPegComp: 'Iya',
      entryPogComp: 'Iya',
      entryGoogle50k: 'Iya',
      entryGoogle100k: 'Iya',
      entryGoogle150k: 'Iya',
      entryGoogle300k: 'Iya',
      entryGoogle500k: 'Iya',
      entrySpotify1m: 'Iya',
      entrySpotify3m: 'Iya',
      entryPop1: 'Iya',
      entryPop2: 'Iya',
      assistName: '',
      giftCard: 'Iya',
      aktifPOR: 'Iya',
      changeCardGift: 'Iya',
      exitFixComp: 'Iya',
      exitPegComp: 'Iya',
      exitPogComp: 'Iya',
      exitGoogle50k: 'Iya',
      exitGoogle100k: 'Iya',
      exitGoogle150k: 'Iya',
      exitGoogle300k: 'Iya',
      exitGoogle500k: 'Iya',
      exitSpotify1m: 'Iya',
      exitSpotify3m: 'Iya',
      exitPop1: 'Iya',
      exitPop2: 'Iya',
    })
  }

  render() {
    return (
      <>
        <View style={{ height: '100%', backgroundColor: '#0079C2', padding: 15, display: 'flex' }}>
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
            <TouchableHighlight style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => this.logout()} underlayColor="transparent">
              <>
                <FontAwesome name='power-off' style={{ color: 'white', marginRight: 10 }} size={28} />
                <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Keluar</Text>
              </>
            </TouchableHighlight>
          </View>


          <View style={{ backgroundColor: 'white', height: '100%', marginTop: 20, padding: 0 }}>
            <ProgressSteps {...progressStepsStyle}>

              <ProgressStep label="" nextBtnTextStyle={buttonTextStyle} previousBtnStyle={{ display: 'none' }}  >
                <ScrollView>
                  <Form style={{ padding: 20, paddingTop: 0 }}>
                    <View id="idRetailer" style={{ marginBottom: 15 }}>
                      <Label>Retailer</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.idRetailer}
                          onValueChange={this.onValueChangeRetailer.bind(this)}
                        >
                          {
                            this.state.dataAllRetailer.length > 0 && this.state.dataAllRetailer.map(el =>
                              <Picker.Item label={el.initial} value={el.id} key={`${el.id}${el.initial}`} />
                            )
                          }
                        </Picker>
                      </Item>
                    </View>
                    <View id="idStore" style={{ marginBottom: 15 }}>
                      <Label>Store</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.idStore}
                          onValueChange={this.onValueChangeStore.bind(this)}
                        >
                          {
                            this.state.dataAllStoreForDisplay.map(el =>
                              <Picker.Item label={el.store_code} value={el.store_code} key={el.store_code} />
                            )
                          }
                        </Picker>
                      </Item>
                    </View>
                    <View id="nameStore" style={{ marginBottom: 15 }}>
                      <Label>Store Name</Label>
                      <Input
                        value={this.state.nameStore}
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                    <View id="dc" style={{ marginBottom: 15 }}>
                      <Label>DC/Wilayah Store</Label>
                      <Input
                        value={this.state.dc}
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                    <View id="city" style={{ marginBottom: 15 }}>
                      <Label>City</Label>
                      <Input
                        value={this.state.city}
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                    <View id="address" style={{ marginBottom: 15 }}>
                      <Label>Address</Label>
                      <Input
                        value={this.state.address}
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                    <View id="foto" style={{ marginBottom: 15 }}>
                      <Label>Image Store</Label>
                      <Button onPress={this.launchCamera}>
                        <Text>Take Photo</Text>
                      </Button>
                      <Button onPress={this.selectImage}>
                        <Text>Take Image</Text>
                      </Button>
                    </View>
                    {/* <Item>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15 }}>Gambar</Text>
                        <TouchableHighlight onPress={this.selectImage} style={styles.buttonChooseImage} underlayColor="transparent">
                          <Text style={{ fontSize: 15 }}>Choose Image</Text>
                        </TouchableHighlight>
                      </View>
                    </Item>
                    <Image source={this.state.thumbnail} style={{
                      alignSelf: 'center',
                      width: 150,
                      height: 150,
                      margin: 20
                    }} resizeMode={'stretch'} /> */}
                  </Form>
                </ScrollView>
              </ProgressStep>



              <ProgressStep label="" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                <ScrollView>
                  <Form style={{ padding: 20, paddingTop: 0 }}>
                    <View id="foto" style={{ marginBottom: 15 }}>
                      <Label>Image Entry Fixture</Label>
                      <Input
                        value="BELUM"
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                    <View id="entryFixComp" style={{ marginBottom: 15 }}>
                      <Label>Apakah itu cocok dengan apa yang ada di aplikasi?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholder="Select your SIM"
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryFixComp}
                          onValueChange={(text) => this.onValueChangeNew('entryFixComp', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="fotoFixTrait" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                      <Text> FOTO FIXTURE TRAITS</Text>
                    </View>
                    <View id="entryPEGComp" style={{ marginBottom: 15 }}>
                      <Label>Apakah jumlah PEG sudah benar ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryPegComp}
                          onValueChange={(text) => this.onValueChangeNew('entryPegComp', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="fotoPOG" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                      <Text> FOTO POG</Text>
                    </View>
                    <View id="entryPOGComp" style={{ marginBottom: 15 }}>
                      <Label>Apakah POG Terpasang dengan benar ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryPogComp}
                          onValueChange={(text) => this.onValueChangeNew('entryPogComp', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="entryGoogle50k" style={{ marginBottom: 15 }}>
                      <Label>Google 50k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryGoogle50k}
                          onValueChange={(text) => this.onValueChangeNew('entryGoogle50k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="entryGoogle100k" style={{ marginBottom: 15 }}>
                      <Label>Google 100k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryGoogle100k}
                          onValueChange={(text) => this.onValueChangeNew('entryGoogle100k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="entryGoogle150k" style={{ marginBottom: 15 }}>
                      <Label>Google 150k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryGoogle150k}
                          onValueChange={(text) => this.onValueChangeNew('entryGoogle150k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="entryGoogle300k" style={{ marginBottom: 15 }}>
                      <Label>Google 300k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryGoogle300k}
                          onValueChange={(text) => this.onValueChangeNew('entryGoogle300k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="entryGoogle500k" style={{ marginBottom: 15 }}>
                      <Label>Google 500k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryGoogle500k}
                          onValueChange={(text) => this.onValueChangeNew('entryGoogle500k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="entrySpotify1m" style={{ marginBottom: 15 }}>
                      <Label>Spotify 1m ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entrySpotify1m}
                          onValueChange={(text) => this.onValueChangeNew('entrySpotify1m', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="entrySpotify3m" style={{ marginBottom: 15 }}>
                      <Label>Spotify 3m ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entrySpotify3m}
                          onValueChange={(text) => this.onValueChangeNew('entrySpotify3m', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="fotoPop1" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                      <Text> FOTO POP 1</Text>
                    </View>
                    <View id="entryPop1" style={{ marginBottom: 15 }}>
                      <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.entryPop1}
                          onValueChange={(text) => this.onValueChangeNew('entryPop1', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {
                      this.state.idRetailer === 1 && <>
                        <View id="fotoPOP2" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                          <Text> FOTO POP 2</Text>
                        </View>
                        <View id="entryPop2" style={{ marginBottom: 15 }}>
                          <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{ backgroundColor: '#F0F0F0' }}
                              placeholderStyle={{ color: "#bfc6ea" }}
                              placeholderIconColor="#007aff"
                              selectedValue={this.state.entryPop2}
                              onValueChange={(text) => this.onValueChangeNew('entryPop2', text)}
                            >
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>
                      </>
                    }

                    <View id="knowledge" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                      <Text> Knowledge</Text>
                    </View>

                    <View id="assistName" style={{ marginBottom: 15 }}>
                      <Label>Siapa nama asisten toko ?</Label>
                      <Input
                        value={this.state.assistName}
                        style={{ backgroundColor: '#F0F0F0' }}
                        onChangeText={(text) => this.setState({
                          assistName: text
                        })} />
                    </View>

                    <View id="giftCard" style={{ marginBottom: 15 }}>
                      <Label>Apakah staf tahu cara mengaktifkan kartu hadiah ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.giftCard}
                          onValueChange={(text) => this.onValueChangeNew('giftCard', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="aktifPOR" style={{ marginBottom: 15 }}>
                      <Label>Apakah staf tahu cara mengaktifkan POR ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.aktifPOR}
                          onValueChange={(text) => this.onValueChangeNew('aktifPOR', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="changeCardGift" style={{ marginBottom: 15 }}>
                      <Label>Apakah staf tahu bagaimana menangani keluhan pelanggan tentang penukaran kartu hadiah ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.changeCardGift}
                          onValueChange={(text) => this.onValueChangeNew('changeCardGift', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>
                  </Form>
                </ScrollView>
              </ProgressStep>



              <ProgressStep label="" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                <Text>SKIP</Text>
              </ProgressStep>


              <ProgressStep label="" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                <ScrollView>
                  <Form style={{ padding: 20, paddingTop: 0 }}>
                    <View id="foto" style={{ marginBottom: 15 }}>
                      <Label>Image Exit Fixture</Label>
                      <Input
                        value="BELUM"
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                    <View id="exitFixComp" style={{ marginBottom: 15 }}>
                      <Label>Apakah itu cocok dengan apa yang ada di aplikasi?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitFixComp}
                          onValueChange={(text) => this.onValueChangeNew('exitFixComp', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="fotoFixTrait" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                      <Text> FOTO FIXTURE TRAITS</Text>
                    </View>
                    <View id="exitPEGComp" style={{ marginBottom: 15 }}>
                      <Label>Apakah jumlah PEG sudah benar ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitPegComp}
                          onValueChange={(text) => this.onValueChangeNew('exitPegComp', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="fotoPOG" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                      <Text> FOTO POG</Text>
                    </View>
                    <View id="exitPOGComp" style={{ marginBottom: 15 }}>
                      <Label>Apakah POG Terpasang dengan benar ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitPogComp}
                          onValueChange={(text) => this.onValueChangeNew('exitPogComp', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="exitGoogle50k" style={{ marginBottom: 15 }}>
                      <Label>Google 50k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitGoogle50k}
                          onValueChange={(text) => this.onValueChangeNew('exitGoogle50k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="exitGoogle100k" style={{ marginBottom: 15 }}>
                      <Label>Google 100k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitGoogle100k}
                          onValueChange={(text) => this.onValueChangeNew('exitGoogle100k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="exitGoogle150k" style={{ marginBottom: 15 }}>
                      <Label>Google 150k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitGoogle150k}
                          onValueChange={(text) => this.onValueChangeNew('exitGoogle150k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="exitGoogle300k" style={{ marginBottom: 15 }}>
                      <Label>Google 300k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitGoogle300k}
                          onValueChange={(text) => this.onValueChangeNew('exitGoogle300k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="exitGoogle500k" style={{ marginBottom: 15 }}>
                      <Label>Google 500k?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitGoogle500k}
                          onValueChange={(text) => this.onValueChangeNew('exitGoogle500k', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="exitSpotify1m" style={{ marginBottom: 15 }}>
                      <Label>Spotify 1m ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitSpotify1m}
                          onValueChange={(text) => this.onValueChangeNew('exitSpotify1m', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="exitSpotify3m" style={{ marginBottom: 15 }}>
                      <Label>Spotify 3m ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitSpotify3m}
                          onValueChange={(text) => this.onValueChangeNew('exitSpotify3m', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    <View id="fotoPop1" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                      <Text> FOTO POP 1</Text>
                    </View>
                    <View id="exitPop1" style={{ marginBottom: 15 }}>
                      <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ backgroundColor: '#F0F0F0' }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.exitPop1}
                          onValueChange={(text) => this.onValueChangeNew('exitPop1', text)}
                        >
                          <Picker.Item label="Iya" value="Iya" />
                          <Picker.Item label="Tidak" value="Tidak" />
                        </Picker>
                      </Item>
                    </View>

                    {
                      this.state.idRetailer === 1 && <>
                        <View id="fotoPOP2" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                          <Text> FOTO POP 2</Text>
                        </View>
                        <View id="exitPop2" style={{ marginBottom: 15 }}>
                          <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                          <Item picker>
                            <Picker
                              mode="dropdown"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{ backgroundColor: '#F0F0F0' }}
                              placeholderStyle={{ color: "#bfc6ea" }}
                              placeholderIconColor="#007aff"
                              selectedValue={this.state.exitPop2}
                              onValueChange={(text) => this.onValueChangeNew('exitPop2', text)}
                            >
                              <Picker.Item label="Iya" value="Iya" />
                              <Picker.Item label="Tidak" value="Tidak" />
                            </Picker>
                          </Item>
                        </View>
                      </>
                    }
                  </Form>
                </ScrollView>
              </ProgressStep>


              <ProgressStep label="" onSubmit={this.submit} nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                <ScrollView>
                  <Form style={{ padding: 20, paddingTop: 0 }}>
                    <>
                      <View id="idRetailerRekap" style={{ marginBottom: 15 }}>
                        <Label>Retailer</Label>
                        <Input
                          value={this.state.initialRetailer}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="idStoreRekap" style={{ marginBottom: 15 }}>
                        <Label>Store</Label>
                        <Input
                          value={this.state.idStore}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="nameStoreRekap" style={{ marginBottom: 15 }}>
                        <Label>Store Name</Label>
                        <Input
                          value={this.state.nameStore}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="dcRekap" style={{ marginBottom: 15 }}>
                        <Label>DC/Wilayah Store</Label>
                        <Input
                          value={this.state.dc}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="cityRekap" style={{ marginBottom: 15 }}>
                        <Label>City</Label>
                        <Input
                          value={this.state.city}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="addressRekap" style={{ marginBottom: 15 }}>
                        <Label>Address</Label>
                        <Input
                          value={this.state.address}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="fotoTokoRekap" style={{ marginBottom: 15 }}>
                        <Label>Image Store</Label>
                        <Input
                          value="BELUM"
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                    </>

                    <>
                      <View id="fotoRekap" style={{ marginBottom: 15 }}>
                        <Label>Image Entry Fixture</Label>
                        <Input
                          value="BELUM"
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="entryFixCompRekap" style={{ marginBottom: 15 }}>

                        <Label>Apakah itu cocok dengan apa yang ada di aplikasi?</Label>
                        <Input
                          value={this.state.entryFixComp}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="fotoFixTraitRekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                        <Text> FOTO FIXTURE TRAITS</Text>
                      </View>
                      <View id="entryPEGCompRekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah jumlah PEG sudah benar ?</Label>
                        <Input
                          value={this.state.entryPegComp}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="fotoPOGRekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                        <Text> FOTO POG</Text>
                      </View>
                      <View id="entryPOGCompRekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah POG Terpasang dengan benar ?</Label>
                        <Input
                          value={this.state.entryPogComp}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="entryGoogle50kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 50k?</Label>
                        <Input
                          value={this.state.entryGoogle50k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="entryGoogle100kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 100k?</Label>
                        <Input
                          value={this.state.entryGoogle100k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="entryGoogle150kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 150k?</Label>
                        <Input
                          value={this.state.entryGoogle150k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="entryGoogle300kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 300k?</Label>
                        <Input
                          value={this.state.entryGoogle300k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="entryGoogle500kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 500k?</Label>
                        <Input
                          value={this.state.entryGoogle500k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="entrySpotify1mRekap" style={{ marginBottom: 15 }}>
                        <Label>Spotify 1m ?</Label>
                        <Input
                          value={this.state.entrySpotify1m}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="entrySpotify3mRekap" style={{ marginBottom: 15 }}>
                        <Label>Spotify 3m ?</Label>
                        <Input
                          value={this.state.entrySpotify3m}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="fotoPop1Rekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                        <Text> FOTO POP 1</Text>
                      </View>
                      <View id="entryPop1Rekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                        <Input
                          value={this.state.entryPop1}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      {
                        this.state.idRetailer === 1 && <>
                          <View id="fotoPOP2Rekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                            <Text> FOTO POP 2</Text>
                          </View>
                          <View id="entryPop2Rekap" style={{ marginBottom: 15 }}>
                            <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                            <Input
                              value={this.state.entryPop2}
                              style={{ backgroundColor: '#F0F0F0' }}
                              disabled />
                          </View>
                        </>
                      }

                      <View id="knowledgeRekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                        <Text> Knowledge</Text>
                      </View>

                      <View id="assistNameRekap" style={{ marginBottom: 15 }}>
                        <Label>Siapa nama asisten toko ?</Label>
                        <Input
                          value={this.state.assistName}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="giftCardRekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah staf tahu cara mengaktifkan kartu hadiah ?</Label>
                        <Input
                          value={this.state.giftCard}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="aktifPORRekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah staf tahu cara mengaktifkan POR ?</Label>
                        <Input
                          value={this.state.aktifPOR}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="changeCardGiftRekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah staf tahu bagaimana menangani keluhan pelanggan tentang penukaran kartu hadiah ?</Label>
                        <Input
                          value={this.state.changeCardGift}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                    </>


                    <>

                      <View id="fotoRekap" style={{ marginBottom: 15 }}>
                        <Label>Image Exit Fixture</Label>
                        <Input
                          value="BELUM"
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>
                      <View id="exitFixCompRekap" style={{ marginBottom: 15 }}>

                        <Label>Apakah itu cocok dengan apa yang ada di aplikasi?</Label>
                        <Input
                          value={this.state.exitFixComp}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="fotoFixTraitRekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                        <Text> FOTO FIXTURE TRAITS</Text>
                      </View>
                      <View id="exitPEGCompRekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah jumlah PEG sudah benar ?</Label>
                        <Input
                          value={this.state.exitPegComp}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="fotoPOGRekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                        <Text> FOTO POG</Text>
                      </View>
                      <View id="exitPOGCompRekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah POG Terpasang dengan benar ?</Label>
                        <Input
                          value={this.state.exitPogComp}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="exitGoogle50kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 50k?</Label>
                        <Input
                          value={this.state.exitGoogle50k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="exitGoogle100kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 100k?</Label>
                        <Input
                          value={this.state.exitGoogle100k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="exitGoogle150kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 150k?</Label>
                        <Input
                          value={this.state.exitGoogle150k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="exitGoogle300kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 300k?</Label>
                        <Input
                          value={this.state.exitGoogle300k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="exitGoogle500kRekap" style={{ marginBottom: 15 }}>
                        <Label>Google 500k?</Label>
                        <Input
                          value={this.state.exitGoogle500k}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="exitSpotify1mRekap" style={{ marginBottom: 15 }}>
                        <Label>Spotify 1m ?</Label>
                        <Input
                          value={this.state.exitSpotify1m}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="exitSpotify3mRekap" style={{ marginBottom: 15 }}>
                        <Label>Spotify 3m ?</Label>
                        <Input
                          value={this.state.exitSpotify3m}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      <View id="fotoPop1Rekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                        <Text> FOTO POP 1</Text>
                      </View>
                      <View id="exitPop1Rekap" style={{ marginBottom: 15 }}>
                        <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                        <Input
                          value={this.state.exitPop1}
                          style={{ backgroundColor: '#F0F0F0' }}
                          disabled />
                      </View>

                      {
                        this.state.idRetailer === 1 && <>
                          <View id="fotoPOP2Rekap" style={{ height: 100, width: '100%', backgroundColor: '' }}>
                            <Text> FOTO POP 2</Text>
                          </View>
                          <View id="exitPop2Rekap" style={{ marginBottom: 15 }}>
                            <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                            <Input
                              value={this.state.exitPop2}
                              style={{ backgroundColor: '#F0F0F0' }}
                              disabled />
                          </View>
                        </>
                      }

                    </>
                  </Form>
                </ScrollView>
              </ProgressStep>

            </ProgressSteps>
          </View>
        </View >

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

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30
  },
})

const mapStateToProps = ({ user_id }) => {
  return {
    user_id
  }
}
export default connect(mapStateToProps)(addVisit)