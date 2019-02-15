import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../appContext';

const Header = () => {
  const context = useContext(AppContext);

  function changeSection(section) {
    context.setSection(section);
  }

  return (
    <div
      className='w-100 d-flex align-items-center justify-content-around'
      style={{
        height: '80px',
        backgroundColor: 'blue'
      }}
    >
      <div onClick={() => changeSection('chemical')}>
        <Link to={'/chemical'}> CHEMICAL </Link>
      </div>
      <div onClick={() => changeSection('topic')}>
        <Link to={'/topic'}> TOPIC </Link>
      </div>
      <div onClick={() => changeSection('location')}>
        <Link to={'/location'}> LOCATION </Link>
      </div>
      <div onClick={() => changeSection('researcher')}>
        <Link to={'/researcher'}> RESEARCHER </Link>
      </div>
      <div onClick={() => changeSection('time')}>
        <Link to={'/time'}> TIME </Link>
      </div>
      <div onClick={() => changeSection('method')}>
        <Link to={'/method'}> METHOD </Link>
      </div>
    </div>
  );
};

export default Header;
