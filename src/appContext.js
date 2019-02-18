import React from 'react';

export const AppContext = React.createContext({
  section: '',
  setSection: () => {},
  selectedChemical: '',
  setSelectedChemical: () => {},
  selectedLocation: '',
  setSelectedLocation: () => {},
  selectedTopic: '',
  setSelectedTopic: () => {}
});
