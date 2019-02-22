import { Spinner } from 'reactstrap';
import React from 'react';

const Loader = ({ fullheader = true }) => {
  return (
    <div className='d-flex justify-content-center align-items-center bg-white' style={{ position: 'absolute', top: fullheader ? '80px' : '40px', bottom: 0, left: 0, right: 0, zIndex: 999}}>
      <Spinner type="grow" color="dark" />
    </div>
  );
};

export default Loader;
