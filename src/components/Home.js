import React, { Component } from 'react';
import sanityClient from '../lib/sanity';
import Header from './Header';
import Projects from './Projects';
import Chemicals from './Chemicals';

const query = `*[_type == "chemical"]`;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'chemical'
    };
  }

  render() {
    console.log(this.props);
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
            <Chemicals />
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
