document.addEventListener("DOMContentLoaded", () => {
  const contenedorProductos = document.getElementById("productos");
  const contenedorAgregarProducto = document.getElementById("agregarProducto");

  const productos = [];

  // validación de imagenes predefinidas en caso de que no suban una
  const obtenerImagenPorCategoria = (categoria) => {
    if (categoria === "Poleras") {
      return `img/satoru 2.jpg`;
    } else if (categoria === "Hoodies") {
      return `img/togahoodie.jpg`;
    } else if (categoria === "AnimeBags") {
      return `img/bolsaanime.png`;
    } else if (categoria === "Cuadros") {
      return `img/cuadroanime.png`;
    } else {
      return `img/gatito.jpg`;
    }
  };

  const mostrarProductos = () => {
    if (productos.length === 0) {
      return '<p>No hay productos agregados aún.</p>';
    }

    let tabla = `
      <h1>Gestión de Productos</h1>
      <table class="table table-dark table-striped table-hover mt-3">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Tallas / Cantidad</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    productos.forEach((producto, indice) => {
      let tallasHTML = producto.tallas.map(t => `${t.talla} x${t.cantidad}`).join("<br>");
      tabla += `
        <tr>
          <td><img src="${producto.imagen}" class="img-tabla" alt="${producto.nombre}"></td>
          <td>${producto.nombre}</td>
          <td>${producto.precio}</td>
          <td>${tallasHTML}</td>
          <td>${producto.categoria}</td>
          <td>${producto.descripcion}</td>
          <td><button class="btn btn-danger btn-sm btn-eliminar" data-indice="${indice}">Eliminar</button></td>
        </tr>
      `;
    });

    tabla += `</tbody></table>`;
    return tabla;
  };

  const mostrarFormularioAgregar = () => `
    <h1>Añadir un Producto</h1>
    <form id="formAgregarProducto" class="form-admin">
      <label class="form-label" for="nombre">Nombre del producto</label>
      <input class="form-control" type="text" id="nombre" required>

      <label class="form-label" for="precio">Precio</label>
      <input class="form-control" type="number" id="precio" required>

      <label class="form-label">Tallas y Cantidad</label>
      <div id="contenedorTallas">
        <div class="row mb-2">
          <div class="col-5">
            <select class="form-select talla" required>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
          <div class="col-4">
            <input type="number" class="form-control cantidad" placeholder="Cantidad" min="1" value="1" required>
          </div>
          <div class="col-3 d-flex gap-1">
            <button type="button" class="btn btn-secondary btn-agregar-talla">+</button>
            <button type="button" class="btn btn-danger btn-eliminar-talla">-</button>
          </div>
        </div>
      </div>

      <label class="form-label" for="categoria">Categoría</label>
      <select class="form-select" id="categoria" required>
        <option value="Poleras">Poleras</option>
        <option value="Hoodies">Hoodies</option>
        <option value="AnimeBags">AnimeBags</option>
        <option value="Cuadros">Cuadros</option>
      </select>

      <label class="form-label" for="imagenProducto">Imagen (opcional)</label>
      <input type="file" id="imagenProducto" class="form-control" accept="image/*">

      <label class="form-label" for="descripcion">Descripción</label>
      <textarea class="form-control" id="descripcion" rows="6" required></textarea>

      <button class="btn btn-success mt-2" type="submit">Agregar Producto</button>
    </form>
    <p id="mensajeAgregarProducto" class="mt-2"></p>
  `;

  contenedorProductos.innerHTML = mostrarProductos();
  contenedorAgregarProducto.innerHTML = mostrarFormularioAgregar();

  // borrar productos
  const manejarEliminarProductos = () => {
    const botonesEliminar = contenedorProductos.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(btn => {
      btn.addEventListener("click", e => {
        const indice = parseInt(e.target.getAttribute("data-indice"));
        productos.splice(indice, 1);
        contenedorProductos.innerHTML = mostrarProductos();
        manejarEliminarProductos();
      });
    });
  };

  manejarEliminarProductos();

  // tallas y cantidades
  contenedorAgregarProducto.addEventListener("click", (e) => {
    const fila = e.target.closest(".row");
    if (!fila) return;

    // añadir opcion detallas
    if (e.target.classList.contains("btn-agregar-talla")) {
      const nuevaFila = fila.cloneNode(true);
      nuevaFila.querySelector(".cantidad").value = 1;
      contenedorAgregarProducto.querySelector("#contenedorTallas").appendChild(nuevaFila);
    }

    // borrar opcion de tallas
    if (e.target.classList.contains("btn-eliminar-talla")) {
      const contenedorTallas = contenedorAgregarProducto.querySelector("#contenedorTallas");
      if (contenedorTallas.querySelectorAll(".row").length > 1) {
        fila.remove();
      }
    }
  });

  const formulario = document.getElementById("formAgregarProducto");
  const mnsj = document.getElementById("mensajeAgregarProducto");

  formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value.trim();

    const filasTallas = contenedorAgregarProducto.querySelectorAll("#contenedorTallas .row");
    const tallas = Array.from(filasTallas).map(fila => ({
      talla: fila.querySelector(".talla").value,
      cantidad: parseInt(fila.querySelector(".cantidad").value)
    }));

    const inputImagen = document.getElementById("imagenProducto");
    let imagen = obtenerImagenPorCategoria(categoria);
    if (inputImagen.files && inputImagen.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagen = e.target.result;
        productos.push({ nombre, precio, tallas, categoria, descripcion, imagen });
        contenedorProductos.innerHTML = mostrarProductos();
        manejarEliminarProductos();
        mnsj.textContent = `Producto "${nombre}" agregado correctamente!`;
        mnsj.style.color = "#00ff88";
        formulario.reset();
      };
      reader.readAsDataURL(inputImagen.files[0]);
    } else {
      productos.push({ nombre, precio, tallas, categoria, descripcion, imagen });
      contenedorProductos.innerHTML = mostrarProductos();
      manejarEliminarProductos();
      mnsj.textContent = `Producto "${nombre}" agregado correctamente!`;
      mnsj.style.color = "#00ff88";
      formulario.reset();
    }
  });
});
