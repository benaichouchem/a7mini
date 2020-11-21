var express = require('express');
var router = express.Router();
var {GoogleSpreadsheet} = require('google-spreadsheet'),
    creds             = require('../credits/hackit-website-6f4bd70a0ff9');

    async function GetSecretWithName(secretName) {
    
        const name = secretName;
      
        // Imports the Secret Manager library
        const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
      
        // Instantiates a client
        const client = new SecretManagerServiceClient();
        try {
          const [secret] = await client.getSecret({
            name: name,
          });   
         return secret.name;
    
        }
        catch (e) {
          console.log(e, "ERROR");
    
        }
        
      }
/* GET users listing. */
router.get('/', async function (req, res, next) {
    // Identifying which document we'll be accessing/reading from
    try {
        var userSecret = await GetSecretWithName('projects/a7mini/secrets/MasterDataSheet');
    }
    catch (e) {
        console.log(e, "ERROR");
        return;
    }

    const doc = new GoogleSpreadsheet(userSecret);
    // Authentication
    await doc.useServiceAccountAuth(creds);

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0]; // Getting the first sheet
    const rows = await sheet.getRows(); // Getting the rows from th sheet

    const object = { //creating an object to send as a response
        cases: rows[0].active,
        recovered: rows[0].recoveries,
        reanimated: rows[0].reanimated,
        dead: rows[0].deaths,
        worldCases: rows[0].worldActive,
        worldDead: rows[0].worldDeaths,
    };


    res.json(object);
});

module.exports = router;
