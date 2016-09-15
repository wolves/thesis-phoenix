import React from 'react'
import ReactDOM from 'react-dom'
import ThesisEditor from './components/thesis-editor'
import external from './external'

const thesis = (container) => {
  // Check for a redirect URL and display an alert if so, allowing
  // the user to follow the redirect or not. Note that this is only
  // displayed if the editor is active, so normal visitors won't see it.
  var url = container.getAttribute('data-redirect-url')
  if (url && window.confirm(`This page is set to redirect to ${url}. Follow redirect?`)) {
    window.location = url
  }

  const ext = external(container)

  return ReactDOM.render(<ThesisEditor external={ext} />, container)
}

console.log("Attaching thesis to windows")

window.thesis = thesis

export default thesis
