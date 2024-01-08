import React from 'react';
import { FaShoppingCart, FaDollarSign, FaPlay } from 'react-icons/fa'; // Install react-icons if not already
import { useNavigate } from 'react-router-dom';

const icons = {
  buy: FaShoppingCart,
  sell: FaDollarSign,
  selection: FaPlay,
  play: FaPlay
};

const ActionButton = ({ action, label }) => {
  const IconComponent = icons[action];

  const navigate = useNavigate();

  const handleAction = () => {
    // Directly navigate to the home page without credentials check
    navigate('/'+action);}

  return (
    <button onClick={handleAction} className="px-4 py-4 border rounded shadow m-auto justify-center">
      {IconComponent ? <IconComponent size={30} /> : null}
      {label}
    </button>
  );
};

export default ActionButton;

