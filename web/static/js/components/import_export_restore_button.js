import React from 'react'

class ImportExportRestoreButton extends React.Component {
  render () {
    return (
      <div onClick={this.props.onPress} className='thesis-button import-export'>
        <div className='tooltip'>
          Import/Export Content
        </div><i className='fa fa-exchange fa-2x' />
      </div>
    )
  }
}

export default ImportExportRestoreButton
