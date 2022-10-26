const fs = require("fs");

class Contenedor {
  constructor(path) {
    this.path = path;
  }

  async getAll() {
    const contenido = await fs.promises.readFile(this.path, "utf-8");
    return contenido;
  }

  async save(objeto) {
    let objetos = [];
    let lastId = 0;

    await this.getAll()
      .then((content) => {
        objetos = content.length == 0 ? "[]" : content;
        objetos = JSON.parse(objetos);

        objeto.id = 1;
        if (objetos.length > 0) {
          lastId = objetos[objetos.length - 1].id;
          objeto.id = lastId + 1;
        }

        objetos.push(objeto);
      })
      .then(() => {
        fs.promises
          .writeFile(this.path, JSON.stringify(objetos, null, 2))
          .then(() => {
            console.log("Objeto guardado con éxito");
          });
      })
      .catch((error) => error);
  }

  // Método auxiliar para la modificación y eliminación de la colección, sin tener que recurrir a guardarlos individualmente
  async saveAll(objetos) {
    await fs.promises
      .writeFile(this.path, JSON.stringify(objetos, null, 2))
      .then(() => console.log("Guardado exitoso"))
      .catch((error) => console.log(error));
  }

  async getById(identificador) {
    let objeto = null;

    await this.getAll()
      .then((content) => {
        let objetos = content.length == 0 ? "[]" : content;
        objetos = JSON.parse(objetos);
        objeto = objetos.filter((obj) => obj.id === identificador)[0];
      })
      .catch((error) => console.log(error));

    return objeto;
  }

  async deleteById(identificador) {
    let objetos = null;

    await this.getAll()
      .then((content) => {
        objetos = content.length == 0 ? "[]" : content;
        objetos = JSON.parse(objetos);
      })
      .then(() => {
        let obj = objetos.filter((obj) => obj.id == identificador)[0]; // Buscamos el objeto antees de proceeder a eliminarlo
        if (obj !== null && obj !== undefined) {
          objetos = objetos.filter((obj) => obj.id !== identificador);
          this.saveAll(objetos);
        } else {
          console.log("No se encontró el objeto de id " + identificador);
        }
      })
      .catch((error) => console.log(error));
  }

  async deleteAll() {
    let objetos = null;

    await this.getAll()
      .then((content) => {
        if (content !== "") {
          objetos = JSON.parse(content);
          objetos = objetos.filter((obj) => obj.id < 0);
        } else {
          objetos = "[]";
        }
      })
      .then(() => this.saveAll(objetos))
      .catch((error) => console.log(error));
  }
}

module.exports = Contenedor;
