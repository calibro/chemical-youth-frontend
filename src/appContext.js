import React from 'react';

export const AppContext = React.createContext({
  page: '',
  selectedLocation: '',
  setSelectedLocation: () => {},
  selectedTopic: '',
  setSelectedTopic: () => {}
});
