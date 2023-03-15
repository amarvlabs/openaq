import React, { useContext, useEffect, useState } from 'react';

// App contexts (states)
import { LocationContext, CountryContext } from '../../Store';

// External packages
import moment from 'moment';

const LocationCard = () => {
    const [locationsList, ] = useContext(LocationContext);
    const [countriesList, ] = useContext(CountryContext);
    const [selectedLocation, setSelection] = useState(null);

    const { locations, inputValue } = locationsList;

    useEffect(() => {
        if (locations.length && inputValue) {
            const selected = locations.find(element => element.name.toLowerCase() === inputValue.toLowerCase());
            if (selected) {
                setSelection(selected);
            }
        }
    }, [inputValue, locations]);

    return (
        <div className='cards d-flex'>
            {locationsList.inputValue && (
                <div className='card position-relative'>
                    <p className='card__location'>{selectedLocation?.name}</p>
                    <p className='card__city'>{countriesList?.inputValue}</p>
                    <div>
                        Sources:{' '}
                        <span>
                            {selectedLocation?.sources?.length && selectedLocation?.sources[0]?.name}
                        </span>
                    </div>
                    <div>
                        <p>
                            Latitude: {selectedLocation?.coordinates?.latitude}
                        </p>
                        <p>
                            Logitude: {selectedLocation?.coordinates?.longitude}
                        </p>
                    </div>
                    <p className='card__time'>
                        Updated {moment(selectedLocation?.lastUpdated).fromNow()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationCard;
