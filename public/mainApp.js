'use strict'

let sdk = new window.sfdc.BlockSDK(); //initalize SDK
let blockData = {
    location: 'London, UK',
    template: 'text',
    units: 'metric'
};

let defaultContent = `<img src="https://dj-weather-sfmc-cb.herokuapp.com/weather.png?loc=${blockData.location}&template=${blockData.template}&units=${blockData.units}">`;


let saveData = () => {
    console.log('Saving data...');

    blockData.location = document.getElementById('location').value;
    blockData.template = document.getElementById('template').value;
    blockData.units = document.getElementById('units').value;

    sdk.setData(blockData, (updatedData) => {
        let content = `<img src="https://dj-weather-sfmc-cb.herokuapp.com/weather.png?loc=${blockData.location}&template=${blockData.template}&units=${blockData.units}">`;
        sdk.setContent(content);
    });
}

let fetchData = () => {
    console.log('Loading data...');
    sdk.getData((dataCB) => {
        if (Object.keys(dataCB).length > 0) {
            blockData = dataCB;

            // console.log('Found data!');
            document.getElementById('location').value = blockData.location;
            document.getElementById('template').value = blockData.template;
            document.getElementById('units').value = blockData.units;

        }
    });
}

sdk.setSuperContent(defaultContent, (newSuperContent) => {});

// Event Handlers
window.onload = fetchData;
window.onchange = saveData;