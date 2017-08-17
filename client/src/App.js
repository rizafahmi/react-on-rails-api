import React, { Component } from 'react'
import './App.css'
import Cable from 'actioncable'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentChatMessage: '',
      chatLogs: []
    }
  }
  getData () {
    let chatLogs = this.state.chatLogs
    fetch(`http://localhost:3001/api/v1/chats`)
      .then(response => response.json())
      .then(chats => {
        this.setState({
          chatLogs: chats
        })
      })
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
          let chatLogs = this.state.chatLogs
          chatLogs.push(data)
          this.setState({
            chatLogs
          })
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
  componentDidMount () {
    this.getData()
  }
  handleChatInputKyePress (e) {
    if (e.key === 'Enter') {
      this.handleSendEvent(e)
    }
  }
  render () {
    return (
      <div className='App'>
        <div className='stage'>
          <h1>Chatter</h1>
          <div className='chat-logs'>
            <ul className='chat-logs'>
              {this.renderChatLog()}
            </ul>
          </div>
          <input
            type='text'
            placeholder='Enter your message...'
            onChange={e => this.updateCurrentChatMessage(e.target.value)}
            className='chat-input'
            value={this.state.currentChatMessage}
            onKeyPress={e => this.handleChatInputKyePress(e)}
          />
          <button onClick={e => this.handleSendEvent(e)} className='send'>
            Send
          </button>
        </div>
      </div>
    )
  }
  renderChatLog () {
    return this.state.chatLogs.map(el => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{el.content}</span>
          <span className='chat-created-at'>{el.created_at}</span>
        </li>
      )
    })
  }
}

export default App
