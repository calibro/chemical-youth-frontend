import React from 'react';
import { withRouter } from 'react-router-dom';

const Landing = ({ history }) => {
  const goToHome = () => {
    history.push(`/chemical`);
  };

  return (
    <div className='landing-container'>
      <div className='landing-upper-container'>
        <div className='landing-upper-background' />
        <div className='landing-upper-content'>
          <div className='landing-logo-container'>
            <img src='images/logo-white.svg' width='300px' />
          </div>
          <div className='landing-text-container'>
            <div className='w-50'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur
              suscipit illum rem numquam possimus minima! Exercitationem in
              consectetur nisi illo distinctio quas commodi. Ipsum, sint
              quaerat. Autem ipsa eius nulla. Lorem ipsum dolor sit amet
              consectetur, adipisicing elit. Tenetur suscipit illum rem numquam
              possimus minima! Exercitationem in consectetur nisi illo
              distinctio quas commodi. Ipsum, sint quaerat. Autem ipsa eius
              nulla.
            </div>
            <div className='w-50'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur
              suscipit illum rem numquam possimus minima! Exercitationem in
              consectetur nisi illo distinctio quas commodi. Ipsum, sint
              quaerat. Autem ipsa eius nulla. Lorem ipsum dolor sit amet
              consectetur, adipisicing elit. Tenetur suscipit illum rem numquam
              possimus minima! Exercitationem in consectetur nisi illo
              distinctio quas commodi. Ipsum, sint quaerat. Autem ipsa eius
              nulla.
            </div>
          </div>
        </div>
      </div>
      <div className='landing-lower'>
        <div
          className='landing-lower-link rainbow-line'
          onClick={() => goToHome()}
        >
          Explore the project
          <span>
            <img src='images/arrow-right.svg' width='20px' />
          </span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Landing);
