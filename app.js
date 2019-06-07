
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res){

  let day = date.getDate();

  res.render("list", {listTitle: day, newItems: items});
});

app.post("/", function(req, res) {
  let item = req.body.task;

  if(req.body.list ==="Work"){
      workItems.push(item);
      res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newItems: workItems});
});

app.post("/work", function(req, res){
  let workItem = req.body.task;

  workItems.push(workItem);

  res.redirect("/work");
});

app.get("/about", function(req,res){
  res.render("about");
})

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});
