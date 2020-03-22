/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react'
import { Provider } from 'react-redux'
import store from './js/store'

import SplashScreen from './js/screen/splashScreen';
import LoginScreen from './js/screen/loginScreen';
import DashboardScreen from './js/screen/dashboardScreen';
import AddVisitScreen from './js/screen/addVisit';

import {
  StyleSheet,
} from 'react-native';

const App: () => React$Node = () => {
  // const Router = createAppContainer(StackNav)
  return <Provider store={store}><AddVisitScreen /></Provider>
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default App;
