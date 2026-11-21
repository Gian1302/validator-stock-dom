const contenedorItems = document.getElementById("contenedor-items");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const botonAgregar = document.getElementById("boton-agregar");
const inputBuscador = document.getElementById("input-buscador");
const mensajeFeedback = document.getElementById("mensaje-feedback");

let productos = [
  { id: 1, nombre: "Yerba", precio: 2500 },
  { id: 2, nombre: "Arroz", precio: 1800 },
  { id: 3, nombre: "Jabón", precio: 900 },
];

function renderizarProductos(lista) {
  contenedorItems.innerHTML = "";

  for (const producto of lista) {
    contenedorItems.innerHTML += `
      <div class="item-producto" data-id="${producto.id}">
        <div>
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio}</p>
        </div>
        <button class="boton-eliminar" data-id="${producto.id}">Eliminar</button>
      </div>
    `;
  }
}

renderizarProductos(productos);

botonAgregar.addEventListener("click", () => {
  const nombreNuevo = inputNombre.value;
  const precioNuevo = parseFloat(inputPrecio.value);

  if (nombreNuevo === "" || isNaN(precioNuevo)) {
    mensajeFeedback.textContent = "⚠️ Completá el nombre y el precio antes de agregar.";
    mensajeFeedback.style.color = "#e74c3c";
    return;
  }

  const nuevoProducto = {
    id: Date.now(),
    nombre: nombreNuevo,
    precio: precioNuevo,
  };

  productos.push(nuevoProducto);
  renderizarProductos(productos);

  mensajeFeedback.textContent = `✅ "${nombreNuevo}" agregado correctamente.`;
  mensajeFeedback.style.color = "#27ae60";

  inputNombre.value = "";
  inputPrecio.value = "";
});

contenedorItems.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("boton-eliminar")) {
    const idAEliminar = Number(evento.target.dataset.id);

    const productoEliminado = productos.find((producto) => producto.id === idAEliminar);

    productos = productos.filter((producto) => producto.id !== idAEliminar);
    renderizarProductos(productos);

    mensajeFeedback.textContent = `🗑️ "${productoEliminado.nombre}" eliminado.`;
    mensajeFeedback.style.color = "#e74c3c";
  }
});

inputBuscador.addEventListener("keyup", () => {
  const textoBuscado = inputBuscador.value.toLowerCase();

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoBuscado)
  );

  renderizarProductos(productosFiltrados);
});