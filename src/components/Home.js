import React, { Component } from 'react';
import sanityClient from '../../lib/sanity';

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
    return <div />;
  }
}

export default Home;
