class RawHtmlEditor {
  constructor (thesis) {
    this.thesis = thesis
    this.editors = document.querySelectorAll('.thesis-content-raw_html')
    this.clicked = this.clicked.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  enable () {
    for (let i = 0; i < this.editors.length; i++) {
      this.addOverlay(this.editors[i])
      this.editors[i].addEventListener('click', this.clicked, false)
    }
  }

  disable () {
    for (let i = 0; i < this.editors.length; i++) {
      this.removeOverlay(this.editors[i])
      this.editors[i].removeEventListener('click', this.clicked, false)
    }
  }

  clicked (e) {
    this.removeOverlay(e.currentTarget)

    const id = e.currentTarget.getAttribute('data-thesis-content-id')
    const content = e.currentTarget.innerHTML

    // TODO: Not very happy about how this reaches back into the Thesis editor
    // to set its state. Refactor in the future.
    this.thesis.setState({
      pageModified: true,
      trayOpen: true,
      trayType: 'raw-html',
      trayData: { contentId: id, content: content }
    })
  }

  onSubmit (data) {
    const editor = document.querySelector(`[data-thesis-content-id="${data.contentId}"`)
    editor.classList.add('modified')
    editor.innerHTML = data.content
    this.addOverlay(editor)


    // TODO: Not very happy about how this reaches back into the Thesis editor
    // to set its state. Refactor in the future.
    this.thesis.setState({trayOpen: false, pageModified: true})
  }

  addOverlay (editor) {
    // editor.addChild("<span class='thesis-content-overlay'></span>")
  }

  removeOverlay (editor) {
    // const overlay = editor.querySelector("span.thesis-content-overlay")
    // editor.removeChild(overlay)
  }

}

export default RawHtmlEditor
