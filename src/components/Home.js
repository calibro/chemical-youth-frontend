import React, { Component } from 'react';
import sanityClient from '../lib/sanity';
import Header from './Header';
import Projects from './Projects';
import Chemicals from './Chemicals';
import Topics from './Topics';
import Researchers from './Researchers';
import Locations from './Locations';
import Methodologies from './Methodologies';
import Times from './Times';

const query = `*[_type == "chemical"]`;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'chemical'
    };
  }

  render() {
    const pathname = this.props.location.pathname.replace('/', '');
    return (
      <div className='w-100 h-100 d-flex flex-column'>
        <Header activePage={this.state.page} />
        <div
          className='w-100 d-flex'
          style={{
            height: 'calc(100% - 80px)'
          }}
        >
          <div
            className='w-50 h-100'
            style={{
              overflow: 'scroll'
            }}
          >
            {pathname === 'chemical' && <Chemicals />}
            {pathname === 'topic' && <Topics />}
            {pathname === 'location' && <Locations />}
            {pathname === 'researcher' && <Researchers />}
            {pathname === 'time' && <Times />}
            {pathname === 'method' && <Methodologies />}
          </div>
          <div
            className='w-50 h-100'
            style={{
              overflow: 'scroll'
            }}
          >
            <Projects />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
