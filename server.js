const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/queryFiles", async (req, res) => {
  const { query } = req.body;

  console.log("server.js 7 | body", query, !query);

  if (query) {
    res.json({
      received: "Hello!",
    });
  } else {
    res.json({
      error: "no data",
    });
  }
});

app.listen(process.env.PORT || "8080", () => {
  console.log("server.js 13 | listenning on port 8080");
});
