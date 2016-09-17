import Net from './utilities/net'

// All the "unholy" external access is through this object.
// (Well, *almost* all... still need to refactor the editors)
const external = (container) => {
  const descriptionMetaTag = document.querySelectorAll('meta[name=description]')[0]
  return {
    ospryPublicKey: container.getAttribute('data-ospry-public-key'),
    pageRedirectURL: container.getAttribute('data-redirect-url'),
    template: container.getAttribute('data-template'),
    templates: container.getAttribute('data-templates').split(',').filter((s) => s !== ''),
    isDynamicPage: container.getAttribute('data-dynamic-page'),
    path: window.location.pathname,
    getTitle: () => document.title,
    setTitle: (t) => document.title = t,
    getDescription: () => descriptionMetaTag && descriptionMetaTag.content,
    setDescription: (desc) => descriptionMetaTag && (descriptionMetaTag.content = desc),
    getRedirectURL: () => container.getAttribute('data-redirect-url'),
    setRedirectURL: (url) => container.setAttribute('data-redirect-url', url),
    save: (page, contents, callback) => {
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
    delete: (path, callback) => {
      Net.delete('/thesis/delete', {path}).then((resp) => {
        window.alert('Page has been deleted.')
        callback()
      }).catch((err) => {
        window.alert(err)
      })
    }
  }
}

export default external
