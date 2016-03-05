import 'whatwg-fetch' // Polyfill for fetch

const Net = {
  put: (path, body) => {
    return fetch(path, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }
}

export default Net
