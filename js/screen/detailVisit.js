import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableHighlight, Image, ActivityIndicator, Toast } from 'react-native';
import { Label, Input } from 'native-base';

import { API, BaseURL } from '../../config/API';


export default class detailVisit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataNotification: [],
      data: {},
      errorImgStore: false,
      errorImgFixIn: false,
      errorImgFixOut: false
    };
  }

  async componentDidMount() {
    this.setState({
      data: this.props.route.params.data,
      loading: true
    })

    await this.fetchNotif()
    this.setState({
      loading: false
    })
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

  logout = async () => {

    await AsyncStorage.clear()
    this.props.navigation.navigate("Login")

    this.setState({
      proses: false
    })
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

        {
          this.state.data && this.state.data.tbl_store &&
          <ScrollView style={{ backgroundColor: 'white', marginTop: 15 }}>
            <View style={{ backgroundColor: '#afbd20', height: 60, justifyContent: 'center', paddingLeft: 15 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                Detail Visit
                </Text>
            </View>

            <View style={{ padding: 15 }}>
              <>
                <View id="idRetailerRekap" style={{ marginBottom: 15 }}>
                  <Label>Retailer</Label>
                  <Input
                    value={this.state.data.tbl_store.tbl_retailer.initial}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="idStoreRekap" style={{ marginBottom: 15 }}>
                  <Label>Store</Label>
                  <Input
                    value={this.state.data.tbl_store.store_code}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
                <View id="nameStoreRekap" style={{ marginBottom: 15 }}>
                  <Label>Store Name</Label>
                  <Input
                    value={this.state.data.tbl_store.store_name}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
                <View id="dcRekap" style={{ marginBottom: 15 }}>
                  <Label>DC/Wilayah Store</Label>
                  <Input
                    value={this.state.data.tbl_store.tbl_dc.DC_name}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
                <View id="cityRekap" style={{ marginBottom: 15 }}>
                  <Label>City</Label>
                  <Input
                    value={this.state.data.tbl_store.city}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
                <View id="addressRekap" style={{ marginBottom: 15 }}>
                  <Label>Address</Label>
                  <Input
                    value={this.state.data.tbl_store.address}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
                <View id="fotoTokoRekap1" style={{ marginBottom: 15 }}>
                  <Label>Image Store</Label>
                  {
                    this.state.data.img_store
                      ? this.state.errorImgStore
                        ? <Image source={require('../asset/image-not-found.png')} style={{
                          width: '100%', height: 250,
                          resizeMode: 'cover'
                        }} />
                        : <Image source={{ uri: `${BaseURL}/${this.state.data.img_store}` }} style={{
                          width: '100%', height: 250,
                          resizeMode: 'cover'
                        }} onError={() => this.setState({ errorImgStore: true })} />
                      : <Image source={require('../asset/placeholder.png')} style={{
                        width: '100%', height: 250,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>
              </>



              <>
                <View id="fotoFixInRekap" style={{ marginBottom: 15 }}>
                  <Label>Image Entry Fixture</Label>
                  {
                    this.state.data.img_fixture_in
                      ? this.state.errorImgFixIn
                        ? <Image source={require('../asset/image-not-found.png')} style={{
                          width: '100%', height: 250,
                          resizeMode: 'cover'
                        }} />
                        : <Image source={{ uri: `${BaseURL}/${this.state.data.img_fixture_in}` }} style={{
                          width: '100%', height: 250,
                          resizeMode: 'cover'
                        }} onError={() => this.setState({ errorImgFixIn: true })} />
                      : <Image source={require('../asset/placeholder-take-image.png')} style={{
                        width: '100%', height: 250,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>
                <View id="entryFixCompRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah itu cocok dengan apa yang ada di aplikasi?</Label>
                  <Input
                    value={this.state.data.entry_fixture_comp ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
                <View id="fotoFixTraitRekap" style={{ marginBottom: 15 }}>
                  <Label>Foto Fixture Traits</Label>
                  {
                    this.state.imgFixture1
                      ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.fixtureType1.fixture_traits}` }} style={{
                        width: '100%', height: 400,
                        resizeMode: 'cover'
                      }} />
                      : <Image source={require('../asset/placeholder.png')} style={{
                        width: '100%', height: 300,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>

                <View id="entryPEGCompRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah jumlah PEG sudah benar ?</Label>
                  <Input
                    value={this.state.data.entry_peg_comp ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="fotoPOGRekap1" style={{ marginBottom: 15 }}>
                  <Label>Foto POG</Label>
                  {
                    this.state.imgPOG1
                      ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.fixtureType1.POG}` }} style={{
                        width: '100%', height: 400,
                        resizeMode: 'cover'
                      }} />
                      : <Image source={require('../asset/placeholder.png')} style={{
                        width: '100%', height: 300,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>
                <View id="entryPOGCompRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah POG Terpasang dengan benar ?</Label>
                  <Input
                    value={this.state.data.entry_pog_comp ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="instockComp" style={{ height: 50, width: '100%', backgroundColor: '#afbd20', justifyContent: 'center', paddingLeft: 10, marginBottom: 10, marginTop: 5 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>In-stock Compliance</Text>
                </View>

                <View id="entryGoogle50kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 50k?</Label>
                  <Input
                    value={this.state.data.entry_google50k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="entryGoogle100kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 100k?</Label>
                  <Input
                    value={this.state.data.entry_google100k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="entryGoogle150kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 150k?</Label>
                  <Input
                    value={this.state.data.entry_google150k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="entryGoogle300kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 300k?</Label>
                  <Input
                    value={this.state.data.entry_google300k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="entryGoogle500kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 500k?</Label>
                  <Input
                    value={this.state.data.entry_google500k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="entrySpotify1mRekap" style={{ marginBottom: 15 }}>
                  <Label>Spotify 1m ?</Label>
                  <Input
                    value={this.state.data.entry_spotify1M ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="entrySpotify3mRekap" style={{ marginBottom: 15 }}>
                  <Label>Spotify 3m ?</Label>
                  <Input
                    value={this.state.data.entry_spotify3M ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>


                <View id="fotoPop1Rekap1" style={{ marginBottom: 15 }}>
                  {
                    this.state.data.tbl_store.retailer_id === 1
                      ? <Label>Foto Promotion 1</Label>
                      : <Label>Foto Promotion</Label>
                  }
                  {
                    this.state.data.tbl_store.tbl_retailer.promotion_1
                      ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.tbl_retailer.promotion_1}` }} style={{
                        width: '100%', height: 400,
                        resizeMode: 'cover'
                      }} />
                      : <Image source={require('../asset/placeholder.png')} style={{
                        width: '100%', height: 300,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>
                <View id="entryPop1Rekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                  <Input
                    value={this.state.data.entry_pop_pic_1 ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                {
                  this.state.data.tbl_store.retailer_id === 1 && <>
                    <View id="fotoPOP2Rekap2" style={{ marginBottom: 15 }}>
                      <Label>Foto Promotion 2</Label>
                      {
                        this.state.data.tbl_store.tbl_retailer.promotion_2
                          ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.tbl_retailer.promotion_2}` }} style={{
                            width: '100%', height: 400,
                            resizeMode: 'cover'
                          }} />
                          : <Image source={require('../asset/placeholder.png')} style={{
                            width: '100%', height: 300,
                            resizeMode: 'cover'
                          }} />
                      }
                    </View>
                    <View id="entryPop2Rekap" style={{ marginBottom: 15 }}>
                      <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                      <Input
                        value={this.state.data.entry_pop_pic_2 ? "Iya" : "Tidak"}
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                  </>
                }

                <View id="knowledgeRekap" style={{ height: 50, width: '100%', backgroundColor: '#afbd20', justifyContent: 'center', paddingLeft: 10 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Knowledge</Text>
                </View>

                <View id="assistNameRekap" style={{ marginBottom: 15 }}>
                  <Label>Siapa nama asisten toko ?</Label>
                  <Input
                    value={this.state.data.assistants_name}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="giftCardRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah staf tahu cara mengaktifkan kartu hadiah ?</Label>
                  <Input
                    value={this.state.data.q1 ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="aktifPORRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah staf tahu cara mengaktifkan POR ?</Label>
                  <Input
                    value={this.state.data.q2 ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="changeCardGiftRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah staf tahu bagaimana menangani keluhan pelanggan tentang penukaran kartu hadiah ?</Label>
                  <Input
                    value={this.state.data.q3 ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
              </>


              <>
                <View id="fotoFixOutRekap" style={{ marginBottom: 15 }}>
                  <Label>Image Exit Fixture</Label>
                  {
                    this.state.data.img_fixture_out
                      ? this.state.errorImgFixOut
                        ? <Image source={require('../asset/image-not-found.png')} style={{
                          width: '100%', height: 250,
                          resizeMode: 'cover'
                        }} />
                        : <Image source={{ uri: `${BaseURL}/${this.state.data.img_fixture_out}` }} style={{
                          width: '100%', height: 250,
                          resizeMode: 'cover'
                        }} onError={() => this.setState({ errorImgFixOut: true })} />
                      : <Image source={require('../asset/placeholder-take-image.png')} style={{
                        width: '100%', height: 250,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>
                <View id="exitFixCompRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah itu cocok dengan apa yang ada di aplikasi?</Label>
                  <Input
                    value={this.state.data.exit_fixture_comp ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>
                <View id="fotoFixTraitRekap" style={{ marginBottom: 15 }}>
                  <Label>Foto Fixture Traits</Label>
                  {
                    this.state.imgFixture1
                      ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.fixtureType1.fixture_traits}` }} style={{
                        width: '100%', height: 400,
                        resizeMode: 'cover'
                      }} />
                      : <Image source={require('../asset/placeholder.png')} style={{
                        width: '100%', height: 300,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>

                <View id="exitPEGCompRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah jumlah PEG sudah benar ?</Label>
                  <Input
                    value={this.state.data.exit_peg_comp ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="fotoPOGRekap1" style={{ marginBottom: 15 }}>
                  <Label>Foto POG</Label>
                  {
                    this.state.imgPOG1
                      ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.fixtureType1.POG}` }} style={{
                        width: '100%', height: 400,
                        resizeMode: 'cover'
                      }} />
                      : <Image source={require('../asset/placeholder.png')} style={{
                        width: '100%', height: 300,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>
                <View id="exitPOGCompRekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah POG Terpasang dengan benar ?</Label>
                  <Input
                    value={this.state.data.exit_pog_comp ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="instockComp" style={{ height: 50, width: '100%', backgroundColor: '#afbd20', justifyContent: 'center', paddingLeft: 10, marginBottom: 10, marginTop: 5 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>In-stock Compliance</Text>
                </View>

                <View style={{ marginBottom: 15 }}>
                  <Text>Jika kartu lebih dari 15 maka pilih Iya,</Text>
                  <Text>jika kartu kurang dari 15 maka pilih Tidak</Text>
                </View>

                <View id="exitGoogle50kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 50k?</Label>
                  <Input
                    value={this.state.data.exit_google50k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="exitGoogle100kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 100k?</Label>
                  <Input
                    value={this.state.data.exit_google100k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="exitGoogle150kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 150k?</Label>
                  <Input
                    value={this.state.data.exit_google150k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="exitGoogle300kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 300k?</Label>
                  <Input
                    value={this.state.data.exit_google300k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="exitGoogle500kRekap" style={{ marginBottom: 15 }}>
                  <Label>Google 500k?</Label>
                  <Input
                    value={this.state.data.exit_google500k ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="exitSpotify1mRekap" style={{ marginBottom: 15 }}>
                  <Label>Spotify 1m ?</Label>
                  <Input
                    value={this.state.data.exit_spotify1M ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                <View id="exitSpotify3mRekap" style={{ marginBottom: 15 }}>
                  <Label>Spotify 3m ?</Label>
                  <Input
                    value={this.state.data.exit_spotify3M ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>


                <View id="fotoPop1Rekap1" style={{ marginBottom: 15 }}>
                  {
                    this.state.data.tbl_store.retailer_id === 1
                      ? <Label>Foto Promotion 1</Label>
                      : <Label>Foto Promotion</Label>
                  }
                  {
                    this.state.data.tbl_store.tbl_retailer.promotion_1
                      ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.tbl_retailer.promotion_1}` }} style={{
                        width: '100%', height: 400,
                        resizeMode: 'cover'
                      }} />
                      : <Image source={require('../asset/placeholder.png')} style={{
                        width: '100%', height: 300,
                        resizeMode: 'cover'
                      }} />
                  }
                </View>
                <View id="exitPop1Rekap" style={{ marginBottom: 15 }}>
                  <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                  <Input
                    value={this.state.data.exit_pop_pic_1 ? "Iya" : "Tidak"}
                    style={{ backgroundColor: '#F0F0F0' }}
                    disabled />
                </View>

                {
                  this.state.data.tbl_store.retailer_id === 1 && <>
                    <View id="fotoPOP2Rekap2" style={{ marginBottom: 15 }}>
                      <Label>Foto Promotion 2</Label>
                      {
                        this.state.data.tbl_store.tbl_retailer.promotion_2
                          ? <Image source={{ uri: `${BaseURL}/${this.state.data.tbl_store.tbl_retailer.promotion_2}` }} style={{
                            width: '100%', height: 400,
                            resizeMode: 'cover'
                          }} />
                          : <Image source={require('../asset/placeholder.png')} style={{
                            width: '100%', height: 300,
                            resizeMode: 'cover'
                          }} />
                      }
                    </View>
                    <View id="exitPop2Rekap" style={{ marginBottom: 15 }}>
                      <Label>Apakah (Grafik fixture teratas) cocok dengan gambar ini ?</Label>
                      <Input
                        value={this.state.data.exit_pop_pic_2 ? "Iya" : "Tidak"}
                        style={{ backgroundColor: '#F0F0F0' }}
                        disabled />
                    </View>
                  </>
                }

              </>
            </View>
          </ScrollView>

        }
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