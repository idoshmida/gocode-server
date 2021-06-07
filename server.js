const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  title: String, 
  image:String,
  description: String, 
  category:String,
  price: Number
});

const Product = mongoose.model("Product", ProductsSchema);

//midelware: for bodey read
app.use(express.json());




//home routing:
app.get("/", (req, res) => {
  res.send("hello ido");
});




//all products routing with query :
app.get("/products", (req, res) => {
  const { title } = req.query;
  Product.find({})
    .exec()
    .then((productsArr) => {
      if (title) {
        const productsFiltered = productsArr.filter((product) =>
          product.title.includes(title)
        );
        res.send(productsFiltered.length ? productsFiltered : "no data found");
      } else {
        res.send(productsArr);
      }
     });
});







//specific product routing
app.get("/products/:id", (req, res) => {
  Product.findOne({_id: req.params.id})
  .exec( (err, foundProduct) => {
    if (err) {
      res.send("error ocured");
      console.log("err");

    } else {
      console.log(foundProduct);
      res.send(foundProduct)
    }
  })
  
  });







//post a new product at the end of the products.json file
app.post("/products", (req, res) => {
  Product.insertMany( [
    { title: req.body.title,
      image: req.body.image,
      description: req.body.description, 
      category: req.body.category,
      price: req.body.price }]
  ).then( (addedProduct) => {res.send(addedProduct)});
});







// editing a product
app.put("/products/:id", (req, res) => {
    const { title, price, image, description, category } = req.body;
    // const { id } = req.params;

    Product.findOneAndUpdate(
      {_id: req.params.id},
      { title: title, description: description,  price: price, category: category, image: image  },
      (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log(data)
              }
      }  
    ).exec().then( () => res.send("done editing"))

});




//delete a product by id
app.delete("/products/:id", (req, res) => {
  Product.deleteOne({_id: req.params.id})
  .exec( (err, deletedProduct) => {
    if (err) {
      res.send("error ocured");
      console.log("err");
    } else {
      console.log(deletedProduct);
      res.send(deletedProduct)
    }
  })
});






mongoose
  .connect("mongodb://localhost/my_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(8080);
  });
