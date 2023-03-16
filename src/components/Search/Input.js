import React, { useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CountryContext, LocationContext } from '../../Store';
import { getData } from '../../services/airquality';

const SearchInput = () => {
  const [countriesList, setCountry] = useContext(CountryContext);
  const [locationsList, setLocation] = useContext(LocationContext);

  const handleChange = (entity, newValue, setMethod, list) => {
    if (entity === 'country') {
      setLocation({
        inputValue: '',
        locations: []
      });
    }
    setMethod({
      ...list,
      inputValue: newValue
    });
  };

  const renderResults = (list) => {
    if (list.length > 0) {
      return list.map(item => item.name);
    }

    return [];
  };

  useEffect(() => {
    if (countriesList.countries.length && countriesList.inputValue) {
      const selectedCountry = countriesList.countries.filter(item => item.name === countriesList.inputValue);
      const countryISO = selectedCountry[0]?.code;
      const url = `https://api.openaq.org/v2/locations?country=${countryISO}&limit=500`
      getData(url)
        .then(locations => setLocation({ locations }))
        .catch(error => console.error(error));
    }
  }, [countriesList.inputValue, countriesList.countries, setLocation]);

  return (
    <>
      <div className='inputs'>
        <Autocomplete
          id="selectCountry"
          freeSolo
          options={renderResults(countriesList.countries)}
          onChange={(event, newValue) => handleChange('country', newValue, setCountry, countriesList)}
          renderInput={(params) => <TextField {...params} label="Enter Country" className='textFieldClass' />}
          className='position-relative input'
        />
        <Autocomplete
          id="selectCity"
          freeSolo
          options={renderResults(locationsList.locations)}
          onChange={(event, newValue) => handleChange('location', newValue, setLocation, locationsList)}
          renderInput={(params) => <TextField {...params} label="Enter City" className='textFieldClass' />}
          className='position-relative input margin'
        />
      </div>
    </>
  );
};

export default SearchInput;
