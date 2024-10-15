const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const secretKey = "bruceisgenius";

const firstList = ["shoppiejapanclothes", "shinkansenfood", "osakastreetbites", "hikokilove"];
const secondList = [];
const thirdList = [];
const fourthList = [];
const fifthList = [];
const sixthList = [];

// Base domains for allowed origins and referrers
const baseDomains = [
  "osakastreetbites.services",
  "shoppiejapanclothes.info",
  "shinkansenfood.shop",
  "hikokilove.us",
];

const generateAllowedUrls = (domains) => {
  const protocols = ["https://", "http://"];
  const www = ["", "www."];
  const trailingSlash = ["", "/"];
  const urls = [];
  domains.forEach(domain => {
    protocols.forEach(protocol => {
      www.forEach(prefix => {
        trailingSlash.forEach(suffix => {
          urls.push(`${protocol}${prefix}${domain}${suffix}`);
        });
      });
    });
  });
  return urls;
};

const allowedUrls = generateAllowedUrls(baseDomains);

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedUrls.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const checkReferrer = (req, res, next) => {
  console.log('referrer checked');
  const referer = req.headers.referer;
  console.log(referer);
  if (referer && allowedUrls.some((url) => referer.startsWith(url))) {
    next();
  } else {
    res.status(403).send("Access forbidden");
  }
};

// New route to send the secret key
app.get("/get-secret-key", (req, res) => {
  const referer = req.headers.referer;
  const origin = req.headers.origin;

  // Check if the request origin or referrer matches allowed URLs
  if ((referer && allowedUrls.some((url) => referer.startsWith(url))) || 
      (origin && allowedUrls.includes(origin))) {
    res.json({ secretKey }); // Send the secret key as JSON
  } else {
    res.status(403).send("Access forbidden"); // If not allowed, return 403
  }
});

const handleRequest = (req, res) => {
  console.log('request aa gyi');
  const fullUrl = req.headers.referer || req.headers.referrer;
  console.log(fullUrl);
  if (firstList.some(item => fullUrl.includes(item))) {
    res.sendFile(path.join(__dirname, "firstNumber.html"));
  } else if (secondList.some(item => fullUrl.includes(item))) {
    res.sendFile(path.join(__dirname, "secondNumber.html"));
  } else if (thirdList.some(item => fullUrl.includes(item))) {
    res.sendFile(path.join(__dirname, "thirdNumber.html"));
  } else if (fourthList.some(item => fullUrl.includes(item))) {
    res.sendFile(path.join(__dirname, "fourthNumber.html"));
  } else if (fifthList.some(item => fullUrl.includes(item))) {
    res.sendFile(path.join(__dirname, "fifthNumber.html"));
  } else {
    res.sendFile(path.join(__dirname, "sixthNumber.html"));
  }
};

app.get("/", checkReferrer, handleRequest);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
