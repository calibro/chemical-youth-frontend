import React, { Component } from 'react';
import sanityClient from '../lib/sanity';
import Header from './Header';
import Projects from './Projects';

const query = `*[_type == "chemical"]`;

class Home extends Component {
  componentDidMount() {
    sanityClient
      .fetch(query)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  }
  render() {
    return (
      <div className='w-100 h-100 d-flex flex-column'>
        <Header />
        <div className='w-100 d-flex' style={{ height: 'calc(100% - 80px)' }}>
          <div className='w-50 h-100'>
            <div />
          </div>
          <div className='w-50 h-100' style={{ overflow: 'scroll' }}>
            <Projects />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
