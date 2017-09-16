import 'unfetch/polyfill' // Polyfill for fetch

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

  Notes:
    If using FormData, avoid setting Content-Type headers as it does it for you.
*/
const Net = {
  get: (path, body = null, type = 'json') => Net.request(path, body, 'GET', type),
  post: (path, body, type = 'json') => Net.request(path, body, 'POST', type),
  put: (path, body, type = 'json') => Net.request(path, body, 'PUT', type),
  patch: (path, body, type = 'json') => Net.request(path, body, 'PATCH', type),
  delete: (path, body, type = 'json') => Net.request(path, body, 'DELETE', type),
  request: (path, body, method, type) => {
    // headers
    let headers = new Headers()
    if (type === 'json') headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')

    // body
    if (type === 'json') body = JSON.stringify(body)
    if (type === 'form') body = new FormData(body)

    return window.fetch(path, {
      method: method,
      credentials: 'same-origin',
      headers: headers,
      body: body
    })
      .then(checkStatus)
      .then(parseJSON)
  }
}

export default Net
