const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/products", (req, res) => {
    fs.readFile("products.json", "utf8", (err, products) => {
      res.send(products);
    });
  });

  app.get("/products/:id", (req, res) => {
    fs.readFile("products.json", "utf8", (err, products) => {
      const productsArr = JSON.parse(products);
      const productsFind = productsArr.find((item) => item.id === +req.params.id);
      if (productsFind) {
        res.send(productsFind);
      } else {
        res.status(404);
        res.send();
      }
    });
  });

// app.post("products/", (req, res) => {
//     fs.readFile("products.json", "utf8", (err, products) => {
//         const productsArr = JSON.parse(products);
//         productsArr.push()
//     })

//     })


app.listen(8080);