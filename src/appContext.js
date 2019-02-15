import React from 'react';

export const AppContext = React.createContext({
  selectedLocation: '',
  page: '',
  setSelectedLocation: () => {}
});
