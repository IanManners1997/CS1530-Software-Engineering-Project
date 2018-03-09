import { 
  FETCHING_PITTITION, FETCHING_PITTITION_SUCCESS, FETCHING_PITTITION_FAILURE,
  ADDING_PITTITION, ADDING_PITTITION_SUCCESS, ADDING_PITTITION_FAILURE,
  LOGGING_IN, LOGGING_IN_SUCCESS, LOGGING_IN_FAILURE,
  LOGOUT,
  FETCHING_ACTIVE_PITTITION,
} from '../utils/constants';


// Log in
export function login(userName, password) {

  return (dispatch) => {
    let request=new XMLHttpRequest();
    dispatch(loggingIn())
    return new Promise(function(resolve, reject) {
      request.open('POST', 'http://localhost:3000/login', true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.send(JSON.stringify({
         userName: userName,
         password: password
      }))

      request.onreadystatechange = () => {
        if (request.readyState === 4) {
           if(request.responseText === 'error') reject("Username or Password not correct");
           else                                 resolve(request.responseText);
        }
      };
      // console.log(request.responseText);
    })
    .then(json => {
      dispatch(loginSuccess(json))
    })
    .catch(err => {
      dispatch(loginFailure(err))
    })
  }
}
export function loggingIn() {
   return {
    type: LOGGING_IN,
  }
}

export function loginSuccess(data) {
  return {
    type: LOGGING_IN_SUCCESS,
    data,
  }
}

export function loginFailure() {
  return {
    type: LOGGING_IN_FAILURE,
  }
}

// log out
export function logout () {
  return {
    type: LOGGING_IN,
  }
}


export function getActivePittition(pittition) {
    return (dispatch) => {
      dispatch(getActivePittitionSuccess(pittition))
    }
}
export function getActivePittitionSuccess(data) {
  return {
    type: FETCHING_ACTIVE_PITTITION,
    data,
  }
}

// Retrieving Pittitions
export function fetchPittitionFromAPI() {
  return (dispatch) => {
    console.log("FETCHING");
    dispatch(getPittition())
    fetch('http://localhost:3000/getPittitions')
    .then(data => data.json())
    .then(json => {
      dispatch(getPittitionSuccess(json))
    })
    .catch(err => dispatch(getPittitionFailure(err)))
  }
}

export function getPittition() {
  return {
    type: FETCHING_PITTITION
  }
}

export function getPittitionSuccess(data) {
  return {
    type: FETCHING_PITTITION_SUCCESS,
    data,
  }
}

export function getPittitionFailure() {
  return {
    type: FETCHING_PITTITION_FAILURE
  }
}



// Creatng a Pittition
export function addPittitionToAPI(pittition) {
  let request=new XMLHttpRequest();
  return (dispatch) => {
    console.log("ADDING");
    dispatch(addPittition())
    return new Promise(function(resolve, reject) {
      request.open('POST', 'http://localhost:3000/createPittition', true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.send(JSON.stringify({
          title: pittition.title,
          description: pittition.description,
          author: pittition.author
      }))
    })
  
    .then(json => {
      dispatch(addPittitionSuccess(json))
    })
    .catch(err => dispatch(addPittitionFailure(err)))
  }
}
export function addPittition() {
  return {
    type: ADDING_PITTITION
  }
}

export function addPittitionSuccess(data) {
  return {
    type: ADDING_PITTITION_SUCCESS,
    data,
  }
}

export function addPittitionFailure() {
  return {
    type: ADDING_PITTITION_FAILURE
  }
}
