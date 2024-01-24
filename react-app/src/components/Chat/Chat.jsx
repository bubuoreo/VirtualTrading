import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import MessageBox from './containers/MessageBox.jsx'
import UserDropdown from './containers/UserDropdown.jsx'

const ChatComponent = ({ socket, users, nickname, messageArray }) => {
  let user = useSelector(state => state.userReducer.user);
  console.log(user.id);
  console.log(messageArray);

  const message = useRef();
  const broadcastSelection = { "id": -1, "nickname": "Everyone", "surName": "" }
  const usersWithBroadcast = [broadcastSelection, ...users];
  const [selectedUserId, setselectedUserId] = useState(null);

  const handleUserSelect = (user) => {
    setselectedUserId(user.id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    var data = { "name": nickname, "emit": user.id, "dest": `${selectedUserId}`, "msg": message.current.value }
    console.log(data);
    socket.emit('chat message', JSON.stringify(data));
  };

  return (
    <div>
      <div className="ui segment">
        <div className="ui top attached label">
          <div className="ui two column grid">
            <div className="column">Chat</div>
            <div className="column">
              <div className="ui two column grid">
                <div className="column">{nickname}</div>
                <div className="column"> <i className="user circle icon"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserDropdown users={usersWithBroadcast} onSelectUser={handleUserSelect} />
      <div className="ui segment">
        {messageArray.map((msg) => (
          <MessageBox userId={user.id} data={msg} />
        ))}
      </div>
      <div className="ui form">
        <div className="field">
          <textarea ref={message} rows="2"></textarea>
        </div>
      </div>
      <button onClick={handleSendMessage} className="fluid ui right labeled icon button">
        <i className="right arrow icon"></i>
        Send
      </button>
    </div>
  );
};

export default ChatComponent;