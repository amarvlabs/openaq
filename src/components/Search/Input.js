import React, { useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { CountryContext, LocationContext } from '../../Store';
import { getData } from '../../services/airquality';

const SearchInput = () => {
  const [countriesList, setCountry] = useContext(CountryContext);
  const [locationsList, setLocation] = useContext(LocationContext);

  const handleChange = (newValue, setMethod, list) => {
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
      <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          id="selectCountry"
          freeSolo
          options={renderResults(countriesList.countries)}
          value={countriesList.inputValue}
          onChange={(event, newValue) => handleChange(newValue, setCountry, countriesList)}
          renderInput={(params) => <TextField {...params} label="Enter Country" className='textFieldClass' />}
          className='position-relative'
        />
        <Autocomplete
          id="selectCity"
          freeSolo
          options={renderResults(locationsList.locations)}
          value={locationsList.inputValue}
          onChange={(event, newValue) => handleChange(newValue, setLocation, locationsList)}
          renderInput={(params) => <TextField {...params} label="Enter City" className='textFieldClass' />}
          className='position-relative'
        />
      </Stack>
    </>
  );
};

export default SearchInput;
