import React, { PropTypes } from 'react'

class SaveButton extends React.Component {
  render() {
    return (
      <div onClick={this.props.onPress} className="thesis-button save"><div className="tooltip">Save Changes</div><i className="fa fa-save fa-2x"></i></div>
    )
  }
}

SaveButton.propTypes = {

}

export default SaveButton

