import React from 'react';

export const AppContext = React.createContext({
  page: '',
  setSection: () => {},
  selectedLocation: '',
  setSelectedLocation: () => {},
  selectedTopic: '',
  setSelectedTopic: () => {}
});
