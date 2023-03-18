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

export default function ParameterTable() {
    const [parameters,] = useContext(ParameterContext);
    const [locationsList,] = useContext(LocationContext);
    const [data,] = useContext(DataContext);

    const [config, setConfig] = useState(options);

    const { locations, inputValue } = locationsList;

    const getParameterValue = (selectedLocation, item) => {
        const selected = selectedLocation.parameters.find(ele => ele.displayName === item);
        if (selected) {
            return selected?.lastValue;
        }

        return 0;
    }

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

    const getParameterNames = useCallback(() => {
        const parameterList = forecastData.map(x => {
            const parameter = parameters.find(p => p.name === x.paramId);
            return parameter.displayName;
        });

        return parameterList;
    }, [forecastData, parameters]);

    const getParametersList = useCallback(() => {
        const parameterValues = parameters.map(item => item.displayName);
        return parameterValues;
    }, [parameters]);

    const getXAxis = useCallback(() => {
        if (forecastData) {
            return getParameterNames();
        } else if (inputValue?.id) {
            return getParametersList();
        } else {
            return [];
        }
    }, [inputValue?.id, forecastData, getParameterNames, getParametersList]);

    const getChartData = useCallback(() => {
        if (forecastData) {
            return forecastData;
        } else if (inputValue?.label) {
            let result = {
                pointWidth: 24,
                color: "#f37e09",
                showInLegend: false,
                data: []
            };
            const selectedLocation = locations.find(ele => ele.name.toLowerCase() === inputValue?.label.toLowerCase());
            if (selectedLocation && selectedLocation?.parameters && selectedLocation?.parameters?.length) {
                result.data = getParametersList().map(ele => getParameterValue(selectedLocation, ele))
            }
            
            return result;
        } else {
            return [];
        }
    }, [inputValue?.label, forecastData, getParametersList, locations]);

    useEffect(() => {
        const parsedConfig = { ...options };
        parsedConfig.xAxis.categories = getXAxis();
        parsedConfig.series = getChartData();
        setConfig(parsedConfig);
    }, [getChartData, getXAxis]);

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
