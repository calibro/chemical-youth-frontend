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
import { find, findIndex } from 'lodash';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: '',
      setSection: this.setSection,
      selectedChemical: '',
      setSelectedChemical: this.setSelectedChemical,
      selectedLocation: '',
      setSelectedLocation: this.setSelectedLocation,
      selectedTopic: '',
      setSelectedTopic: this.setSelectedTopic,
      selected: [],
      setSelected: this.setSelected,
      toggleSelected: this.toggleSelected
    };
  }

  setSelectedLocation = location => {
    this.setState({
      selectedLocation: location === this.state.selectedLocation ? '' : location
    });
  };

  setSelectedTopic = topic => {
    this.setState({
      selectedTopic: topic === this.state.selectedTopic ? '' : topic
    });
  };

  setSelectedChemical = chemical => {
    this.setState({
      selectedChemical: chemical === this.state.selectedChemical ? '' : chemical
    });
  };

  setSection = section => {
    this.setState({
      section: section
    });
  };

  setSelected = selected => {
    console.log(selected);
    this.setState({
      selected: selected
    });
  };

  toggleSelected = selected => {
    const selectedArray = this.state.selected;
    if (selected.type && selected.value !== null) {
      if (find(selectedArray, selected)) {
        const index = findIndex(selectedArray, selected);
        selectedArray.splice(index, 1);
      } else {
        selectedArray.push(selected);
      }
      this.setState({
        selected: selectedArray
      });
    }
  };

  componentDidMount() {
    // const pathname = this.props.location.pathname.split('/');
    // this.setSection(pathname[1]);
    // if (pathname[2]) {
    //   const selected = { type: pathname[1], value: pathname[2] };
    //   this.addSelected(selected);
    // } else {
    //   const selected = { type: pathname[1], value: null };
    //   this.addSelected(selected);
    // }
  }

  render() {
    const pathname = this.props.location.pathname.split('/')[1];
    return (
      <AppContext.Provider value={this.state}>
        <div className='w-100 h-100 d-flex flex-column'>
          <Header />
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

Home.contextType = AppContext;

export default Home;
