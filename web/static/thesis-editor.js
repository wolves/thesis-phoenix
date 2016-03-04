import React from 'react'
import ReactDOM from 'react-dom'
import AddButton from './components/add_button'
import DeleteButton from './components/delete_button'
import SettingsButton from './components/settings_button'
import CancelButton from './components/cancel_button'
import SaveButton from './components/save_button'
import EditButton from './components/edit_button'
import PageContentEditor from './components/page_content_editor'

class ThesisEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
  }

  editPressed () {
    this.setState({editing: !this.state.editing})
  }

  renderEditorClass () {
    return this.state.editing ? "active" : ""
  }

  contentEditors() {
    return document.querySelectorAll('.thesis-content-html')
  }

  addContentEditors() {
    Array.prototype.forEach.call(this.contentEditors(), (editor, i) => {
      const onChangeHandler = (editorState) => {
        const content = editorState.getCurrentContent()
        const text = content.getPlainText()
        editor.updatedContent = text
      }
      const contentEditor = <PageContentEditor
        defaultContent={ editor.innerHTML }
        onChange={onChangeHandler}
      />
      ReactDOM.render(contentEditor, editor)
    })
  }

  removeContentEditors() {
    Array.prototype.forEach.call(this.contentEditors(), (editor, i) => {
      console.log(editor.updatedContent)
      // ReactDOM.unmountComponentAtNode(editor)
    })
  }

  componentDidUpdate () {
    let el = document.querySelector('body')
    if(this.state.editing) {
      el.classList.add('thesis-editing')
      this.addContentEditors()
    } else {
      el.classList.remove('thesis-editing')
      this.removeContentEditors()
    }
  }

  render () {
    return (
      <div id="thesis-editor" className={this.renderEditorClass()}>
        <AddButton />
        <DeleteButton />
        <SettingsButton />
        <CancelButton />
        <SaveButton />
        <EditButton onPress={this.editPressed.bind(this)} />
      </div>
    )
  }
}

ReactDOM.render(<ThesisEditor />, document.querySelector('#thesis-editor-container'))
