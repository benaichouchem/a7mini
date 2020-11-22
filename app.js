var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
async function GetSecretWithName(secretName) {
    
    const name = secretName;
      
    // Imports the Secret Manager library
    const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
    
    // Instantiates a client
    const client = new SecretManagerServiceClient();
    try {
        const [secretVersion] = await client.accessSecretVersion({
            name: name,
        }); 

        const payload = secretVersion.payload.data.toString();
        return payload;

    }
    catch (e) {
        console.log(e, "ERROR");

    }   
  }

var fs              = require('fs'),
    readline        = require('readline'),
    {google}        = require('googleapis'),
    request         = require('request');


// Defining our application routes
var indexRouter = require('./routes/index');
var dataRouter = require('./routes/getData');
const {GoogleSpreadsheet} = require("google-spreadsheet");

var app = express();

//Defining the App's uses
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));


app.use('/', indexRouter);
console.log('getData');
app.use('/getData', dataRouter);

app.get("/google-spreadsheet", async function(req, res){
    // Identifying which document we'll be accessing/reading from
    var dataSecret = await GetSecretWithName('projects/a7mini/secrets/MasterDataSheet/versions/2');

    const doc = new GoogleSpreadsheet(dataSecret);

    // Authentication
    await doc.useServiceAccountAuth(creds);

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    // await doc.updateProperties({ title: 'renamed doc' });

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    console.log(sheet.title);
    console.log(sheet.rowCount);
    const rows = await sheet.getRows();
    res.send(rows[0].worldDeaths);
});



module.exports = app;