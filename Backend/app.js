require('dotenv').config();
var express = require("express");
var app = express();
const fs = require('fs');
const yaml = require('js-yaml');
const BC = require('./historic/block');
const { json } = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
 
const authRoutes = require('./routes/Auth.js');
const memberRoutes=require('./routes/memberRoutes.js');

app.use(express.json());
app.use(cors());

app.use('/', authRoutes);
app.use('/', memberRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 