var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");

var demoSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

var Demo = mongoose.model("Demo", demoSchema);

var pasa = new Demo({
  name: "Pasa",
  age: 4,
  temperament: "Grouchy"
});

pasa.save(function(err, data) {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
