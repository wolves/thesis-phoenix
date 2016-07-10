class HtmlEditor {
  constructor (thesis) {
    this.thesis = thesis
    this.editor = null
    this.editors = document.querySelectorAll('.thesis-content-html')
    this.clicked = this.clicked.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  enable () {
    // html editor
    if (!this.editor) {
      this.editor = new MediumEditor(this.editors, mediumEditorOptions)
    } else {
      this.editor.setup() // Rebuild it
    }
    this.editor.subscribe('editableInput', this.changedHtmlEditor)
  }

  disable () {
    if (!this.editor) { return null }
    this.editor.destroy()
    this.editor = null
  }

  changedHtmlEditor (event, editable) {
    editable.classList.add('modified')

    // TODO: Find a better way to represent that this has been modified
    this.thesis.setState({pageModified: true})
  }

  mediumEditorOptions () {
    // https://github.com/yabwe/medium-editor#toolbar-options
    return {
      autoLink: true,
      toolbar: {
        buttons: [
          'bold', 'italic', 'underline', 'anchor',
          'h1', 'h2', 'h3', 'quote',
          'orderedlist', 'unorderedlist',
          'removeFormat', 'justifyLeft', 'justifyCenter', 'justifyRight'
        ],
        static: true,
        align: 'center',
        sticky: true,
        updateOnEmptySelection: true
      },
      paste: {
        forcePlainText: false,
        cleanPastedHTML: true,
        cleanAttrs: ['class', 'style', 'dir'],
        cleanTags: ['meta', 'pre']
      }
    }
  }

}

export default RawHtmlEditor
