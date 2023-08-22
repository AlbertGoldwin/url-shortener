require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const store = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  const isValidHttpUrl = (string) => {
    try {
      const newUrl = new URL(string);
      const pattern =
        /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/;
      return (newUrl.protocol === "http:" || newUrl.protocol === "https:") && pattern.test(string);
    } catch (err) {
      return false;
    }
  };
  if (!isValidHttpUrl(req.body.url)) {
    res.status("400").json({ error: "Invalid url" });
  }
  const urlData = { original_url: req.body.url, short_url: store.length + 1 };
  store.push(urlData);
  return res.json(urlData);
});

app.get("/api/shorturl/:id", (req, res) => {
  const isValidNumberString = (string) => {
    const pattern = /^[1-9][0-9]*/;
    return pattern.test(string);
  };
  console.log(req.params.id);
  if (!isValidNumberString(req.params.id)) {
    res.status("400").json({ error: "Wrong format" });
  }
  const id = parseInt(req.params.id);
  const index = store.findIndex((url) => url.short_url === id);
  if (index === -1) {
    res.status("400").json({ error: "No short URL found for the given input" });
  }
  res.redirect(store[index].original_url);
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
