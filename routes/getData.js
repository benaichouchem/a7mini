var express = require('express');
var router = express.Router();
var {GoogleSpreadsheet} = require('google-spreadsheet'),
    creds             = require('../credits/hackit-website-6f4bd70a0ff9');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    // Identifying which document we'll be accessing/reading from
    const doc = new GoogleSpreadsheet('1OIMpTY_78r8x_SOFOh57TUnFQVrjUqqhfi-rl09DPeA');

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
