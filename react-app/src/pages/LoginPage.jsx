import React  from 'react';
import FormLogin from '../components/Form/FormLogin'


const LoginPage = () => {


  return (
    <div className='home d-flex flex-fill align-items-center'>
    <div className='m-auto' data-testid='unlockPage'>
      <div className='card my-4 text-center'>
        <div className='card-body py-4 px-2 px-sm-2 mx-lg-4'>
          <h4 className='mb-4'>Login</h4>
          <FormLogin/>
        </div>
      </div>
    </div>
  </div>
);
};

export default LoginPage;