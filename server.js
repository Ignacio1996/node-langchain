const express = require("express");
const bodyParser = require("body-parser");
const { initPineconeClient, queryingPineconeAndGPT } = require("./data");

const indexName = "node-lang";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/queryFiles", async (req, res) => {
  const { query } = req.body;

  const client = await initPineconeClient();

  console.log("server.js 14 | got client", client);

  const result = await queryingPineconeAndGPT(client, indexName, query);

  if (query) {
    res.json({
      result: result,
    });
  } else {
    res.json({
      error: "no data",
    });
  }
});

app.post("/addDataToPinecone", (req, res) => {}); // extend to upload files to pinecone index to fetch more data

app.listen(process.env.PORT || "8080", () => {
  console.log("server.js 13 | listenning on port 8080");
});
