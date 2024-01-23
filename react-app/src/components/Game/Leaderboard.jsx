import React from 'react';

const Leaderboard = ({ marketPrice, users }) => {
  // Calculate the total value for each user (wallet + marketPrice * assetQuantity)
  const calculateTotalValue = (user) => {
    return user.wallet + marketPrice * user.assetQuantity;
  };

  // Sort users based on total value in descending order
  const sortedUsers = users.sort((a, b) => calculateTotalValue(b) - calculateTotalValue(a));

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.nickname}</td>
              <td>{calculateTotalValue(user).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
