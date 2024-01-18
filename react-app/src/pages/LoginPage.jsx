import React, { useEffect } from 'react';
import FormLogin from '../components/Form/FormLogin'
const LoginPage = ({handleSocketDisconnect}) => {

  useEffect(() => {
    handleSocketDisconnect();
  }, []);

  return (
    <div>
      <FormLogin />
    </div>

  );
};

export default LoginPage;