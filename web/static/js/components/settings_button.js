import React from 'react'

class SettingsButton extends React.Component {
  render () {
    return (
      <div onClick={this.props.onPress} className='thesis-button settings'>
        <div className='tooltip'>
          Page Settings
        </div><i className='fa fa-wrench fa-2x' />
      </div>
    )
  }
}

export default SettingsButton
