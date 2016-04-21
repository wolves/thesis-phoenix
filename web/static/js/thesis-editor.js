import React from 'react'
import ReactDOM from 'react-dom'
import AddButton from './components/add_button'
import DeleteButton from './components/delete_button'
import SettingsButton from './components/settings_button'
import CancelButton from './components/cancel_button'
import SaveButton from './components/save_button'
import EditButton from './components/edit_button'
import AttributionText from './components/attribution_text'
import MediumEditor from 'medium-editor'
import Net from './utilities/net'

// https://github.com/yabwe/medium-editor#toolbar-options
const mediumEditorOptions = {
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
  }
}

class ThesisEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      editing: false,
      pageModified: false,
      pageToolsHidden: true
    }
    this.editor = null

    // Rebind context
    this.cancelPressed = this.cancelPressed.bind(this)
    this.savePressed = this.savePressed.bind(this)
    this.editPressed = this.editPressed.bind(this)
  }

  editPressed () {
    let body = document.querySelector('body')

    if (this.state.editing) {
      if (this.state.pageModified) {
        this.cancelPressed()
      } else {
        this.setState({editing: false, pageModified: false})
        setTimeout(() => {
          this.setState({pageToolsHidden: true})}, 800)
      }
    } else {
      this.setState({editing: true, pageToolsHidden: false })
    }
  }

  savePressed () {
    const page = {slug: window.location.pathname}
    const contents = this.contentEditorContents()
    this.postToServer(page, contents)
    this.setState({editing: false, pageModified: false})
    setTimeout(() => {
      this.setState({pageToolsHidden: true})}, 800)
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

  textContentEditors () {
    return document.querySelectorAll('.thesis-content-text')
  }

  htmlContentEditors () {
    return document.querySelectorAll('.thesis-content-html')
  }

  allContentEditors () {
    return document.querySelectorAll('.thesis-content')
  }

  subscribeToContentChanges () {
    // html editor
    if (this.htmlContentEditors().length > 0) {
      this.editor.subscribe('editableInput', (event, editable) => {
        editable.classList.add('modified')
        this.setState({pageModified: true})
      })
    }

    // TODO: image editor

    // text editor
    const textEditors = this.textContentEditors()
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].addEventListener('input', (e) => {
        e.target.classList.add('modified')
        this.setState({pageModified: true})
      }, false)
    }
  }

  addContentEditors () {
    if (!this.editor) {
      this.editor = new MediumEditor(this.htmlContentEditors(), mediumEditorOptions)
    } else {
      this.editor.setup() // Rebuild it
    }
    this.toggleTextEditors(true)
    this.subscribeToContentChanges()
  }

  removeContentEditors () {
    if (!this.editor) { return null }
    this.editor.destroy()
    this.editor = null
    this.toggleTextEditors(false)
  }

  toggleTextEditors (editable) {
    const textEditors = this.textContentEditors()
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].contentEditable = editable
    }
  }

  contentEditorContents () {
    let contents = []

    const editors = this.allContentEditors()
    for (let i = 0; i < editors.length; i++) {
      const ed = editors[i]
      const id = ed.getAttribute('data-thesis-content-id')
      const t = ed.getAttribute('data-thesis-content-type')
      const content = ed.innerHTML
      contents.push({name: id, content_type: t, content: content})
    }

    return contents
  }

  componentDidUpdate () {
    const el = document.querySelector('body')
    const editors = this.allContentEditors()

    if (this.state.editing) {
      el.classList.add('thesis-editing')
      if (!this.editor) this.addContentEditors()
    } else {
      el.classList.remove('thesis-editing')
      this.removeContentEditors()
    }

    if (this.state.pageModified) {
      el.classList.add('thesis-page-modified')
    } else {
      el.classList.remove('thesis-page-modified')
      for (let i = 0; i < editors.length; i++) {
        editors[i].classList.remove('modified')
      }
    }
  }

  renderEditorClass () {
    let classes = ''
    classes += (this.state.editing) ? ' active ' : ''
    classes += (this.state.pageToolsHidden) ? ' thesis-page-tools-hidden ' : ''
    return classes
  }

  renderEditButtonText () {
    return this.state.editing ? 'Editing Page' : 'Edit Page'
  }

  renderFaderClass () {
    return this.renderEditorClass()
  }

  render () {
    return (
    <div id="thesis">
      <div id='thesis-editor' className={this.renderEditorClass()}>
        <SaveButton onPress={this.savePressed} />
        <SettingsButton />
        <CancelButton onPress={this.cancelPressed} />
        {this.state.pageToolsHidden ? <AddButton /> : null}
        {this.state.pageToolsHidden ? <DeleteButton /> : null}
        <EditButton onPress={this.editPressed} text={this.renderEditButtonText()} />
      </div>
      <div id='thesis-fader' className={this.renderFaderClass()}></div>
      <div id='thesis-tray'>
      </div>
    </div>
    )
  }
}

ReactDOM.render(<ThesisEditor />, document.querySelector('#thesis-container'))
