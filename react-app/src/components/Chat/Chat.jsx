import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import MessageBox from './containers/MessageBox.jsx'
import UserDropdown from './containers/UserDropdown.jsx'

const ChatComponent = ({socket, users}) => {
  let user = useSelector(state => state.userReducer.user);
  console.log(user.id);

  const message = useRef();
  const broadcastSelection = {"id":-1,"lastName":"Everyone","surName":""}
  const [springbootUsers, setSpringbootUsers] = useState([broadcastSelection]);
  const [messageArray, setMessageArray] = useState([]);
  const [selectedUserId, setselectedUserId] =useState(null);

  const handleUserSelect = (user) => {
    setselectedUserId(user.id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    var data = { "name": user.login, "emit": user.id, "dest": `${selectedUserId}`, "msg": message.current.value }
    console.log(data);
    socket.emit('chat message', JSON.stringify(data));
  };

  const setSocketsListeners = (socket) => {
    socket.on('chat message', function (data) {
      console.log("message reçu");
      setMessageArray(oldArray => [...oldArray, JSON.parse(data)]);
    });

    socket.on('updateSpringbootUsers', (data) => {
      console.log([broadcastSelection, ...(JSON.parse(data))]);
      setSpringbootUsers([broadcastSelection, ...(JSON.parse(data))]);
    });
  }

  return (
    <div>
      <div className="ui segment">
        <div className="ui top attached label">
          <div className="ui two column grid">
            <div className="column">Chat</div>
            <div className="column">
              <div className="ui two column grid">
                <div className="column">{user.nickname}</div>
                <div className="column"> <i className="user circle icon"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserDropdown users={users} onSelectUser={handleUserSelect}/>
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