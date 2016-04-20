import React, { PropTypes } from 'react'

class EditButton extends React.Component {
  render () {
    return (
    <div onClick={this.props.onPress} className="thesis-button edit">
      <div className="tooltip">
        {this.props.text}
      </div><i className="fa fa-edit fa-2x"></i>
    </div>
    )
  }
}

EditButton.propTypes = {

}

export default EditButton
