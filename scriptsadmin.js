document.addEventListener("DOMContentLoaded", () => {
  const contenedorProductos = document.getElementById("productos");
  const contenedorAgregarProducto = document.getElementById("agregarProducto");

  const productos = []; // ya que no hay base de datos declaro arreglo para guardar los productos

  // imagenes predefinidas que estan en la carpeta img en caso de que no se suba alguna a la hora de añadir producto
  const obtenerImagenPorCategoria = (categoria) => {
    if (categoria === "Poleras") return "img/satoru 2.jpg";
    if (categoria === "Hoodies") return "img/togahoodie.jpg";
    if (categoria === "AnimeBags") return "img/bolsaanime.png";
    if (categoria === "Cuadros") return "img/cuadroanime.png";
    return "img/gatito.jpg";
  };


  const mostrarProductos = () => {
    if (productos.length === 0) {
      return '<p>No hay productos agregados aún.</p>'; // en caso de que no se hayan añadido productos aún, caso contrario, se muestra "tabla" que contiene los datos del producto.
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
      const tallasHTML = (producto.tallas || []).map(t => `${t.talla} x${t.cantidad}`).join("<br>");
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

  // logica para agregar productos en el apartado de "Productos"
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


  // boton pa eliminar los productos en el apartado "Productos"
  const manejarEliminarProductos = () => {
    const botonesEliminar = contenedorProductos.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const indice = parseInt(e.target.getAttribute("data-indice"));
        if (!Number.isNaN(indice)) {
          productos.splice(indice, 1);
          contenedorProductos.innerHTML = mostrarProductos();
          manejarEliminarProductos();
        }
      });
    });
  };
  manejarEliminarProductos();

  // boton pa agregar el producto en el apartado "Productos"
  contenedorAgregarProducto.addEventListener("click", (e) => {
    const fila = e.target.closest(".row");
    if (!fila) return;

    // agregar mas tallas
    if (e.target.classList.contains("btn-agregar-talla")) {
      const nuevaFila = fila.cloneNode(true);
      const cantidadInput = nuevaFila.querySelector(".cantidad");
      if (cantidadInput) cantidadInput.value = 1;
      contenedorAgregarProducto.querySelector("#contenedorTallas").appendChild(nuevaFila);
    }

    // borrar tallas 
    if (e.target.classList.contains("btn-eliminar-talla")) {
      const contenedorTallas = contenedorAgregarProducto.querySelector("#contenedorTallas");
      const filas = contenedorTallas.querySelectorAll(".row");
      if (filas.length > 1) fila.remove();
    }
  });

  const formulario = document.getElementById("formAgregarProducto");
  const mensaje = document.getElementById("mensajeAgregarProducto");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value.trim();

    // recoger tallas
    const filasTallas = contenedorAgregarProducto.querySelectorAll("#contenedorTallas .row");
    const tallas = [];
    filasTallas.forEach(fila => {
      const cantidad = parseInt(fila.querySelector(".cantidad").value, 10) || 0;
      if (cantidad > 0) { 
        const talla = fila.querySelector(".talla").value;
        tallas.push({ talla, cantidad });
      }
    });
    

    const inputImagen = document.getElementById("imagenProducto");
    let imagen = obtenerImagenPorCategoria(categoria);

    if (inputImagen.files && inputImagen.files[0]) {
      const lector = new FileReader(); // en caso de que suban foto
      lector.onload = function(e) {
        imagen = e.target.result;
        productos.push({ nombre, precio, tallas, categoria, descripcion, imagen });
        contenedorProductos.innerHTML = mostrarProductos();
        manejarEliminarProductos();
        mensaje.textContent = `Producto "${nombre}" agregado correctamente!`;
        mensaje.style.color = "green";
        formulario.reset();
        // dejar solo una fila de tallas 
        const contenedorT = contenedorAgregarProducto.querySelector("#contenedorTallas");
        contenedorT.innerHTML = contenedorT.firstElementChild.outerHTML;
      };
      lector.readAsDataURL(inputImagen.files[0]);
    } else {
      // sin imagen subida se usa la predefinida en el codigo
      productos.push({ nombre, precio, tallas, categoria, descripcion, imagen });
      contenedorProductos.innerHTML = mostrarProductos();
      manejarEliminarProductos();
      mensaje.textContent = `Producto "${nombre}" agregado correctamente!`;
      mensaje.style.color = "green";
      formulario.reset();
      const contenedorT = contenedorAgregarProducto.querySelector("#contenedorTallas");
      contenedorT.innerHTML = contenedorT.firstElementChild.outerHTML;
    }
  });
});
