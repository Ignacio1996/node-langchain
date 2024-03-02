const express = require("express");

const app = express();

app.post("/queryFiles", (req, res) => {
  const data = req.body;

  res.json({
    received: "Hello!",
  });
});

app.listen(process.env.PORT || "8080", () => {
  console.log("server.js 13 | listenning on port 8080");
});
