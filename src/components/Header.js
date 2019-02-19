import React, { useContext, useEffect } from 'react';
import { AppContext } from '../appContext';
import { withRouter } from 'react-router-dom';

const Header = ({ history, expanded = true }) => {
  const context = useContext(AppContext);

  function changeSection(section) {
    context.setSection(section);
    context.setSelected({ type: section, value: null });
    history.push(`/${section}`);
  }

  return (
    <div
      className='w-100 d-flex align-items-center justify-content-around'
      style={{
        height: expanded ? '80px' : '40px',
        backgroundColor: 'blue'
      }}
    >
      {expanded && (
        <React.Fragment>
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
                textDecoration:
                  context.section === 'topic' ? 'underline' : 'none'
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
                textDecoration:
                  context.section === 'time' ? 'underline' : 'none'
              }}
            >
              TIME
            </div>
          </div>
          <div onClick={() => changeSection('method')}>
            <div
              className='text-light'
              style={{
                textDecoration:
                  context.section === 'method' ? 'underline' : 'none'
              }}
            >
              METHOD
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default withRouter(Header);
