import axios from "axios";
import FormData from "form-data";
import express from "express";
import decode from "jsqr";
import Jimp from "jimp";

const app = express();

app.use(express.json());

const keyArray = [
  "format_version", "creation_date_time", "current_page", "current_page_size",
  "last_page", "list_size", "checksum", "decoder_serial", "decoder_model",
  "smartcard_iuc", "load_version", "software_status", "tsid_1", "ts_quality_1",
  "ts_quality_1", "ts_quality_2", "tsid_3", "ts_quality_3", "tsid_4", "ts_quality_4",
  "lnb_type", "satellite", "user_band_tuner_1", "user_band_tuner_2",
  "user_band_tuner_3", "extraview_status", "extraview_primary",
  "extraview_secondary", "current_channel", "ca_status", "tuner1_ts",
  "tuner1_quality", "tuner2_ts", "tuner2_quality", "tuner3_ts", "tuner3_quality",
  "tv_link_power", "rc_modes", "connectivity_status", "connectivity_speed",
  "connected_services", "remote_recordings", "usage_monitoring", "sec_chip_num",
  "mac_address", "ca_nationality", "hdd_status", "hdd_available_space",
  "pg_type", "pg_pin", "channel_blocking"
];


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
    // imageUrls = JSON.parse(imageUrls);
    imageUrls = imageUrls.replace(/'/g, "");
    console.log("replace", imageUrls);
    imageUrls = imageUrls.split(",");
    console.log(imageUrls.length);
    console.log("image", imageUrls);
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


app.post("/processQRCode", async (req, res) => {
  const imageUrl = req.body.url; 
  try {
    // Fetch the QR code image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    if (response.status === 200) {
      const imageData = Buffer.from(response.data, 'binary');
      Jimp.read(imageData, (err, image) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to read image" });
          return;
        }
        const width = image.getWidth();
        const height = image.getHeight();
        const code = decode(image.bitmap.data, width, height);
        const values = code.data.split(",");
        const QRCodeInfo = {};
    
        if (values.length === keyArray.length) {
          for (let i = 0; i < values.length; i++) {
            QRCodeInfo[keyArray[i]] = values[i];
          }
          res.json(QRCodeInfo);
        } else {
          console.log("Number of values does not match number of keys.");
        }

      })

    } else {
      console.log('Failed to fetch the QR code image.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
