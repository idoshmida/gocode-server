const express = require("express");
const app = express();
const fs = require("fs");
const { toUnicode } = require("punycode");

//midelware: for bodey read
app.use(express.json())

//home routing:
app.get("/", (req, res) => {
    res.send("hello ido");
});

//all products routingwith query :
app.get("/products", (req, res) => {
  const { title } = req.query;
  fs.readFile("products.json", "utf8", (err, products) => {
    const productsArr = JSON.parse(products);
    if (title ) {
      const productsFiltered = productsArr.filter(
        (product) => product.title.includes(title));
      res.send(productsFiltered ? "no data found"  :  productsFiltered)

      // console.log(productsFiltered);

    } else {
      res.send(products);
    }
    });
  });

  //specific product routing
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
//post a new product at the end of the products.json file
app.post("/products", (req, res) => {
  
      fs.readFile("products.json", "utf8", (err, products) => { 
          const productsArr = JSON.parse(products);
          productsArr.push({
            "id":productsArr.length +1,
            "title":req.body.title,
            "price":req.body.price,
            "image":req.body.image,
            "category":req.body.category,
            "description":req.body.description
          })
          fs.writeFile("products.json", JSON.stringify(productsArr), (err)=> {
            console.log(err); res.send("secsess of post send")
          } )
      })
    })

// editing a product
app.put("/products/:id", (req, res) => {
  fs.readFile("products.json", "utf8", (err, products) => { 
    const productsArr = JSON.parse(products);
    let { title  , price, image, description , category} = req.body; 
    const { id } = req.params;

    const updatedProductsArr = productsArr.map((product) => {
      if (product.id === +id) { 

        //keeping the products properties in case of missing field in the PUT from the user:
        if (!title) {title = product.title} 
        if (!price) {price = product.price} 
        if (!image) {image = product.image} 
        if (!description) {description = product.description} 
        if (!category) {category = product.category} 

        return {
          ...product,
          title,
          price,
          image,
          description,
          category
        };
      } else {
        return product;
      }
    })
    fs.writeFile("products.json", JSON.stringify(updatedProductsArr), (err)=> {
      console.log(err); res.send("secsess of put send")
    } )
})
})

app.delete("/products/:id", (req, res) => {
  fs.readFile("products.json", "utf8", (err, products) => { 
    const productsArr = JSON.parse(products);

    const updatedProductsArr = productsArr.filter((product) => 
      product.id !== +req.params.id
    )
    fs.writeFile("products.json", JSON.stringify(updatedProductsArr), (err)=> {
      console.log(err); res.send("secsess of delete ")
    } )

  })

})


app.listen(8080);