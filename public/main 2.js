'use strict'


let sdk = new window.sfdc.BlockSDK(); //initalize SDK
let defaultContent = `<h1>This is the defualt content</h1>`;

let data = {
    textMessage: '<h1>Hello world!</h1>',
    fromLang: 'auto',
    toLang: 'auto'
};



let saveData = () => {
    // console.log('Saving data...');

    // data.textMessage = document.getElementById('editor-container').innerHTML;
    data.textMessage = getEditorFormattedText();
    data.fromLang = document.getElementById('fromLang').value;
    data.toLang = document.getElementById('toLang').value;

    let xhttp = new XMLHttpRequest();

    xhttp.open('POST', '/translate', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`text=${data.textMessage}&from=${data.fromLang}&to=${data.toLang}`);

    xhttp.onreadystatechange = () => {
        // console.log('response -> ' + xhttp.responseText);
        // document.getElementById('t1').innerText = xhttp.responseText;

        sdk.setData(data, (updatedData) => {
            let content = xhttp.responseText;
            sdk.setContent(content);
        });
    }

}

let fetchData = () => {
    // console.log('Loading data...');

    sdk.getData((dataCB) => {
        if (Object.keys(dataCB).length > 0) {
            data = dataCB;

            // document.getElementById('editor-container').innerHTML = data.textMessage;
            setEditorFormattedText(data.textMessage);
            document.getElementById('fromLang').value = data.fromLang;
            document.getElementById('toLang').value = data.toLang;

            // console.log('Found data!');
        }


    });


}

// Event Handlers
window.onload = fetchData;
window.onchange = saveData;