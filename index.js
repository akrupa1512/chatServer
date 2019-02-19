const express = require('express');
const router = require('./router');
const cors = require('cors');

require('./db/mongoose');

const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.listen(5000, () => {
    console.log(">>>>> server start on port 5000");
});