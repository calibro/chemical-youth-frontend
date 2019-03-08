import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../appContext';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { withGetScreen } from 'react-getscreen';

const Header = ({ history, expanded = true, isMobile }) => {
  const context = useContext(AppContext);
  const [isOpen, toggleOpen] = useState(false);

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
    <div>
      <Navbar
        color='light'
        light
        expand='md'
        className='header'
        style={{ height: isMobile() ? 'auto' : expanded ? '70px' : '12px' }}
      >
        {expanded && (
          <React.Fragment>
            <NavbarBrand>
              <div
                className={`navbar-brand cursor-pointer`}
                onClick={() => goToLanding()}
              >
                <img src='images/logo-white.svg' width={60} />
              </div>
            </NavbarBrand>
            <NavbarToggler onClick={() => toggleOpen(!isOpen)} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className='' navbar>
                <NavItem className='nav-item'>
                  <div className={`header-el-not-link`}>View by:</div>
                </NavItem>
                <NavItem
                  className='nav-item'
                  onClick={() => changeSection('chemical')}
                >
                  <div
                    className={`header-el ${
                      context.section === 'chemical' ? 'underline' : 'none'
                    }`}
                  >
                    CHEMICAL
                  </div>
                </NavItem>
                <NavItem
                  className='nav-item'
                  onClick={() => changeSection('topic')}
                >
                  <div
                    className={`header-el ${
                      context.section === 'topic' ? 'underline' : 'none'
                    }`}
                  >
                    TOPIC
                  </div>
                </NavItem>
                <NavItem
                  className='nav-item'
                  onClick={() => changeSection('location')}
                >
                  <div
                    className={`header-el ${
                      context.section === 'location' ? 'underline' : 'none'
                    }`}
                  >
                    LOCATION
                  </div>
                </NavItem>
                <NavItem
                  className='nav-item'
                  onClick={() => changeSection('researcher')}
                >
                  <div
                    className={`header-el ${
                      context.section === 'researcher' ? 'underline' : 'none'
                    }`}
                  >
                    RESEARCHER
                  </div>
                </NavItem>
                <NavItem
                  className='nav-item'
                  onClick={() => changeSection('time')}
                >
                  <div
                    className={`header-el ${
                      context.section === 'time' ? 'underline' : 'none'
                    }`}
                  >
                    TIME
                  </div>
                </NavItem>
                <NavItem
                  className='nav-item'
                  onClick={() => changeSection('method')}
                >
                  <div
                    className={`header-el ${
                      context.section === 'method' ? 'underline' : 'none'
                    }`}
                  >
                    METHOD
                  </div>
                </NavItem>
              </Nav>
            </Collapse>
          </React.Fragment>
        )}
      </Navbar>
    </div>
  );
};

export default withGetScreen(withRouter(Header));
