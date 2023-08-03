import axios from "axios";
import FormData from "form-data";
import express from "express";

const app = express();

app.use(express.json());

app.post("/convert", async (req, res) => {
  const imageUrl = req.body.url; // Assuming imageUrl is sent in the request body
  const token = req.body.token; // Assuming token is sent in the request body

  let data = new FormData();
  data.append("fileType", "Issue");

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageData = response.data;
    console.log("imageData", imageData);

    data.append("screens", imageData, "image.jpg");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ft-staging-backend.azurewebsites.net/issues/file-check?SID=1689239466",
      headers: {
        "x-access-token": token,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        res.json({ data: response.data }); // Send the upload result as the response
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Failed to upload file" }); // Handle the error
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch image" }); // Handle the error
  }
});


app.post("/uploadArrayImages", async (req, res) => {
  let imageUrls = req.body.urls; // Assuming imageUrl is sent in the request body
  if(imageUrls && (typeof imageUrls === 'string')){
    imageUrls = JSON.parse(imageUrls);
  }
  const token = req.body.token; // Assuming token is sent in the request body

  let data = new FormData();
  data.append("fileType", "Issue");
  console.log("imageUrls", imageUrls)
console.log("imageUrls typeof ", typeof imageUrls)
  try {
    for (let i = 0; i < imageUrls.length; i++) {

    const response = await axios.get(imageUrls[i], { responseType: "arraybuffer" });
    const imageData = response.data;
    console.log(`image${i}.jpg`, imageData);

    data.append("screens", imageData, `image${i}.jpg`);
    }
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ft-staging-backend.azurewebsites.net/issues/file-check?SID=1689239466",
      headers: {
        "x-access-token": token,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        res.json({ data: response.data }); // Send the upload result as the response
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Failed to upload file" }); // Handle the error
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch image" }); // Handle the error
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
