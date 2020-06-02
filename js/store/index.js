import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'

const api = store => next => async action => {
    next(action)
}

const store = createStore(reducer, applyMiddleware(api))

export default store
