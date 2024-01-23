import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

const UserDropdown = ({ users, onSelectUser }) => {
  const handleUserChange = (event, data) => {
    const selectedUser = users.find(user => user.id === data.value);
    onSelectUser(selectedUser);
  };

  console.log({users});
  const userOptions = users.map(user => ({
    key: user.id,
    value: user.id,
    text: `${user.nickname}`
  }));

  return (
    <Dropdown
      placeholder="Select User"
      fluid
      selection
      options={userOptions}
      onChange={handleUserChange}
    />
  );
};

export default UserDropdown;