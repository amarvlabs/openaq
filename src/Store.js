import React, { useState, createContext } from 'react';

// Create and export the Contexts
export const CountryContext = createContext();
export const LocationContext = createContext();
export const ParameterContext = createContext();

const Store = ({ children }) => {
  const [countriesList, setCountry] = useState({
    inputValue: '',
    countries: []
  });

  const [locationsList, setLocation] = useState({
    inputValue: '',
    locations: []
  });

  const [parameters, setParameters] = useState([]);

  return (
    // The application is wrapped by the Providers
    <CountryContext.Provider value={[countriesList, setCountry]}>
      <LocationContext.Provider value={[locationsList, setLocation]}>
        <ParameterContext.Provider value={[parameters, setParameters]}>
          {children}
        </ParameterContext.Provider>
      </LocationContext.Provider>
    </CountryContext.Provider>
  );
};

export default Store;
