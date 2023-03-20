import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { DataContext, LocationContext, ParameterContext } from '../../Store';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment';

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
        column: {
            borderRadius: 3,
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [],
    legend: {
        itemStyle: {
            fontWeight: '500',
            color: '#FFFFFF',
        },
    },
    accessibility: {
        enabled: false
    }
};

const colorCodings = {
    yesterday: '#7CB5EC',
    today: '#f37e09',
    tomorrow: '#90ED7D'
}

const seriesConfig = {
    pointWidth: 24,
    color: "#f37e09",
    showInLegend: false,
    data: []
};

export default function ParameterTable() {
    const [parameters,] = useContext(ParameterContext); // Data of air parameters from api.openaq.org
    const [locationsList,] = useContext(LocationContext); // Data from api.openaq.org
    const [data,] = useContext(DataContext); // Data from api.waqi.info

    const [config, setConfig] = useState(options);

    const { locations, inputValue } = locationsList;

    // Extracting the values from parameters data of selected location
    const getParameterValue = (selectedLocation, item) => {
        const selected = selectedLocation.parameters.find(ele => ele.displayName === item);
        if (selected) {
            return selected?.lastValue;
        }

        return 0;
    }

    // extracting data from api.waqi.info
    const forecastData = useMemo(() => {
        let result = null;
        if (data && typeof data === 'object') {
            const dates = {
                [moment().subtract(1, 'days').format('YYYY-MM-DD')]: 'yesterday',
                [moment().format('YYYY-MM-DD')]: 'today',
                [moment().add(1, 'days').format('YYYY-MM-DD')]: 'tomorrow'
            }
            const params = Object.keys(data?.forecast?.daily);
            result = Object.keys(dates).map((item, index) => {
                const todaysData = Object.keys(data.forecast.daily).map(param => data.forecast.daily[param].find(x => x.day === item));

                return {
                    name: item,
                    paramId: params && params.length ? params[index] : null,
                    showInLegend: true,
                    color: colorCodings[dates[item]],
                    data: todaysData && todaysData.length ? todaysData.map(x => x && x.avg) : []
                };
            });
            return result;
        }
    }, [data]);

    // Extracting the parameter names of selected location
    const getParameterNames = useCallback(() => {
        let parameterList = [];
        if (forecastData) { // if data exists in api.waqi.info
            parameterList = forecastData.map(x => {
                const parameter = parameters.find(p => p.name === x.paramId);
                return parameter.displayName;
            });
        } else if (inputValue?.id) { // else display data from api.openaq.org
            parameterList = parameters.map(item => item.displayName);
        }

        return parameterList;
    }, [forecastData, parameters, inputValue?.id]);

    const getChartData = useCallback(() => {
        if (forecastData) { // if data exists in api.waqi.info, display past present future values
            return forecastData;
        } else if (inputValue?.label) { // else display only todays values from api.openaq.org
            let result = { ...seriesConfig };
            const selectedLocation = locations.find(ele => ele.name.toLowerCase() === inputValue?.label.toLowerCase());
            if (selectedLocation && selectedLocation?.parameters && selectedLocation?.parameters?.length) {
                result.data = getParameterNames().map(ele => getParameterValue(selectedLocation, ele))
            }
            
            return result;
        } else {
            return [];
        }
    }, [inputValue?.label, forecastData, locations, getParameterNames]);

    useEffect(() => {
        const parsedConfig = { ...options };
        parsedConfig.xAxis.categories = getParameterNames();
        parsedConfig.series = getChartData();
        setConfig(parsedConfig);
    }, [getChartData, getParameterNames]);

    return (
        <>
            {inputValue?.id ? (
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
