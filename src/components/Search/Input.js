import React, { useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CountryContext, LocationContext, DataContext } from '../../Store';
import { getData } from '../../services/airquality';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const token = '866c0a841f081b78cfc37c592fa4206c166858f0';

const SearchInput = () => {
  const [countriesList, setCountry] = useContext(CountryContext);
  const [locationsList, setLocation] = useContext(LocationContext);
  const [data, setData] = useContext(DataContext);

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <span onClick={handleClose}>X</span>
    </React.Fragment>
  );

  const handleChange = (entity, newValue, setMethod, list) => {
    if (entity === 'countries') {
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
      return list.map(item => {
        return {
          label: item.name,
          id: item.code || item.id
        }
      });
    }

    return [];
  };

  useEffect(() => {
    if (countriesList.inputValue?.id) {
      const countryISO = countriesList.inputValue?.id;
      const url = `https://api.openaq.org/v2/locations?country=${countryISO}&limit=500`
      getData(url)
        .then(res => setLocation({ locations: res?.data?.results }))
        .catch(error => console.error(error));
    }
  }, [countriesList.inputValue?.id, setLocation]);

  useEffect(() => {
    if (locationsList.inputValue?.label) {
      const url = `https://api.waqi.info/feed/${locationsList.inputValue?.label}/?token=${token}`;
      getData(url)
        .then(res => setData(res?.data?.data))
        .catch(error => console.error(error));
    }
  }, [locationsList.inputValue?.label, setData]);

  useEffect(() => {
    if (data && typeof data === 'string') {
      setData(null);
      setOpen(true);
    }
  }, [data, setData]);

  return (
    <>
      <div className='inputs'>
        <Autocomplete
          id="selectCountry"
          freeSolo
          options={renderResults(countriesList.countries)}
          onChange={(event, newValue) => handleChange('countries', newValue, setCountry, countriesList)}
          renderInput={(params) => <TextField {...params} label="Enter Country" className='textFieldClass' />}
          className='position-relative input'
        />
        <Autocomplete
          id="selectCity"
          freeSolo
          options={renderResults(locationsList.locations)}
          onChange={(event, newValue) => handleChange('locations', newValue, setLocation, locationsList)}
          renderInput={(params) => <TextField {...params} label="Enter City" className='textFieldClass' />}
          className='position-relative input margin'
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          autoHideDuration={10000}
          onClose={handleClose}
          action={action}
        >
          <Alert severity="warning">
            <p>No data found for the selected city/station.</p>
            <p>So, displaying only todays data from another source.</p>
            <p>For better results select China and Shanghai</p>
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default SearchInput;
