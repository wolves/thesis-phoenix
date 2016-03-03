import React, { PropTypes } from 'react'

class SettingsButton extends React.Component {
  render() {
    return (
      <div className="thesis-button settings"><div className="tooltip">Page Settings</div><i className="fa fa-wrench fa-2x"></i></div>
    )
  }
}

SettingsButton.propTypes = {

}

export default SettingsButton

