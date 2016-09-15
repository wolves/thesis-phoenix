import ReactDOM from 'react-dom'
import ThesisEditor from './components/thesis-editor'
import Net from './utilities/net'

const thesis = (container) => {
  // Check for a redirect URL and display an alert if so, allowing
  // the user to follow the redirect or not. Note that this is only
  // displayed if the editor is active, so normal visitors won't see it.
  var url = container.getAttribute('data-redirect-url')
  if (url && window.confirm(`This page is set to redirect to ${url}. Follow redirect?`)) {
    window.location = url
  }

  // All the "unholy" external access routes through this object.
  // (Well, *almost* all...)
  const descriptionMetaTag = document.querySelectorAll('meta[name=description]')[0]
  const external = {
    ospryPublicKey: container.getAttribute('data-ospry-public-key'),
    pageRedirectURL: container.getAttribute('data-redirect-url'),
    template: container.getAttribute('data-template'),
    templates: container.getAttribute('data-templates').split(',').filter((s) => s !== ''),
    dynamicPage: container.getAttribute('data-dynamic-page'),
    path: window.location.pathname,
    getTitle: () => document.title,
    setTitle: (t) => document.title = t,
    getDescription: () => descriptionMetaTag && descriptionMetaTag.content,
    setDescription: (desc) => descriptionMetaTag && (descriptionMetaTag.content = desc),
    getRedirectURL: () => container.getAttribute('data-redirect-url'),
    setRedirectURL: (url) => container.setAttribute('data-redirect-url', url),
    save: (callback) => {
      Net.put('/thesis/update', {page, contents}).then((resp) => {
        if (page.slug !== window.location.pathname) {
          window.location = page.slug
        } else {
          callback()
        }
      }).catch((err) => {
        window.alert(err)
      })
    },
    delete: (page, callback) => {
      Net.delete('/thesis/delete', {path}).then((resp) => {
        window.alert('Page has been deleted.')
        callback()
      }).catch((err) => {
        window.alert(err)
      })
    }
  }

  return ReactDOM.render(<ThesisEditor external={external}>, container)
}

window.thesis = thesis
