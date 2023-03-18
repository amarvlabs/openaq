import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

// App contexts (states)
import { LocationContext, CountryContext } from '../../Store';

// External packages
import moment from 'moment';

const LocationCard = () => {
    const [locationsList,] = useContext(LocationContext);
    const [countriesList,] = useContext(CountryContext);
    const [selectedLocation, setSelection] = useState(null);

    const { locations, inputValue } = locationsList;

    useEffect(() => {
        if (locations.length && inputValue?.id) {
            const selected = locations.find(ele => ele.id === inputValue.id);
            if (selected) {
                setSelection(selected);
            }
        }
    }, [inputValue?.id, locations]);

    return (
        <div>
            {locationsList.inputValue?.id && (
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} className='details'>
                    <Grid item xs={2} sm={4} md={4}>Country:{' '}{countriesList?.inputValue?.label}</Grid>
                    <Grid item xs={2} sm={4} md={4}>Location:{' '}{selectedLocation?.name}</Grid>
                    <Grid item xs={2} sm={4} md={4}>Sources:{' '}{selectedLocation?.sources?.length && selectedLocation?.sources[0]?.name}</Grid>
                    <Grid item xs={2} sm={4} md={4}>Latitude:{' '}{selectedLocation?.coordinates?.latitude}</Grid>
                    <Grid item xs={2} sm={4} md={4}>Logitude:{' '}{selectedLocation?.coordinates?.longitude}</Grid>
                    <Grid item xs={2} sm={4} md={4}>Updated {moment(selectedLocation?.lastUpdated).fromNow()}</Grid>
                </Grid>
            )}
        </div>
    );
};

export default LocationCard;
