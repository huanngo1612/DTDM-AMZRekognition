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
const nameBucket = "myhuanngo1612";

aws.config.update({
  accessKeyId: "ASIA3P5LC73G3L3Q2W3L",
  secretAccessKey: "vXhp5+NPz4mbqXQYLJNfbiMlees4PdjEVx94IGGc",
  sessionToken:
    "FwoGZXIvYXdzEPP//////////wEaDIY5LKMmMs4xTWjgpyLPAe0Cu+YIhy8GCOTU96lp8jHb1mAY+X8/ceZIHg3H8jlx+6VhCcC+kZ/xlMFhC+QPgZ1QI7m6CvWrzRzPpDZk5t2WovD5KE5cx62YxvjsaQ8ydBHL4cuMH+Y9zK9yDCidPgBzvVTTpyqwjXPHSUzKGMcJs5ExVpCNAKgZtVBgMWA0yKN9E0QE1P6CHNDiFl4YQNS+j4LHp+GacUebOi8iv4ZQq5kN9obB5TxUZmTn54JwZDrTOTVUyZbWiW5GVZUif4+XR87HGLUerRnPCGXsWyjOtLqcBjItUgwMZ4X1Ga6ISfqEc/GuS6xK/wtClLP2zYGUXtys81tJcHe9vkMmvH7Py91P",
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
    bucket: nameBucket,
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
        Bucket: nameBucket,
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
        Bucket: nameBucket,
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
        Bucket: nameBucket,
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
        Bucket: nameBucket,
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
        Bucket: nameBucket,
        Name: req.body.name,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: nameBucket,
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
