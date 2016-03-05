import React from 'react'
import ReactDOM from 'react-dom'
import AddButton from './components/add_button'
import DeleteButton from './components/delete_button'
import SettingsButton from './components/settings_button'
import CancelButton from './components/cancel_button'
import SaveButton from './components/save_button'
import EditButton from './components/edit_button'
import MediumEditor from 'medium-editor'
import Net from './utilities/net'

// https://github.com/yabwe/medium-editor#toolbar-options
const mediumEditorOptions = {
  autoLink: true,
  toolbar: {
    buttons: [
      'bold', 'italic', 'underline', 'anchor',
      'h1', 'h2', 'h3', 'h4', 'quote', 'pre',
      'orderedList', 'unorderedList', 'outdent', 'indent',
      'justifyLeft', 'justifyCenter', 'justifyRight',
      'removeFormat'
    ]
  }
}

class ThesisEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
    this.editor = null

    // Rebind context
    this.cancelPressed = this.cancelPressed.bind(this)
    this.savePressed = this.savePressed.bind(this)
    this.editPressed = this.editPressed.bind(this)
  }

  editPressed () {
    this.setState({editing: !this.state.editing})
  }

  savePressed () {
    const page = {slug: window.location.pathname}
    const contents = this.contentEditorContents()
    this.postToServer(page, contents)
    this.setState({editing: false})
  }

  cancelPressed () {
    if (window.confirm('Discard changes and reload the page?')) {
      this.setState({editing: false})
      window.location.reload()
    }
  }

  postToServer (page, contents) {
    Net.put('/thesis/update', {page, contents}).then((resp) => {
      console.log('SUCCESS')
      console.log(resp)
    }).catch((err) => {
      console.log('ERROR')
      console.log(err)
    })
  }

  contentEditors () {
    return document.querySelectorAll('.thesis-content-html')
  }

  addContentEditors () {
    if (!this.editor) {
      this.editor = new MediumEditor(this.contentEditors(), mediumEditorOptions)
    } else {
      this.editor.setup() // Rebuild it
    }
  }

  removeContentEditors () {
    if (!this.editor) { return null }

    this.editor.destroy()
  }

  contentEditorContents () {
    const editors = this.contentEditors()
    const editorContents = this.editor.serialize()
    let contents = []

    for (let i = 0; i < editors.length; i++) {
      const ed = editors[i]
      const id = ed.getAttribute('data-thesis-content-id')
      const t = ed.getAttribute('data-thesis-content-type')
      const index = ed.getAttribute('medium-editor-index')
      const content = editorContents[`element-${index}`]
      contents.push({name: id, content_type: t, content: content.value})
    }

    return contents
  }

  renderEditorClass () {
    return this.state.editing ? 'active' : ''
  }

  componentDidUpdate () {
    let el = document.querySelector('body')
    if (this.state.editing) {
      el.classList.add('thesis-editing')
      this.addContentEditors()
    } else {
      el.classList.remove('thesis-editing')
      this.removeContentEditors()
    }
  }

  render () {
    return (
      <div id='thesis-editor' className={this.renderEditorClass()}>
        <AddButton />
        <DeleteButton />
        <SettingsButton />
        <CancelButton onPress={this.cancelPressed} />
        <SaveButton onPress={this.savePressed} />
        <EditButton onPress={this.editPressed} />
      </div>
    )
  }
}

ReactDOM.render(<ThesisEditor />, document.querySelector('#thesis-editor-container'))
