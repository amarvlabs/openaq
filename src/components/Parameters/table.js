import * as React from 'react';
import { LocationContext, ParameterContext } from '../../Store';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const options = {
    title: {
        text: ''
    },
    chart: {
        type: "column",
        backgroundColor: 'transparent'
    },
    tooltip: {
        outside: true,
        useHTML: true,
        formatter: function () {
            return `<div class="tooltip"><b>${this.y}</b></div>`;
        }
    },
    xAxis: {
        labels: {
            enabled: true,
            style: {
                color: '#fff',
                font: '11px Trebuchet MS, Verdana, sans-serif'
            }
        },
        categories: [],
        lineColor: '#fff',
        title: {
            style: {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            }            
        }
    },

    yAxis: {
        max: 500,
        lineColor: '#fff',
        lineWidth: 1,
        labels: {
            style: {
                color: '#fff',
                font: '11px Trebuchet MS, Verdana, sans-serif'
            }
        },
        title: false,
    },
    plotOptions: {
        series: {
            borderRadius: 3,
            pointPadding: 0,
            groupPadding: 0.05,
        }
    },
    series: [
        {
            pointWidth: 24,
            color: "#f37e09",
            showInLegend: false,
            data: []
        }
    ],
    accessibility: {
        enabled: false
    }
};

export default function ParameterTable() {
    const [parameters,] = React.useContext(ParameterContext);
    const [locationsList,] = React.useContext(LocationContext);
    const [config, setConfig] = React.useState(options);

    const { locations, inputValue } = locationsList;

    const getParameterValue = (selectedLocation, item) => {
        const selected = selectedLocation.parameters.find(ele => ele.displayName === item);
        if (selected) {
            return selected?.lastValue;
        }

        return 0;
    }

    React.useEffect(() => {
        if (inputValue) {
            let result = [];
            const parameterValues = parameters.map(item => item.displayName);
            const selectedLocation = locations.find(ele => ele.name.toLowerCase() === inputValue.toLowerCase());
            if (selectedLocation && selectedLocation?.parameters && selectedLocation?.parameters?.length) {
                result = parameterValues.map(ele => getParameterValue(selectedLocation, ele))
            }
            const parsedConfig = { ...options };
            parsedConfig.xAxis.categories = parameterValues;
            parsedConfig.series[0].data = result;
            setConfig(parsedConfig);
        } else {
            const parsedConfig = { ...options };
            parsedConfig.xAxis.categories = [];
            parsedConfig.series[0].data = [];
            setConfig(parsedConfig);
        }
    }, [inputValue, locations, parameters]);

    return (
        <>
            {inputValue ? (
            <div className='highchart'>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={config}
                />
            </div>
             ): null}
        </>
    );
}
