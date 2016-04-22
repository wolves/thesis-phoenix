import React, { PropTypes } from 'react'

// NOTES
// add 'invalid' class to input to give it a red background
// add error text to the errors div and toggle the 'hidden' property
// add the 'disabled' property to inputs that can't be editted if page is static

class SettingsTray extends React.Component {
  render () {
    return (
    <div className="tray-container">
      <div className="tray-wrap">
        <div className="tray-title">
          {this.props.title}
        </div>
        <div className="thesis-field-row">
          <label>
            <span>Page Path</span>
            <input type="text" placeholder="/example/page" />
          </label>
        </div>
        <div className="thesis-field-row">
          <label>
            <span>Page Title</span>
            <input type="text" placeholder="Example Title" />
          </label>
        </div>
        <div className="thesis-field-row">
          <label>
            <span>Page Description</span>
            <textarea placeholder="Example page description."></textarea>
          </label>
        </div>
        <div className="thesis-field-row errors" hidden>
          {/* Errors go here. Toggle the hidden property depending on error count. */}
        </div>
        <div className="thesis-field-row cta">
          <button className="thesis-tray-cancel">
            Cancel
          </button>
          <button className="thesis-tray-save">
            {this.props.cta}
          </button>
        </div>
      </div>
    </div>
    )
  }
}

SettingsTray.propTypes = {

}

export default SettingsTray
