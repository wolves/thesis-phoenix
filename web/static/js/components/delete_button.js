import React from 'react'

class DeleteButton extends React.Component {
  render () {
    return (
      <div onClick={this.props.onPress} className='thesis-button delete'>
        <div className='tooltip'>
          Delete This Page
        </div><i className='fa fa-trash fa-2x' />
      </div>
    )
  }
}

export default DeleteButton
