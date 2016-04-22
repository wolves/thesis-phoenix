import React, { PropTypes } from 'react'

class AddButton extends React.Component {
  render () {
    return (
    <div onClick={this.props.onPress} className="thesis-button add">
      <div className="tooltip">
        Add New Page
      </div><i className="fa fa-plus fa-2x"></i>
    </div>
    )
  }
}

AddButton.propTypes = {

}

export default AddButton
