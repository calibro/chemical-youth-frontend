import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100'>
      <div
        className='d-flex justify-content-center align-items-center w-100'
        style={{ height: '80%', backgroundColor: 'red' }}
      >
        <div>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur
          suscipit illum rem numquam possimus minima! Exercitationem in
          consectetur nisi illo distinctio quas commodi. Ipsum, sint quaerat.
          Autem ipsa eius nulla.
        </div>
      </div>
      <Link to={'/chemical'}> Landing </Link>
    </div>
  );
};

export default Landing;
