import React from 'react'
import ReactDOM from 'react-dom'
import AddButton from './components/add_button'
import DeleteButton from './components/delete_button'
import SettingsButton from './components/settings_button'
import CancelButton from './components/cancel_button'
import SaveButton from './components/save_button'
import EditButton from './components/edit_button'

class Editor extends React.Component {
  render() {
    return (
      <div>
        <AddButton />
        <DeleteButton />
        <SettingsButton />
        <CancelButton />
        <SaveButton />
        <EditButton />
      </div>
    )
  }
}

ReactDOM.render(<Editor />, document.querySelector('#thesis-editor'))
