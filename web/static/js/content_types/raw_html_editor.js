import React from 'react'
import RawHtmlTray from './raw_html_tray'

class RawHtmlEditor {
  constructor (editors, callback) {
    this.callback = callback
    this.editors = editors
    this.clicked = this.clicked.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.enabled = false
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

  content (ed) {
    return ed.innerHTML
  }

  clicked (e) {
    const id = e.currentTarget.getAttribute('data-thesis-content-id')
    const content = e.currentTarget.innerHTML.trim()

    this.callback({contentId: id, content: content})
  }

  onSubmit (data) {
    const editor = document.querySelector(`[data-thesis-content-id="${data.contentId}"`)
    editor.classList.add('modified')
    editor.innerHTML = data.content

    this.callback(false)
  }

  tray (data) {
    return <RawHtmlTray
      data={data}
      onCancel={this.thesis.trayCanceled}
      onSubmit={this.onSubmit} />
  }

}

export default RawHtmlEditor
