import React from 'react'

class TrayNotifications extends React.Component {
  constructor (props) {
    super(props)
  }

  renderNotifications () {
    if (!this.props.notifications) return
    return this.props.notifications.map(n => <div className='thesis-tray-notification'><i className='fa fa-exclamation-triangle fa-2x' />{n}</div>)
  }

  render () {
    return (
      <div className='thesis-tray-notifications'>
        <div className='thesis-tray-notifications-wrap'>
          {this.renderNotifications()}
        </div>
      </div>
    )
  }
}

export default TrayNotifications
