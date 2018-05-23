const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});
const port = 10110;
const fs = require('fs');

app.listen(port);
app.use(express.static(__dirname + '/public'));