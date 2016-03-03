import React from 'react'
import ReactDOM from 'react-dom'
import AddButton from './components/add_button'
import DeleteButton from './components/delete_button'
import SettingsButton from './components/settings_button'
import CancelButton from './components/cancel_button'
import SaveButton from './components/save_button'
import EditButton from './components/edit_button'

class Editor extends React.Component {
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

  renderBodyClass () {
    let el = document.querySelector('body')
    if(this.state.editing) {
      el.classList.add('thesis-editing');
    } else {
      el.classList.remove('thesis-editing');
    }
  }

  componentDidUpdate () {
    this.renderBodyClass()
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

ReactDOM.render(<Editor />, document.querySelector('#thesis-editor-container'))
