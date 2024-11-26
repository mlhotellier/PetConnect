import React from 'react';

const User = ({user}) => { 
  return (
    <div className='section w-100'>
        <p className='userid'>Hello {user ? user.email : 'test'} !</p>
    </div>
  );
};

export default User;
