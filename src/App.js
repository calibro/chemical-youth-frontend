import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import sanityClient from './lib/sanity';

const query = `*[_type == "chemical"]`;

class App extends Component {
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
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code> src / App.js </code> and save to reload.{' '}
          </p>{' '}
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React{' '}
          </a>{' '}
        </header>{' '}
      </div>
    );
  }
}

export default App;
