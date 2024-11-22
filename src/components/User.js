import React from 'react';

const User = ({isLogged}) => { 
  console.log('User',isLogged)
  return (
    <div className='section w-100'>
        <p className='userid'>Hello user000001 !</p>
    </div>
  );
};

export default User;
