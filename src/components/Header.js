import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div
      className='w-100 d-flex align-items-center justify-content-around'
      style={{
        height: '80px',
        backgroundColor: 'blue'
      }}
    >
      <div>
        <Link to={'/chemical'}> CHEMICAL </Link>
      </div>
      <div>
        <Link to={'/topic'}> TOPIC </Link>
      </div>
      <div>
        <Link to={'/location'}> LOCATION </Link>
      </div>
      <div>
        <Link to={'/researcher'}> RESEARCHER </Link>
      </div>
      <div>
        <Link to={'/time'}> TIME </Link>
      </div>
      <div>
        <Link to={'/method'}> METHOD </Link>
      </div>
    </div>
  );
};

export default Header;
