import React, { Component } from 'react';
import Header from './Header';
import Projects from './Projects';
import Chemicals from './Chemicals';
import Topics from './Topics';
import Researchers from './Researchers';
import Locations from './Locations';
import Methodologies from './Methodologies';
import Times from './Times';
import { AppContext } from '../appContext';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'chemical',
      selectedLocation: '',
      setSelectedLocation: this.setSelectedLocation
    };
  }

  setSelectedLocation = location => {
    this.setState({
      selectedLocation: location === this.state.selectedLocation ? '' : location
    });
  };

  render() {
    const pathname = this.props.location.pathname.replace('/', '');
    return (
      <AppContext.Provider value={this.state}>
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
      </AppContext.Provider>
    );
  }
}

export default Home;
