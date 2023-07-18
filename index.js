
import express from 'express';

// const axios = require('axios');

// const { Readable } = require('stream');

// const https = require('https');

import fetch from 'node-fetch';

   import FormData from 'form-data';

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
// app.post('/convert', async (req, res) => {
// const imageUrl = req.body.url;
//  console.log("imageUrl",imageUrl);

// if (!imageUrl) {
// return res.status(400).json({ error: 'Image URL is required.' });
// }
//    try {
//     const response = await fetch(imageUrl);
//     console.log("response--->", response)
    
//     const blob = await response.blob();
//     console.log("blob--->",blob)
//  res.send({data: blob});
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error generating form data');
//   }
// });
// ---------------3------------------


// ------------4----------its working---

// app.post('/convert', async (req, res) => {
//   const imageUrl = req.body.url;
//   console.log("imageUrl", imageUrl);
//    if (!imageUrl) {
//     return res.status(400).json({ error: 'Image URL is required.' });
//   }
//    try {
//     const response = await fetch(imageUrl);
//     console.log("response",response)
//     if (!response.ok) {
//       throw new Error('Failed to fetch image');
//     }
//      const buffer = await response.arrayBuffer();
//     console.log("buffer", buffer)
//     // const blob = new Blob([buffer], { type: response.headers.get('content-type') });
//     // const base64Data = buffer.toString('base64');
//     const base64Data = Buffer.from(buffer).toString('base64');

//      res.send({ data: base64Data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error generating form data');
//   }
// });
 // ------------4------------

// // ------------------5---------------
// app.post('/convert', async (req, res) => {
//      let imageUrl = req.body.url;
//       let token = req.body.token;
//      console.log("imageUrl", imageUrl);
//      if (!imageUrl) {
//        return res.status(400).json({ error: 'Image URL is required.' });
//      }

//      try {
//        const response = await fetch(imageUrl);
//        if (!response.ok) {
//          throw new Error('Failed to fetch image');
//        }

//        const buffer = await response.buffer();
//        const base64Data = Buffer.from(buffer).toString('base64');

//        const formData = new FormData();
//        formData.append('screens', Buffer.from(base64Data, 'base64'), 'image.jpg');
//       formData.append('fileType', 'Issue');


//        const uploadResponse = await fetch('https://ft-staging-backend.azurewebsites.net/issues/file-check', {
//          method: 'POST',
//           headers:{
//           "x-access-token":token
//           },
//          body: formData,
//        });

//        if (!uploadResponse.ok) {
//          throw new Error('Failed to upload file');
//        }
//        const uploadResult = await uploadResponse.json();
// console.log("uploadResponse", uploadResult)

//        res.send({data: uploadResult});
//      } catch (error) {
//        console.error(error);
//        res.status(500).send('Error uploading file');
//      }
//    });

 // ---------------5-------------

// --------6-------
app.post('/convert', (req, res) => {
  const imageUrl = req.body.url; // Assuming imageUrl is sent in the request body
  const token = req.body.token; // Assuming token is sent in the request body

  const formData = new FormData();
  fetch(imageUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      return response.arrayBuffer();
    })
    .then(buffer => {
      const file = new Blob([buffer], { type: 'image/jpeg' });
      formData.append('screens', file, 'image.jpg');
      formData.append('token', token);

      // Make the API request with the form data
      fetch('https://ft-staging-backend.azurewebsites.net/issues/file-check', {
        method: 'POST',
         headers:{
                'Content-Type': 'multipart/form-data',
          "x-access-token":token
          },
        body: formData,
      })
        .then(uploadResponse => {
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload file');
          }
          return uploadResponse.json();
        })
        .then(uploadResult => {
           console.log("uploadResult", uploadResult)
          res.json(uploadResult); // Send the upload result as the response
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Failed to upload file' }); // Handle the error
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch image' }); // Handle the error
    });
});

// --------6-------
 app.listen(3000, () => {

  console.log('Server is running on port 3000');

});
