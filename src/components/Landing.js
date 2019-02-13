import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      <div> Landing </div>
      <Link to={'/home'}>Landing</Link>
    </div>
  );
};

export default Landing;
