import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import AsyncStorage from '@react-native-community/async-storage';
import { API } from '../../config/API';

const api = store => next => async action => {
  // let token = await AsyncStorage.getItem('token_bhn_md')
    next(action)
  // }
}

const store = createStore(reducer, applyMiddleware(api))

export default store
