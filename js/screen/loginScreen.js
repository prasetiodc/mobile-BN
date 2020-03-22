import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Image, View, Dimensions, ScrollView, ActivityIndicator, Linking, BackHandler, } from 'react-native';
import { Item, Input, Text, Label } from 'native-base';
import { API } from '../../config/API';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { setDataUser } from '../store/action';
// import { withNavigationFocus } from 'react-navigation';

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      proses: false,
      editableInput: true,
      seePassword: false
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('backPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('backPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.props.isFocused === true && this.props.navigation.state.routeName === 'Login') {
      BackHandler.exitApp()
    }
  }

  login = async () => {
    this.setState({
      proses: true,
      editableInput: false
    })
    let user, data

    user = {
      email: this.state.email,
      password: this.state.password
    }

    try {
      data = await API.post('/user/signin', user)
      if (data) {
        this.setState({
          proses: false,
          editableInput: true,
          email: '',
          password: ''
        })
        alert("Sukses")

        // let dataUser = {
        //   user_id: data.data.user_id,
        //   token: data.data.token,
        // }
        // await this.props.setDataUser(dataUser)

        // AsyncStorage.multiSet([['token', data.data.token], ['user_id', String(data.data.user_id)]], () => {
        //   if (data.data.status === 0) {
        //     // this.props.navigation.navigate("FirstLogin")
        //   } else {
        //     // this.props.navigation.navigate("Home")
        //   }
        // })

      }
    } catch (err) {
      alert("email/password salah. Silahkan coba lagi.")
      this.setState({
        proses: false,
        editableInput: true
      })
    }
  }

  seePassword = () => {
    this.setState({
      seePassword: !this.state.seePassword
    })
  }

  render() {
    return (
      <ScrollView style={{ height: '100%' }} >
        <View style={styles.container}>
          <View style={styles.content}>

            {/* LOGO POLAGROUP */}
            <View style={styles.logo}>
              <Image source={require('../asset/logo.png')} style={{
                height: 70,
                width: 300,
                resizeMode: 'stretch'
              }} />
              <Text style={{ marginTop: 30, fontSize: 20, color: '#F0F0F0' }}>Selamat Datang</Text>

            </View>

            {/* FORM LOGIN */}
            <View style={styles.center} >
              <Item style={{ marginBottom: 25 }}>
                <Input id='email'
                  type='text'
                  placeholder='Email'
                  // placeholderTextColor={defaultTextColor}
                  value={this.state.email}
                  onChangeText={(text) => this.setState({
                    email: text
                  })}
                  editable={this.state.editableInput} />
              </Item>
              <Item style={{ marginBottom: 45 }}>
                <Input id='password'
                  placeholder='Password'
                  secureTextEntry={!this.state.seePassword}
                  value={this.state.password}
                  onChangeText={(text) => this.setState({
                    password: text
                  })}
                  editable={this.state.editableInput} />
                <TouchableHighlight onPress={this.seePassword}
                  underlayColor="transparent">
                  {
                    this.state.seePassword
                      ? <MaterialCommunityIcons name='eye-off-outline' style={styles.icon} size={30} />
                      : <MaterialCommunityIcons name='eye-outline' style={styles.icon} size={30} />
                  }
                </TouchableHighlight>

              </Item>
              <TouchableHighlight onPress={this.login}
                style={styles.button} underlayColor="transparent">
                {
                  this.state.proses
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={styles.textLogin}>Login</Text>
                }
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </ScrollView>
    )
  }
}

login.navigationOptions = {
  header: null
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '80%',
    marginTop: 50,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    padding: 15,
    borderWidth: 2,
    marginBottom: 30,
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#0079C2',
  },
  buttonPress: {
    padding: 15,
    borderWidth: 2,
    backgroundColor: 'red',
    marginBottom: 30,
    width: '100%'
  },
  center: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  textLogin: {
    color: 'white',
    textAlign: 'center',
  },
  icon: {
    marginRight: 5
  }
});

const mapDispatchToProps = {
  setDataUser
}

export default connect(null, mapDispatchToProps)(login)
// export default connect(null, mapDispatchToProps)(withNavigationFocus(login))
