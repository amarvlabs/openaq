import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { LocationContext, ParameterContext } from '../../Store';

const columns = [
    { field: 'parameter', headerName: 'Parameter', width: 150 },
    { field: 'current', headerName: 'Today', width: 100 }
];

export default function ParameterTable() {
    const [parameters, ] = React.useContext(ParameterContext);
    const [locationsList, ] = React.useContext(LocationContext);

    const { locations, inputValue } = locationsList;

    const getParameterValue = (selectedLocation, item) => {
        const selected = selectedLocation.parameters.find(ele => ele.displayName === item.displayName);
        if (selected) {
            return selected?.lastValue;
        }

        return '-';
    }

    const rows = React.useMemo(() => {
        if (inputValue) {
            let result = [];
            const selectedLocation = locations.find(ele => ele.name.toLowerCase() === inputValue.toLowerCase());
            if (selectedLocation && selectedLocation?.parameters && selectedLocation?.parameters?.length) {
                parameters.forEach((item, index) => {
                    result = [...result, { id: `${index+1}` , parameter: item.displayName, current: getParameterValue(selectedLocation, item) }]
                })
            }

            return result;
        }

        return [];
    }, [inputValue, locations, parameters]);

    return (
        <>
            {rows.length ? (
                <div style={{ height: 400, background: '#FFFFFF' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                    />
              </div>) : null}
        </>
    );
}
