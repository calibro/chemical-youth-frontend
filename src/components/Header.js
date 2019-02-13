import React from 'react';

const Header = () => {
  return (
    <div
      className='w-100 d-flex align-items-center justify-content-around'
      style={{
        height: '80px',
        backgroundColor: 'blue'
      }}
    >
      <div>CHEMICAL</div>
      <div>TOPIC</div>
      <div>LOCATION</div>
      <div>RESEARCHER</div>
      <div>TIME</div>
      <div>METHOD</div>
    </div>
  );
};

export default Header;
