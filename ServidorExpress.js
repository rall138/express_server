const Contenedor = require("./Contenedor.js");
const express = require("express");
const app = express();
const PORT = 8080;

let cont = null;

app.get("/productos", (req, resp) => {
  cont
    .getAll()
    .then((result) => {
      const allProducts = JSON.parse(result);
      resp.send(allProducts);
    })
    .catch((error) => console.log(error));
});

app.get("/productoRandom", (req, resp) => {
  cont
    .getAll()
    .then((result) => {
      const allProducts = JSON.parse(result);
      const randomValue = Math.floor(Math.random() * allProducts.length);
      resp.send(allProducts[randomValue]);
    })
    .catch((error) => console.log(error));
});

app.listen(PORT, () => {
  cont = new Contenedor("./productos.txt");

  cont
    .save({
      id: 0,
      title: "Son Goku",
      price: 150,
      thumbnail: "http://img.png",
    })
    .then(() => {
      cont
        .save({
          id: 0,
          title: "Krillin",
          price: 200,
          thumbnail: "http://img.png",
        })
        .then(() => {
          cont.save({
            id: 0,
            title: "Yamcha",
            price: 70,
            thumbnail: "http://img.png",
          });
          console.log(`Servidor inicializado corriendo en ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
});
