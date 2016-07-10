class RawHtmlEditor {
  constructor (thesis) {
    this.thesis = thesis
    this.editors = document.querySelectorAll('.thesis-content-raw_html')
    this.clicked = this.clicked.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  enable () {
    for (let i = 0; i < this.editors.length; i++) {
      this.editors[i].addEventListener('click', this.clicked, false)
    }
  }

  disable () {
    for (let i = 0; i < this.editors.length; i++) {
      this.editors[i].removeEventListener('click', this.clicked, false)
    }
  }

  clicked (e) {
    const id = e.currentTarget.getAttribute('data-thesis-content-id')
    const content = e.currentTarget.innerHTML.trim()

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

    // TODO: Not very happy about how this reaches back into the Thesis editor
    // to set its state. Refactor in the future.
    this.thesis.setState({trayOpen: false, pageModified: true})
  }

}

export default RawHtmlEditor
