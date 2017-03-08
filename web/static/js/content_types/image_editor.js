import React from 'react'
import ImageTray from './image_tray'

class ImageEditor {
  constructor (opts) {
    this.editors = document.querySelectorAll('.thesis-content-image, .thesis-content-background_image')
    this.enabled = false

    this.ospryPublicKey = opts.ospryPublicKey
    this.fileUploader = opts.fileUploader
    this.openTray = opts.openTray
    this.closeTray = opts.closeTray

    this.clicked = this.clicked.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  enable () {
    if (this.enabled) return
    for (let i = 0; i < this.editors.length; i++) {
      this.editors[i].addEventListener('click', this.clicked, false)
    }
    this.enabled = true
  }

  disable () {
    if (!this.enabled) return
    for (let i = 0; i < this.editors.length; i++) {
      this.editors[i].removeEventListener('click', this.clicked, false)
    }
    this.enabled = false
  }

  clicked (e) {
    const id = e.currentTarget.getAttribute('data-thesis-content-id')
    const type = e.currentTarget.getAttribute('data-thesis-content-type')
    const meta = JSON.parse(e.currentTarget.getAttribute('data-thesis-content-meta'))
    let url = ''

    if (type === 'image') {
      url = e.currentTarget.querySelector('img').getAttribute('src')
    } else if (type === 'background_image') {
      url = this.getUrlFromStyle(e.currentTarget.style.backgroundImage)
    }

    this.openTray({ contentId: id, url: url, alt: meta.alt })
  }

  tray (trayData) {
    return <ImageTray
      data={trayData}
      ospryPublicKey={this.ospryPublicKey}
      fileUploader={this.fileUploader}
      onCancel={this.closeTray}
      onSubmit={this.onSubmit} />
  }

  onSubmit (data) {
    const editor = document.querySelector(`[data-thesis-content-id="${data.contentId}"`)
    editor.classList.add('modified')

    const meta = JSON.stringify({alt: data.alt})
    editor.setAttribute('data-thesis-content-meta', meta)

    const type = editor.getAttribute('data-thesis-content-type')
    if (type === 'image') {
      const img = editor.querySelector('img')
      img.src = data.url
      img.alt = data.alt
    } else if (type === 'background_image') {
      editor.style.backgroundImage = `url("${data.url}")`
    }

    this.closeTray()
  }

  getContent (ed) {
    const type = ed.getAttribute('data-thesis-content-type')
    if (type === 'image') {
      return ed.querySelector('img').getAttribute('src')
    } else {
      return this.getUrlFromStyle(ed.style.backgroundImage)
    }
  }

  getUrlFromStyle (style) {
    return style.replace(/\'/g, '').replace(/"/g, '').replace('url(', '').replace(')', '')
  }

}

export default ImageEditor
