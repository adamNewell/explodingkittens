import React from 'react';
import { Form, Col } from 'react-bootstrap';
import './Chat.scss';

function padNumber(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

class Chat extends React.Component {
  state = { chatMsg: '', scrollTop: 0, lastMsgScrollTop: 0, showForceScroll: false };
  constructor(props) {
    super(props);
    this.logRef = React.createRef()
  }

  componentDidMount() {
    this.updateForcedScroll();
  }

  componentDidUpdate(prevProps, prevState) {
    const { log: currLog, currentPlayerID } = this.props;
    // If the chat log was added to.
    if (prevProps.log.length !== currLog.length) {
      const updatedState = { scrollTop: this.logRef.current.scrollTop };

      // If the current user was the last one to add to the chat, force scroll
      if (currLog[currLog.length - 1].playerID === currentPlayerID) {
        this.updateForcedScroll();
      } else {
        // If the user has scrolled away from the bottom then we show a message; otherwise we force a scroll update
        if (prevState.scrollTop >= this.state.lastMsgScrollTop) {
          this.updateForcedScroll();
        } else {
          updatedState.showForceScroll = true;
        }
      }

      this.setState(updatedState);
    }
  }

  updateForcedScroll = () => {
    const scrollingDiv = this.logRef.current;
    scrollingDiv.scrollTop = scrollingDiv.scrollHeight;
    this.setState({ showForceScroll: false, lastMsgScrollTop: scrollingDiv.scrollTop });
  }

  handleScroll = (e) => {
    // If the user manually scrolls to the bottom while the force scroll button is showing, hide it
    const updatedState = { scrollTop: e.target.scrollTop };
    if (e.target.scrollTop >= (e.target.scrollHeight - e.target.offsetHeight) && this.state.showForceScroll) {
      updatedState.showForceScroll = false;
    }
    this.setState(updatedState);
  }

  handleForcedButtonScroll = () => {
    const scrollingDiv = this.logRef.current;
    scrollingDiv.scrollTop = scrollingDiv.scrollHeight;

    this.setState({
      showForceScroll: false,
      lastMsgScrollTop: scrollingDiv.scrollTop,
      scrollTop: scrollingDiv.scrollTop,
    });
  }

  updateChatMessage = (e) => {
    this.setState({ chatMsg: e.target.value });
  }

  onChatSubmitted = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onChatSubmitted(this.state.chatMsg);
    if (this.state.chatMsg !== '') {
      this.setState({ chatMsg: '' });
    }
  }

  render() {
    const { log, players, currentPlayerID, className } = this.props;
    const { showForceScroll, chatMsg } = this.state;
    return (
      <div className={`chat ${className}`}>
        <div className="chat-log" ref={this.logRef} onScroll={this.handleScroll}>
          {log.map(c => {
            // Code setup to allow spectators to chat, but spectators don't have moves and can't add to G, so... eh
            const player = players[c.playerID];
            const date = new Date(c.time);
            const timeString = `${padNumber(date.getHours(), 2)}:${padNumber(date.getMinutes(), 2)}`
            return (
              <div className={`chat-message _${c.playerID}`} key={date.getTime()}>
                <span className="time">{timeString} </span>
                <span className="author">{player ? player.name : 'spectator'}: </span>
                <span className="message">{c.msg}</span>
              </div>
            )
          })}
        </div>
        {showForceScroll && (
          <div
            className="forceScroll"
            onClick={this.handleForcedButtonScroll}
          >
            Read New Message!
          </div>)}
        {currentPlayerID && (
          <div className="chat-input">
            <Form onSubmit={this.onChatSubmitted}>
              <Form.Group as={Form.Row} controlId="chatForm.message">
                <Form.Label column sm={2}>Chat: </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    placeholder="Message"
                    type="text"
                    onChange={this.updateChatMessage}
                    value={chatMsg}
                  />
                </Col>
              </Form.Group>
            </Form>
          </div>
        )}
      </div>
    )
  }
}
Chat.defaultProps = {
  className: '',
};

export default Chat;