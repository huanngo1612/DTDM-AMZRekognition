const port = 4000;
const express = require("express");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
app.use(cors());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

aws.config.update({
  accessKeyId: "ASIA3P5LC73G244K5JQQ",
  secretAccessKey: "7jDBkdXF3/X+eZafpqW9c/VrkWzwfHu0Eecp4adn",
  sessionToken:
    "FwoGZXIvYXdzEIX//////////wEaDNgCMLWlWAQyhGyoUyLPAdR9BP22nSgfbatcuYZEpQCUkglhECwotoG2pbLYLwgVhEGsjHB22g6dPdlWowDPSr1Ip6W0ajiNG//UBwJqmzm20GBT085Q2zt3BZl7PJ6d79hki14zV2UcvvxOZN3N0GUGLRh2JTm+L9onIPz2yLxZcZaF7T2d0ymZJLTAAUH36MhN1drBKeZnBD0AklaPk+vV6nQUVasEhZNqTDywk3w1PGPDJ7AMAGHQ+wf9BLdHuNwJUEBr8nLPb8km/WxZj9CmSLsA730yxJASjU+W8Sjk27GbBjItAjRq9C2mFtN4YQhQrqpeVPIoGnUj5Iny+TABGzR21tw3ZazgnUw1GrBawuQ4",
  region: "us-east-1",
  signatureVersion: "v4",
});

app.post("/api/setCLI", (req, res) => {
  console.log("aws config: ", aws.config);

  res.status(200).json({
    status: "success",
  });
});

//Upload Image to S3 Bucket
const s3 = new aws.S3({ region: "us-east-1" });
const upload = multer({
  fileFilter: (req, image, cb) => {
    if (image.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "mybucket465789",
    key: function (req, image, cb) {
      req.image = Date.now() + image.originalname;
      cb(null, Date.now() + image.originalname);
    },
  }),
});

app.post("/api/upload", upload.array("image", 1), (req, res) => {
  try {
    res.send({ image: req.image });
  } catch (err) {
    console.log(err);
  }
});

//Rekognition
const rekognition = new aws.Rekognition({ region: "us-east-1" });

//Rekognition-Label
app.post("/api/labels", (req, res) => {
  var params = {
    Image: {
      S3Object: {
        Bucket: "mybucket465789",
        Name: req.body.name,
      },
    },
    MaxLabels: 5,
    MinConfidence: 80,
  };
  console.log(req.body.name);
  rekognition.detectLabels(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else res.send({ data: data });
    console.log(data);
  });
});

//Rekognition-Text
app.post("/api/texts", (req, res) => {
  var params = {
    Image: {
      S3Object: {
        Bucket: "mybucket465789",
        Name: req.body.name,
        //Name: "1667363944222img_default.png",
      },
    },
    Filters: {
      WordFilter: {
        MinConfidence: 80,
      },
    },
  };
  console.log(req.body.name);
  rekognition.detectText(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else res.send({ data: data });
    console.log(data);
  });
});

//Rekognition -Face
app.post("/api/faces", (req, res) => {
  var params = {
    Image: {
      S3Object: {
        Bucket: "mybucket465789",
        Name: req.body.name,
      },
    },
    Attributes: ["ALL"],
  };
  rekognition.detectFaces(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else res.send({ data: data });
  });
});

//Rekognition Celeb
app.post("/api/celeb", (req, res) => {
  var params = {
    Image: {
      S3Object: {
        Bucket: "mybucket465789",
        Name: req.body.name,
      },
    },
  };
  rekognition.recognizeCelebrities(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else res.send({ data: data });
    console.log("celeb", data);
  });
});

//Rekognition-Compare
app.post("/api/compare", (req, res) => {
  var params = {
    SimilarityThreshold: 0,
    SourceImage: {
      S3Object: {
        Bucket: "mybucket465789",
        Name: req.body.name,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: "mybucket465789",
        Name: req.body.name2,
      },
    },
  };

  rekognition.compareFaces(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else res.send({ data: data });
    console.log(data);
  });
});
//
app.listen(port, () => {
  console.log("App is " + port);
});

app.get("/", (req, res) => {
  res.status(200).send("Connected!");
});
