import React, { Component } from 'react'
import { Text, View, Image } from 'react-native';

import { BaseURL } from '../../config/API';

export default class cardVisit extends Component {
  state = {
    error: false
  }

  render() {
    function getFormatDate(args) {
      let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

      return `${new Date(args).getDate()} ${months[new Date(args).getMonth()]} ${new Date(args).getFullYear()}`
    }

    return (
      <>
        {
          this.props.data.img_store
            ? this.state.error
              ? <Image source={require('../asset/image-not-found.png')} style={{
                width: '100%', height: 400,
              }}/>
              : <Image source={{ uri: `${BaseURL}/${this.props.data.img_store}` }} style={{ width: '100%', height: 400 }} onError={() => this.setState({ error: true })} />
            : <Image source={require('../asset/placeholder.png')} style={{
              width: '100%', height: 400,
            }} />
        }
        <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{
            fontSize: 20
          }}>{this.props.data.tbl_store.store_name} ({this.props.data.tbl_store.store_code})</Text>
          <Text style={{ fontSize: 15, color: 'gray' }}>Dikunjungi tanggal {getFormatDate(this.props.data.visit_date)}</Text>
        </View>
      </>
    )
  }
}
