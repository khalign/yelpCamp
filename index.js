var express = require('express');

var app = express();

app.listen(port, error => {
    if (error) throw error;
    console.log("Server is running on port " + port);
  });