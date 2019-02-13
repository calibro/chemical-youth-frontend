import React, { Component } from 'react';
import sanityClient from '../lib/sanity';
import Header from './Header';

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
        <div className='w-50'>
          <div />
        </div>
        <div className='w-50'>
          <div />
        </div>
      </div>
    );
  }
}

export default Home;
