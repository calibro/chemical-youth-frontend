import React, { useContext, useEffect } from 'react';
import { AppContext } from '../appContext';
import { withRouter } from 'react-router-dom';

const Header = ({ history, expanded = true }) => {
  const context = useContext(AppContext);
  useEffect(() => {
    const pathname = history.location.pathname.split('/');
    context.setSection(pathname[1]);
  }, [history.location.pathname]);

  const changeSection = section => {
    context.setSection(section);
    context.selected = [];
    history.push(`/${section}`);
  };

  const goToLanding = () => {
    history.push(`/`);
  };

  return (
    <div className={`header ${expanded ? '' : 'small'}`}>
      <div className='w-100 header-background' />
      {expanded && (
        <div className='header-content w-70 d-flex align-items-center justify-content-around'>
          <div>
            <div className={`cursor-pointer`} onClick={() => goToLanding()}>
              <img src='images/logo-white.svg' width={60} />
            </div>
          </div>
          <div>
            <div className={`header-el-not-link`}>View by:</div>
          </div>
          <div onClick={() => changeSection('chemical')}>
            <div
              className={`header-el ${
                context.section === 'chemical' ? 'underline' : 'none'
              }`}
            >
              CHEMICAL
            </div>
          </div>
          <div onClick={() => changeSection('topic')}>
            <div
              className={`header-el ${
                context.section === 'topic' ? 'underline' : 'none'
              }`}
            >
              TOPIC
            </div>
          </div>
          <div onClick={() => changeSection('location')}>
            <div
              className={`header-el ${
                context.section === 'location' ? 'underline' : 'none'
              }`}
            >
              LOCATION
            </div>
          </div>
          <div onClick={() => changeSection('researcher')}>
            <div
              className={`header-el ${
                context.section === 'researcher' ? 'underline' : 'none'
              }`}
            >
              RESEARCHER
            </div>
          </div>
          <div onClick={() => changeSection('time')}>
            <div
              className={`header-el ${
                context.section === 'time' ? 'underline' : 'none'
              }`}
            >
              TIME
            </div>
          </div>
          <div onClick={() => changeSection('method')}>
            <div
              className={`header-el ${
                context.section === 'method' ? 'underline' : 'none'
              }`}
            >
              METHOD
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(Header);
