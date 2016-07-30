import React from 'react'
import ThesisEditor from './thesis-editor'

import RawHtmlEditor from './content_types/raw_html_editor'
import HtmlEditor from './content_types/html_editor'

import Net from './utilities/net'

class Thesis {
  constructor (data) {
    this.container = data.container
    this.rawHtmlEditor = new RawHtmlEditor(data.rawHtmlEditors, this.rawHtmlEditorSubmit)
    this.htmlEditor = new HtmlEditor(data.htmlEditors, this.htmlEditorSubmit)
    this.imageEditor = new ImageEditor(data.imageEditors, , this.imageEditorSubmit)
    // this.rawHtmlEditor = new RawHtmlEditor(data.rawHtmlEditors, this.rawHtmlEditorSubmit)

    this.thesis = ReactDOM.render(this.renderEditor(), this.container)
  }

  rawHtmlEditorSubmit (data) {
    if (data === false) {
      this.thesis.setState({trayOpen: false, pageModified: true})
    } else {
      this.thesis.setState({
        pageModified: true,
        trayOpen: true,
        trayType: 'raw-html',
        trayData: { contentId: data.contentId, content: data.content }
      })
    }
  }

  htmlEditorSubmit (data) {
    if (data === false) {
      this.thesis.setState({pageModified: false})
    } else {
      this.thesis.setState({pageModified: true})
    }
  }

  imageEditorSubmit (data) {
    if (data === false) {
      // this.thesis.setState({pageModified: false})
    } else {
      this.thesis.setState({
        pageModified: true,
        trayOpen: true,
        trayType: 'image-url',
        trayData: data
      })
    }
  }

  renderEditor () {
    return (
      <ThesisEditor
        rawHtmlEditor={this.rawHtmlEditor}
      />
  }
}

const thesis = new Thesis({
  container:        document.querySelector('#thesis-container'),
  rawHtmlEditors:   document.querySelectorAll('.thesis-content-raw_html'),
  htmlEditors:      document.querySelectorAll('.thesis-content-html'),
  imageEditors:     document.querySelectorAll('.thesis-content-image, .thesis-content-background_image')
})
