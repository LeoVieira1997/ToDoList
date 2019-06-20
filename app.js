
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb+srv://admin-leonardo:Test123@cluster0-fgqx7.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res){
  Item.find(function(err, results){

    if(results.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else {
          console.log("Successfully saved default items to database.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newItems: results});
    }
  });

});

app.get("/:customList", function(req, res) {
  const customList = _.capitalize(req.params.customList);

  List.findOne({name: customList}, function(err, results){
    if(!err){
      if(!results){
        // Create a new document
        const list = new List ({
          name: customList,
          items: defaultItems
        });
        list.save();

        res.redirect("/" + customList);
      } else {
        // Load a page with document's information
        res.render("list", {listTitle: customList, newItems: results.items});
      }
    }
  });

});

app.post("/", function(req, res) {
  const itemName = req.body.task;

  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("Success");
        res.redirect("/");
      }
    });
  } else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }

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
