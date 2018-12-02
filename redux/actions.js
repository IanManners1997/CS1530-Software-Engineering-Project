import { 
  FETCHING_PITTITION, FETCHING_PITTITION_SUCCESS, FETCHING_PITTITION_FAILURE,
  ADDING_PITTITION, ADDING_PITTITION_SUCCESS, ADDING_PITTITION_FAILURE,
  LOGGING_IN, LOGGING_IN_SUCCESS, LOGGING_IN_FAILURE,
  LOGOUT,
  FETCHING_ACTIVE_PITTITION,
  ADDING_COMMENT, ADDING_COMMENT_SUCCESS, ADDING_COMMENT_FAILURE,
  UPDATING_PITTITION_STATUS, UPDATING_PITTITION_STATUS_SUCCESS, UPDATING_PITTITION_STATUS_FAILURE,
  FOLLOWING_PITTITION, FOLLOWING_PITTITION_SUCCESS, FOLLOWING_PITTITION_FAILURE,
  IP
} from '../utils/constants';


// Log in
export function login(userName, password) {
  console.log("IP IS " + IP + 'login/')
  return (dispatch) => {
    let request=new XMLHttpRequest();
    dispatch(loggingIn())
    return new Promise(function(resolve, reject) {
      request.open('POST', IP + 'login/', true);
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
       console.log("goingasd to make post: " + JSON.stringify(json))
      dispatch(loginSuccess(json))
    })
    .catch(err => {
       console.log("going tasdasdaso make post")
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
    dispatch(getPittition())
    fetch(IP + 'Pittition')
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


// TODO: add error/success message dispatches
export function deletePittitionFromAPI(pittitionId) {
  return (dispatch) => {
    dispatch(deletePittition())
    let request=new XMLHttpRequest();
    return new Promise(function(resolve, reject) {
      request.open('DELETE', IP + 'Pittition/' + pittitionId, true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.send()
    })
    .catch(err => { console.log(err); dispatch(deletePittitionFailure(err))})
  }
}

export function deletePittition() {
  return {
    type: "DELETING_PITTITION"
  }
}

export function deletePittitionFailure() {
  return {
    type: "DELETING_PITTITION_FAILURE"
  }
}

// Creatng a Pittition
export function addPittitionToAPI(pittition) {
  let request=new XMLHttpRequest();
  return (dispatch) => {
    dispatch(addPittition())
    return new Promise(function(resolve, reject) {
      request.open('POST', IP + 'Pittition/', true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.send(JSON.stringify({
          title: pittition.title,
          description: pittition.description,
          author: pittition.author,
          img_url: pittition.img_url,
          date: pittition.date,
          status: pittition.status
      }))
    })
  
    .then(json => {
      dispatch(addPittitionSuccess(json))
    })
    .catch(err => { console.log(err); dispatch(addPittitionFailure(err))})
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

// Updaring Pittition Status
export function updatePittitionStatusAPI(pittitionId, status, updates) {
  let request=new XMLHttpRequest();
  return (dispatch) => {
    dispatch(updatePittitionStatus())
    return new Promise(function(resolve, reject) {
      request.open('POST', IP + 'status/' + pittitionId, true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.send(JSON.stringify({
        status,
        updates
      }))
    })
  
    .catch(err => { console.log(err); dispatch(updatePittitionStatusFailure(err))})
  }
}

export function updatePittitionStatus() {
  return {
    type: UPDATING_PITTITION_STATUS
  }
}

export function updatePittitionStatusSuccess(data) {
  return {
    type: UPDATING_PITTITION_STATUS_SUCCESS,
    data,
  }
}

export function updatePittitionStatusFailure() {
  return {
    type: UPDATING_PITTITION_STATUS_FAILURE,
  }
}

// Following a Pittition
export function followPittitionAPI(pittitionId, followers) {
  let request=new XMLHttpRequest();
  return (dispatch) => {
    dispatch(followPittition())
    return new Promise(function(resolve, reject) {
      request.open('POST', IP + 'follow/' + pittitionId, true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.send(JSON.stringify({
          followers
      }))
    })
  
    .catch(err => { console.log(err); dispatch(followPittitionFailure(err))})
  }
}

export function followPittition() {
  return {
    type: FOLLOWING_PITTITION
  }
}

export function followPittitionSuccess(data) {
  return {
    type: FOLLOWING_PITTITION_SUCCESS,
    data,
  }
}

export function followPittitionFailure() {
  return {
    type: FOLLOWING_PITTITION_FAILURE,
  }
}



// Adding comments

export function addCommentToPittition(pittition, comment) {

  let request=new XMLHttpRequest();
  return (dispatch) => {

    dispatch(addComment())
    return new Promise(function(resolve, reject) {
      request.open('POST', IP + 'comment/' + pittition._id, true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.send(JSON.stringify({
          user: comment.user,
          img_url: comment.img_url,
          comment: comment.comment,
          userType: comment.userType,
          type: comment.type,
          date: comment.date,
          pittitionId: comment.pittitionId,
      }))
    })

    .catch(err => dispatch(addPittitionFailure(err)))
  }
}

export function addComment() {
  return {
    type: ADDING_COMMENT
  }
}

export function addCommentSuccess(data) {
  return {
    type: ADDING_COMMENT_SUCCESS,
    data,
  }
}

export function addCommentFailure() {
  return {
    type: ADDING_COMMENT_FAILURE
  }
}