import React, { Component } from 'react'
import './App.css'
import Cable from 'actioncable'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentChatMessage: ''
    }
  }
  updateCurrentChatMessage (message) {
    this.setState({
      currentChatMessage: message
    })
  }
  createSocket () {
    let cable = Cable.createConsumer('ws://localhost:3001/cable')
    this.chats = cable.subscriptions.create(
      {
        channel: 'ChatChannel'
      },
      {
        connected: () => {},
        received: data => {
          console.log(data)
        },
        create: chatContent => {
          this.chats.perform('create', {
            content: chatContent
          })
        }
      }
    )
  }
  handleSendEvent (e) {
    e.preventDefault()
    this.chats.create(this.state.currentChatMessage)
    this.setState({
      currentChatMessage: ''
    })
  }
  componentWillMount () {
    this.createSocket()
  }
  render () {
    return (
      <div className='App'>
        <div className='stage'>
          <h1>Chatter</h1>
          <div className='chat-logs' />
          <input
            type='text'
            placeholder='Enter your message...'
            onChange={e => this.updateCurrentChatMessage(e.target.value)}
            className='chat-input'
            value={this.state.currentChatMessage}
          />
          <button onClick={e => this.handleSendEvent(e)} className='send'>
            Send
          </button>
        </div>
      </div>
    )
  }
}

export default App
