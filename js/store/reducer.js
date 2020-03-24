const defaultState = {
  user_id: null,
  name: '',
  role_id: null
}

function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_DATA_LOADING': {
      return {
        ...state,
        loading: true
      }
    }
    case 'SET_DATA_USER': {
      return {
        ...state,
        user_id: action.payload.user_id,
        name: action.payload.name,
        role_id: action.payload.role_id,
      }
    }
    case 'FETCH_DATA_ERROR': {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    }
    default:
      return state
  }

}

export default reducer