const contenedorItems = document.getElementById("contenedor-items");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const botonAgregar = document.getElementById("boton-agregar");
const inputBuscador = document.getElementById("input-buscador");
const mensajeFeedback = document.getElementById("mensaje-feedback");
const mensajeInfo = document.getElementById("mensaje-info");

const CLAVE_STORAGE = "productosStock";

function guardarEnStorage(lista) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
}

function cargarDesdeStorage() {
  const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
  return datosGuardados ? JSON.parse(datosGuardados) : null;
}

let productos = cargarDesdeStorage() ?? [
  { id: 1, nombre: "Yerba", precio: 2500 },
  { id: 2, nombre: "Arroz", precio: 1800 },
  { id: 3, nombre: "Jabón", precio: 900 },
];

function obtenerProductosDesdeServidor() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const fallo = Math.random() < 0.3;

      if (fallo) {
        reject(new Error("No se pudo conectar con el servidor"));
      } else {
        resolve(productos);
      }
    }, 2000);
  });
}

function mostrarFeedback(mensaje, esError) {
  mensajeFeedback.textContent = mensaje;
  mensajeFeedback.style.color = esError ? "#e74c3c" : "#27ae60";
}

function renderizarProductos(lista) {
  contenedorItems.innerHTML = "";

  for (const producto of lista) {
    const { id, nombre, precio } = producto;

    contenedorItems.innerHTML += `
      <div class="item-producto" data-id="${id}">
        <div>
          <h3>${nombre}</h3>
          <p>$${precio}</p>
        </div>
        <button class="boton-eliminar" data-id="${id}">Eliminar</button>
      </div>
    `;
  }
}

renderizarProductos(productos);

botonAgregar.addEventListener("click", () => {
  const nombreNuevo = inputNombre.value;
  const precioNuevo = parseFloat(inputPrecio.value);

  if (nombreNuevo === "" || isNaN(precioNuevo)) {
    mostrarFeedback("⚠️ Completá el nombre y el precio antes de agregar.", true);
    return;
  }

  const nuevoProducto = {
    id: Date.now(),
    nombre: nombreNuevo,
    precio: precioNuevo,
  };

  productos.push(nuevoProducto);
  renderizarProductos(productos);
  guardarEnStorage(productos);

  mostrarFeedback(`✅ "${nombreNuevo}" agregado correctamente.`, false);

  inputNombre.value = "";
  inputPrecio.value = "";
});

contenedorItems.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("boton-eliminar")) {
    const idAEliminar = Number(evento.target.dataset.id);

    const productoEliminado = productos.find((producto) => producto.id === idAEliminar);

    productos = productos.filter((producto) => producto.id !== idAEliminar);
    renderizarProductos(productos);
    guardarEnStorage(productos);

    mostrarFeedback(`🗑️ "${productoEliminado?.nombre ?? "producto"}" eliminado.`, true);
  }
});

inputBuscador.addEventListener("keyup", () => {
  const textoBuscado = inputBuscador.value.toLowerCase();

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoBuscado)
  );

  renderizarProductos(productosFiltrados);
});

setTimeout(() => {
  mensajeInfo.textContent = "🔔 Cotización del dólar hoy: $1200";
}, 4000);

async function cargarProductosIniciales() {
  mostrarFeedback("⏳ Cargando productos...", false);

  try {
    const productosCargados = await obtenerProductosDesdeServidor();
    mostrarFeedback(`✔️ ${productosCargados.length} productos cargados`, false);
  } catch (error) {
    mostrarFeedback("⚠️ No se pudo procesar la operación, intentá de nuevo", true);
  } finally {
    renderizarProductos(productos);
  }
}

cargarProductosIniciales();
