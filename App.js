/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';
import React from 'react'
import { Provider } from 'react-redux'
import store from './js/store'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root } from "native-base";

import SplashScreen from './js/screen/splashScreen';
import LoginScreen from './js/screen/loginScreen';
import DashboardScreen from './js/screen/dashboardScreen';
import AddVisitScreen from './js/screen/addVisit';
import DetailVisitScreen from './js/screen/detailVisit';
import ListPendingVisitScreen from './js/screen/listPendingVisit';

import {
  StyleSheet,
} from 'react-native';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Splash" component={SplashScreen}
        options={{
          header: null
        }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="DetailVisit" component={DetailVisitScreen} />
      <Stack.Screen name="ListPendingVisit" component={ListPendingVisitScreen} />
      <Stack.Screen name="AddVisit" component={AddVisitScreen} />
    </Stack.Navigator>
  );
}

const App: () => React$Node = () => {
  return <Provider store={store}>
    <Root>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </Root>
  </Provider>
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
