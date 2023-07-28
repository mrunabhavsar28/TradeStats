// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");
const axiosRetry = require("axios-retry");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`);
      return retryCount * 2000; 
  },
  retryCondition: (error) => {
      return error.response.status === 503;
  },
});

app.post('/api/fetchStockData', (req, res) => {

    const {symbol, date} = req.body;
    const apiKey = "skb8Fv03Tesa0pTcbvicVORyODsvy19b";
    
    const apiUrl = `https://api.polygon.io/v1/open-close/${symbol}/${date}?apiKey=${apiKey}`;
    console.log(apiUrl)
    axios
    .get(apiUrl)
    .then(response => {
      const tradeData = response.data;
      res.status(200).json({ data: tradeData }); 
    })
    .catch(err => {
      console.log("Error fetching trade data: ", err);
      res.status(500).json({ error: "Failed to fetch Stock Data" });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));