var express = require("express");

var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  var campgrounds = [
    {
      name: "Hızır Kamp",
      image:
        "https://kampbros.com/file/2019/04/Kazdagi-Balikesir-kampbros-89345.jpg"
    },
    {
      name: "Akaleos Kamp Alanı",
      image:
        "https://kampbros.com/file/2019/04/Akaleos-kamp-alan%C4%B1-kampbros-654.jpg"
    },
    {
      name: "Camp Ant",
      image:
        "https://kampbros.com/file/2019/04/erdek-cadir-kampi-ant-kamping.jpg"
    }
  ];

  res.render("campgrounds", { campgrounds });
});

app.listen(3000, function(error) {
  if (error) throw error;
  console.log("Server is running on port 3000");
});