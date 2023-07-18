
const express = require('express');

const axios = require('axios');

const { Readable } = require('stream');

const https = require('https');

import {fetch} from 'node-fetch';

 const app = express();

app.use(express.json());

//  function convertImageUrlToBinary(imageUrl) {

//   return axios.get(imageUrl, { responseType: 'arraybuffer' })

//     .then(response => Buffer.from(response.data, 'binary').toString('binary'));

// }

//  app.post('/convert', async (req, res) => {

//   try {

//     const imageUrl = req.body.url; // Assuming the URL is sent in the request body

//     const binaryString = await convertImageUrlToBinary(imageUrl);

//      // Set the response headers

//     res.set('Content-Type', 'text/plain');

//     res.send({ data: binaryString });

//   } catch (error) {

//     console.error(error);

//     res.status(500).send('Error converting image to binary');

//   }

// });

// ---------------2------------------
// app.post('/convert', (req, res) => {
// const imageUrl = req.body.url;

// if (!imageUrl) {
// return res.status(400).json({ error: 'Image URL is required.' });
// }

// https.get(imageUrl, response => {
// let data = Buffer.alloc(0);
// response.on('data', chunk => {
// data = Buffer.concat([data, chunk]);
// });
// response.on('end', () => {
// res.send({data: data});
// });
// }).on('error', error => {
// res.status(500).json({ error: 'Error fetching the image.' });
// });
// });
// ---------------2------------------


// ---------------3------------------
app.post('/convert', async (req, res) => {
const imageUrl = req.body.url;

if (!imageUrl) {
return res.status(400).json({ error: 'Image URL is required.' });
}
   try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
 res.send({data: blob});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating form data');
  }
});
// ---------------3------------------
 app.listen(3000, () => {

  console.log('Server is running on port 3000');

});
