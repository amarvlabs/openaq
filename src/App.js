import React, { useEffect, useContext } from 'react';
import { CountryContext, ParameterContext } from './Store';
import { getData } from './services/airquality';
import SearchInput from './components/Search/Input';
import LocationCard from './components/Location/Card';
import ParameterTable from './components/Parameters/table';
import withSplashScreen from './components/SplashScreen/withSplashScreen';

const App = () => {
  const [, setCountry] = useContext(CountryContext);
  const [, setParameters] = useContext(ParameterContext);

  // Get the data from the API and update the context's state
  useEffect(() => {
    const url = `https://api.openaq.org/v2/countries`;
    getData(url)
      .then(res => setCountry({ countries: res?.data?.results }))
      .catch(error => console.error(error));
  }, [setCountry]);

  useEffect(() => {
    const url = `https://api.openaq.org/v2/parameters`;
    getData(url)
      .then(res => setParameters(res?.data?.results))
      .catch(error => console.error(error));
  }, [setParameters]);

  return (
    <div className='main-container p-20'>
      <div>
        <h1 className='text-white text-center'>Air Quality Index</h1>
      </div>

      <SearchInput />
      <ParameterTable />
      <LocationCard />
    </div>
  );
};

export default withSplashScreen(App);
