document.addEventListener("DOMContentLoaded", () => {
  const contenedorProductos = document.getElementById("productos");
  const contenedorAgregarProducto = document.getElementById("agregarProducto");

  // Arreglo para almacenar productos
  const productos = [];
// Función para obtener imagen según categoría
const obtenerImagenPorCategoria = (categoria) => {
  if (categoria === "Poleras") {
    return `<img src="img/satoru 2.jpg" class="img-tabla" alt="Polera">`;
  } else if (categoria === "Hoodies") {
    return `<img src="img/togahoodie.jpg" class="img-tabla" alt="Hoodie">`;
  } else if (categoria === "AnimeBags") {
    return `<img src="img/bolsaanime.png" class="img-tabla" alt="Anime Bag">`;
  } else if (categoria === "Cuadros") {
    return `<img src="img/cuadroanime.png" class="img-tabla" alt="Cuadro">`;
  } else {
    return `<img src="img/gatito.jpg" class="img-tabla" alt="Producto">`;
  }
};

// Función para renderizar la tabla de productos
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
          <th>Talla</th>
          <th>Categoría</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  productos.forEach((producto, indice) => {
    const imagen = obtenerImagenPorCategoria(producto.categoria);
    tabla += `
      <tr>
        <td>${imagen}</td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>${producto.talla}</td>
        <td>${producto.categoria}</td>
        <td>${producto.descripcion}</td>
        <td><button class="btn btn-danger btn-sm btn-eliminar" data-indice="${indice}">Eliminar</button></td>
      </tr>
    `;
  });

  tabla += `</tbody></table>`;
  return tabla;
};


  // Función para renderizar el formulario de agregar productos
  const mostrarFormularioAgregar = () => `
    <h1>Añadir un Producto</h1>
    <form id="formAgregarProducto" class="form-admin">
      <label class="form-label" for="nombre">Nombre del producto</label>
      <input class="form-control" type="text" id="nombre" required>

      <label class="form-label" for="precio">Precio</label>
      <input class="form-control" type="number" id="precio" required>

      <label class="form-label" for="talla">Talla</label>
      <p class="tamañoletrita">*DEJAR EN "S" SI NO APLICA.</p>
      <select class="form-select" id="talla" required>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>

      <label class="form-label" for="categoria">Categoría</label>
      <select class="form-select" id="categoria" required>
        <option value="Poleras">Poleras</option>
        <option value="Hoodies">Hoodies</option>
        <option value="AnimeBags">AnimeBags</option>
        <option value="Cuadros">Cuadros</option>
      </select>

      <label class="form-label" for="descripcion">Descripción</label>
      <textarea class="form-control" id="descripcion" rows="6" required></textarea>

      <button class="btn btn-success mt-2" type="submit">Agregar Producto</button>
    </form>
    <p id="mensajeAgregarProducto" class="mt-2"></p>
  `;

  // Render inicial
  contenedorProductos.innerHTML = mostrarProductos();
  contenedorAgregarProducto.innerHTML = mostrarFormularioAgregar();

  // Función para manejar la eliminación de productos
  const manejarEliminarProductos = () => {
    const botonesEliminar = contenedorProductos.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(btn => {
      btn.addEventListener("click", e => {
        const indice = parseInt(e.target.getAttribute("data-indice"));
        productos.splice(indice, 1);
        contenedorProductos.innerHTML = mostrarProductos();
        manejarEliminarProductos(); // Reaplicar listeners
      });
    });
  };

  manejarEliminarProductos(); // Inicial

  // Manejar el envío del formulario
  const formulario = document.getElementById("formAgregarProducto");
  const mnsj = document.getElementById("mensajeAgregarProducto");

  formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const talla = document.getElementById("talla").value;
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value.trim();

    productos.push({ nombre, precio, talla, categoria, descripcion });
    mnsj.textContent = `Producto "${nombre}" agregado correctamente!`;
    mnsj.style.color = "#00ff88";
    formulario.reset();

    // Actualizar la tabla de productos
    contenedorProductos.innerHTML = mostrarProductos();
    manejarEliminarProductos(); // Reaplicar listeners
  });
});
