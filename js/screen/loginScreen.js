import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Image, View, Dimensions, ScrollView, ActivityIndicator, BackHandler } from 'react-native';
import { Item, Input, Text, Button, Toast } from 'native-base';
import { API } from '../../config/API';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { setDataUser } from '../store/action';
import { useIsFocused } from '@react-navigation/native';

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      proses: false,
      editableInput: true,
      seePassword: false,
      showToast: false
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('backPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('backPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.props.isFocused === true) {
      BackHandler.exitApp()
    }
  }

  login = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
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

            let dataUser = {
              user_id: data.data.user_id,
              name: data.data.name,
              role_id: data.data.role_id
            }
            await this.props.setDataUser(dataUser)

            await AsyncStorage.setItem('token_bhn_md', data.data.token)
            this.props.navigation.navigate("Dashboard")
          }
        } catch (err) {
          if (err.message === 'Network Error') {
            Toast.show({
              text: "Unknown error",
              buttonText: "Okay",
              duration: 3000,
              type: "danger"
            })
          } else {
            Toast.show({
              text: "Email/password salah. Silahkan coba lagi.",
              buttonText: "Okay",
              duration: 3000,
              type: "danger"
            })
          }
          this.setState({
            proses: false,
            editableInput: true
          })
        }
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

  seePassword = () => {
    this.setState({
      seePassword: !this.state.seePassword
    })
  }

  render() {
    const { isFocused } = this.props

    return (
      <ScrollView style={{ height: '100%' }} >
        <View style={styles.container}>
          <View style={styles.content}>

            {/* LOGO */}
            <View style={styles.logo}>
              <Image source={require('../asset/logo.png')} style={{
                height: 70,
                width: 300,
                resizeMode: 'stretch'
              }} />
              <Text style={{ marginTop: 30, fontSize: 20, color: 'gray' }}>Selamat Datang</Text>

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
                      ? <Image source={require('../asset/see-pass.png')} style={{
                        height: 20,
                        width: 35,
                        resizeMode: 'stretch'
                      }} />
                      : <Image source={require('../asset/hide-pass.png')} style={{
                        height: 20,
                        width: 35,
                        resizeMode: 'stretch'
                      }} />
                  }
                </TouchableHighlight>

              </Item>
              <Button style={styles.button} onPress={this.login} >
                {
                  this.state.proses
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={styles.textLogin}>Login</Text>
                }
              </Button>
            </View>

            {/* Version Code */}
            <View style={styles.center}>
              <Text style={{ fontSize: 12, marginTop: 5 }} >Version 1.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

LoginScreen.navigationOptions = {
  header: null
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height - 25,
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '80%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    justifyContent: 'center',
    padding: 15,
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

function Login(props) {
  const isFocused = useIsFocused();

  return <LoginScreen {...props} isFocused={isFocused} />;
}

export default connect(null, mapDispatchToProps)(Login)
// export default connect(null, mapDispatchToProps)(useIsFocused(login))
