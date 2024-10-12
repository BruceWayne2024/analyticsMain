const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const firstList = ["yuuyuuyoga", "sakurasuhiandramenbar"];
const secondList = ["spadelightjapan", "hdjavforyou", "javhdaffiliates"];
const thirdList = ["seishinyogajp", "foodhutjapan", "hotelroyaltonjp"];
const fourthList = ["hikokilove", "shoppiejapanclothes", "shinkansenfacts", "osakastreetbites"];
const fifthList = [];
const sixthList = ["fitzonefitness", "wanoiyashi", "fitclubgathering", "nogamilearnings"];

// Base domains for allowed origins and referrers
const baseDomains = [
  "sakurasuhiandramenbar.com",
  "foodhutjapan.com",
  "hotelroyaltonjp.com",
  "spadelightjapan.fit",
  "javhdaffiliates.site",
  "seishinyogajp.fit",
  "massagesayami.com",
  "yuuyuuyoga.fit",
  "hdjavforyou.online",
  "osakastreetbites.services",
  "sakuracoffee.shop",
  "yumimasseuse.shop",
  "hanasakuniwa.shop",
  "shoppiejapanclothes.info",
  "fitzonefitness.live",
  "shinkansenfacts.us",
  "hikokilove.us",
  "wanoiyashi.shop",
  "fitclubgathering.shop",
  "nogamilearnings.shop",
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
  const referer = req.headers.referer;
  if (referer && allowedUrls.some((url) => referer.startsWith(url))) {
    next();
  } else {
    res.status(403).send("Access forbidden");
  }
};

const handleRequest = (req, res) => {
  const fullUrl = req.headers.referer || req.headers.referrer;
  if (firstList.some(item => fullUrl.includes(item))) {
    res.sendFile(path.join(__dirname, "index.html"));
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
