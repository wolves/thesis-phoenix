import 'whatwg-fetch' // Polyfill for fetch

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}

/*
  Usage:

    Net.post('/thesis/something', {my: "body"})
      .then((response) => { console.log(response) })
      .catch((error) => { console.log(error) })
*/
const Net = {
  get: (path, body) => Net.request(path, body, 'GET'),
  post: (path, body) => Net.request(path, body, 'POST'),
  put: (path, body) => Net.request(path, body, 'PUT'),
  patch: (path, body) => Net.request(path, body, 'PATCH'),
  delete: (path, body) => Net.request(path, body, 'DELETE'),
  request: (path, body, method) => {
    return fetch(path, {
      method: method,
      credentials: 'same-origin',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(body)
    })
      .then(checkStatus)
      .then(parseJSON)
  }
}

export default Net
