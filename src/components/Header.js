import React, { useContext } from 'react';
import { AppContext } from '../appContext';
import { withRouter } from 'react-router-dom';

const Header = ({ history }) => {
  const context = useContext(AppContext);

  function changeSection(section) {
    history.push(`/${section}`);
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
        <div
          className='text-light'
          style={{
            textDecoration:
              context.section === 'chemical' ? 'underline' : 'none'
          }}
        >
          CHEMICAL
        </div>
      </div>
      <div onClick={() => changeSection('topic')}>
        <div
          className='text-light'
          style={{
            textDecoration: context.section === 'topic' ? 'underline' : 'none'
          }}
        >
          TOPIC
        </div>
      </div>
      <div onClick={() => changeSection('location')}>
        <div
          className='text-light'
          style={{
            textDecoration:
              context.section === 'location' ? 'underline' : 'none'
          }}
        >
          LOCATION
        </div>
      </div>
      <div onClick={() => changeSection('researcher')}>
        <div
          className='text-light'
          style={{
            textDecoration:
              context.section === 'researcher' ? 'underline' : 'none'
          }}
        >
          RESEARCHER
        </div>
      </div>
      <div onClick={() => changeSection('time')}>
        <div
          className='text-light'
          style={{
            textDecoration: context.section === 'time' ? 'underline' : 'none'
          }}
        >
          TIME
        </div>
      </div>
      <div onClick={() => changeSection('method')}>
        <div
          className='text-light'
          style={{
            textDecoration: context.section === 'method' ? 'underline' : 'none'
          }}
        >
          METHOD
        </div>
      </div>
    </div>
  );
};

export default withRouter(Header);
