const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');


app.use(cors());

app.use('/', express.static('public'));


let rawdata = fs.readFileSync('fetchdata.json');
let budget = JSON.parse(rawdata);
console.log(budget);

app.get('/hello', (req,res) =>{
    res.send('Hello World!');
});

app.get('/budget', (req,res) =>{
    res.json(budget);
})

app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`)
});

