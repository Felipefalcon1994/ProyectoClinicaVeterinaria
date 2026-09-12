// **
// PASO 1: PROTECCIÓN DE LA PÁGINA
// Privilegio solamente a User admin

// Si NO hay sesión activa, redirigir al login
if (sessionStorage.getItem("sesionAdmin") !== "activa") {
    window.location.href = "login.html";
}

// ===========================================================
// PASO 2: BOTÓN SALIR (cerrar sesión)
// ===========================================================

const botonSalir = document.getElementById("cerrar-sesion");

botonSalir.addEventListener("click", function () {
    // Cierra la sesión del admin
    sessionStorage.removeItem("sesionAdmin");

    // Redirige al login
    window.location.href = "login.html";
});

// ===========================================================
// PASO 3: CARGAR PRODUCTOS DESDE LOCALSTORAGE
// ===========================================================

// Lista inicial (igual a la de app.js, por si es la primera vez)
const productosIniciales = [
    { id: "ME001", nombre: "Amoxibay 250mg", categoria: "Antibióticos", precio: 4200 },
    { id: "ME004", nombre: "Nexgard Masticable", categoria: "Antiparasitarios", precio: 9500 },
    { id: "ME005", nombre: "Bravecto Masticable", categoria: "Antiparasitarios", precio: 18900 },
    { id: "ME006", nombre: "Revolution Plus Gato", categoria: "Antiparasitarios", precio: 14500 },
    { id: "ME009", nombre: "Meloxicam 1mg", categoria: "Antiinflamatorios", precio: 4500 },
    { id: "ME011", nombre: "Clorhexidina Shampoo", categoria: "Dermatología", precio: 8900 },
    { id: "ME016", nombre: "Vetmedin 2.5mg", categoria: "Cardíaco", precio: 28000 },
    { id: "ME021", nombre: "Omega vet 3-6-9", categoria: "Suplementos", precio: 9900 }
];

// Leer lo guardado; si no hay, usar la lista inicial
const productosGuardados = JSON.parse(localStorage.getItem("productosVeterinaria"));

let productos;

if (productosGuardados && productosGuardados.length > 0) {
    productos = productosGuardados;  // usar lo del localStorage
} else {
    productos = productosIniciales;  // primera vez: usar lista inicial
    localStorage.setItem("productosVeterinaria", JSON.stringify(productos));
}

// ===========================================================
// PASO 4: RENDERIZAR LA TABLA DE PRODUCTOS
// ===========================================================

const tablaProductos = document.getElementById("tabla-productos");

function renderizarTabla() {
    // Limpiar el tbody antes de pintar
    tablaProductos.innerHTML = "";

    // Recorrer cada producto del arreglo
    productos.forEach(function (producto) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.id}</td>
            <td class="fw-semibold">${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-warning" data-accion="editar" data-id="${producto.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="${producto.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });
}

// Pintar por primera vez al cargar la página
renderizarTabla();

// ===========================================================
// PASO 5: AGREGAR PRODUCTO
// ===========================================================

//primero definir las const
const formularioAdmin = document.getElementById("formulario-admin");
const campoNombre = document.getElementById("prod-name");
const campoCategoria = document.getElementById("prod-categoria");
const campoPrecio = document.getElementById("prod-precio");
// Para editar: guarda qué producto estamos editando (null = no hay edición)
let idProductoEditando = null;
const botonSubmitAdmin = document.getElementById("btn-submit-admin");

// Escuchar el envío del formulario
formularioAdmin.addEventListener("submit", function (evento) {
    evento.preventDefault();//<--- para no recargar la pagina

    const nombre = campoNombre.value.trim();
    const categoria = campoCategoria.value.trim();
    const precio = Number(campoPrecio.value.trim());

    // Validar los tres campos
    const esValidoNombre = validarCampo(campoNombre, nombre.length >= 3, "error-prod-name");
    const esValidoCategoria = validarCampo(campoCategoria, categoria.length >= 2, "error-prod-categoria");
    const esValidoPrecio = validarCampo(campoPrecio, precio > 0, "error-prod-precio");

    // Si todo es válido, agregar el producto
    if (esValidoNombre && esValidoCategoria && esValidoPrecio) {

        if (idProductoEditando === null) {
            // --- MODO AGREGAR ---
            let mayorNumero = 0;
                productos.forEach(function (producto) {
                const numero = Number(producto.id.slice(2));  // quita las letras "ME" → "009" → 9
                if (numero > mayorNumero) {
                    mayorNumero = numero;
                }
            });    

            const nuevoProducto = {
                id: "ME" + String(mayorNumero + 1).padStart(3, "0"),
                nombre: nombre,
                categoria: categoria,
                precio: precio
            };
            productos.push(nuevoProducto);
            alert("Producto " + nuevoProducto.nombre + " agregado correctamente");
        } else {
            // --- MODO EDITAR: actualizar el producto existente ---
            const productoEditado = productos.find(function (p) { return p.id === idProductoEditando; });
            productoEditado.nombre = nombre;
            productoEditado.categoria = categoria;
            productoEditado.precio = precio;
            alert("Producto " + productoEditado.nombre + " actualizado correctamente");
        }

        // Guardar en localStorage
        localStorage.setItem("productosVeterinaria", JSON.stringify(productos));

        // Repintar la tabla
        renderizarTabla();

        // Limpiar formulario y volver al modo "agregar"
        formularioAdmin.reset();
        idProductoEditando = null;
        botonSubmitAdmin.textContent = "Agregar Producto";
    }
});

// Función que marca un campo como válido o inválido
function validarCampo(input, condicion, idError) {
    const feedback = document.getElementById(idError);

    if (!condicion) {
        // Campo inválido: borde rojo + mensaje visible
        input.classList.add("is-invalid");//<---FUNCION DE BOOTSTRAP
        input.classList.remove("is-valid"); //<---FUNCION DE BOOTSTRAP
        if (feedback) feedback.style.display = "block";
        return false;
    } else {
        // Campo válido: borde verde + mensaje oculto
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        if (feedback) feedback.style.display = "none";
        return true;
    }
}


// ===========================================================
// PASO 6: ELIMINAR PRODUCTO
// ===========================================================

// Escuchamos clicks en TODA la tabla (los botones "suben" el click hasta aquí)
tablaProductos.addEventListener("click", function (evento) {

    // ¿El clic fue sobre un botón de acción? (editar o eliminar)
    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;   // si no fue un botón de acción, salimos

    const idProducto = boton.dataset.id;
    const accion = boton.dataset.accion;

    // --- ACCIÓN: ELIMINAR ---
    if (accion === "eliminar") {

        // Buscar el producto para mostrar su nombre en la pregunta
        const producto = productos.find(function (p) { return p.id === idProducto; });

        if (confirm("¿Seguro que deseas eliminar '" + producto.nombre + "'?")) {

            // 1. Quitar del arreglo el que tenga ese id
            productos = productos.filter(function (p) { return p.id !== idProducto; });

            // 2. Guardar en localStorage
            localStorage.setItem("productosVeterinaria", JSON.stringify(productos));

            // 3. Repintar la tabla
            renderizarTabla();
        }
    }

        // --- ACCIÓN: EDITAR ---
    if (accion === "editar") {

        // Buscar el producto que vamos a editar
        const producto = productos.find(function (p) { return p.id === idProducto; });

        // 1. Llenar el formulario con sus datos
        campoNombre.value = producto.nombre;
        campoCategoria.value = producto.categoria;
        campoPrecio.value = producto.precio;

        // 2. Recordar qué producto estamos editando
        idProductoEditando = producto.id;

        // 3. Cambiar el texto del botón
        botonSubmitAdmin.textContent = "Guardar Cambios";
    }

});