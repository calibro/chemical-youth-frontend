import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { AppContext } from '../appContext';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  matchStateToTerm = (elem, value) => {
    if (value.length > 0) {
      return elem.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }
  };

  render() {
    const { items, type, selectionCallBack } = this.props;
    const { value } = this.state;
    return (
      <div className='w-100 p-3'>
        <Autocomplete
          getItemValue={item => item.name}
          items={items}
          inputProps={{ className: 'states-autocomplete' }}
          wrapperStyle={{
            position: 'relative'
          }}
          menuStyle={{
            backgroundColor: 'white'
          }}
          renderItem={(item, isHighlighted) => (
            <div
              key={item._id}
              style={{ background: isHighlighted ? 'lightgray' : 'white' }}
            >
              {item.name}
            </div>
          )}
          value={value}
          shouldItemRender={this.matchStateToTerm}
          onChange={(event, value) => this.setState({ value: value })}
          onSelect={val => {
            selectionCallBack(type, val);
            this.setState({ value: '' });
          }}
        />
      </div>
    );
  }
}

Search.contextType = AppContext;

export default Search;
