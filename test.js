var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true
});

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

var camp = new Campground({
  name: "Hızır Kamp",
  image:
    "https://kampbros.com/file/2019/04/Kazdagi-Balikesir-kampbros-89345.jpg",
  description:
    "Hızır kamp, Binbir Pınarlı Kazdağları’nın Kirişlik Vadisi’nin eteğinde bir kamp alanıdır. Mehmetalan Köyüne 2 km uzaklıkta olan kamp alanı Kaz Dağları Milli Parkı’nın yürüyüş mesafesindedir. Hızır Kamp’ın içinde akan Zeytinli çayı’nın serin suyunda yüzmek, Kaz Dağları’nın muhteşem doğasında yürüyüş yapmak burayı tercih edenler için vazgeçilmez bir yerdir.  Dışarıya kapalı olmaları, rezervasyonsuz veya günübirlikçi almamaları  kalite sağlamalarındaki en büyük etken. "
});

camp.save(function(err, data) {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
