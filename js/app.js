/**
 * Lógica y validación interactiva de formularios
 * Proyecto: Veterinaria San Marcos
 * DSY1104 - Evaluación Parcial 1
 */

document.addEventListener('DOMContentLoaded', () => {

  const formRegistro = document.getElementById('formulario-registro');
  
  // Arreglo de JS para Regiones y Comunas requerido por evaluación
  const divisionTerritorial = [
    { region: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
    { region: "Región Metropolitana", comunas: ["Santiago", "Puente Alto", "Maipú", "Providencia"] },
    { region: "Región de O'Higgins", comunas: ["Rancagua", "Machalí", "Rengo", "San Fernando"] }
  ];

  const regRegion = document.getElementById('regRegion');
  const regComuna = document.getElementById('regComuna');


  // 1. Cargar las Regiones al select
  if (regRegion && regComuna) {
    divisionTerritorial.forEach(item => {
      const option = document.createElement('option');
      option.value = item.region;
      option.textContent = item.region;
      regRegion.appendChild(option);
    });

    // 2. Evento: Al cambiar región, cargar comunas[cite: 4]
    regRegion.addEventListener('change', (e) => {
      const regionSeleccionada = e.target.value;
      regComuna.innerHTML = '<option value="" selected disabled>Seleccione la comuna...</option>';
      regComuna.disabled = false;

      const dataRegion = divisionTerritorial.find(r => r.region === regionSeleccionada);
      if (dataRegion) {
        dataRegion.comunas.forEach(comuna => {
          const opt = document.createElement('option');
          opt.value = comuna;
          opt.textContent = comuna;
          regComuna.appendChild(opt);
        });
      }
    });
  }

  // 3. Validación al hacer Submit en Registro
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();

      const rNombre = document.getElementById('regNombre');
      const rCorreo = document.getElementById('regCorreo');
      const rPass = document.getElementById('regPassword');
      const rConfPass = document.getElementById('regConfirmPassword');

      const dominiosPermitidos = ['@duocuc.cl', '@profesor.duoc.cl', '@gmail.com'];
      
      const vNombre = validarCampo(rNombre, rNombre.value.trim().length >= 3 && rNombre.value.length <= 50, 'error-regNombre');
      const vCorreo = validarCampo(rCorreo, dominiosPermitidos.some(d => rCorreo.value.trim().toLowerCase().endsWith(d)), 'error-regCorreo');
      const vPass = validarCampo(rPass, rPass.value.length >= 4 && rPass.value.length <= 10, 'error-regPassword');
      const vConfPass = validarCampo(rConfPass, rConfPass.value === rPass.value && rConfPass.value !== '', 'error-regConfirmPassword');
      const vRegion = validarCampo(regRegion, regRegion.value !== '', 'error-regRegion');
      const vComuna = validarCampo(regComuna, regComuna.value !== '', 'error-regComuna');

      if (vNombre && vCorreo && vPass && vConfPass && vRegion && vComuna) {
        document.getElementById('alerta-registro-exito').classList.remove('d-none');
        formRegistro.reset();
        regComuna.disabled = true;
        setTimeout(() => document.getElementById('alerta-registro-exito').classList.add('d-none'), 5000);
      }
    });
  }

  // =========================================================================
  // LÓGICA DE TIENDA Y CARRITO CON CATÁLOGO OFICIAL
  // =========================================================================
  
    // Productos: se cargan del localStorage (los gestiona el panel admin)
  let inventario = JSON.parse(localStorage.getItem("productosVeterinaria")) || [];

  // Si aún no hay nada guardado (primera vez), sembrar con el catálogo inicial
  if (inventario.length === 0) {
    inventario = [
      { id: "ME001", nombre: "Amoxibay 250mg", categoria: "Antibióticos", precio: 4200, img: "https://plus.unsplash.com/premium_photo-1786961711020-1b55448cedb2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: "ME004", nombre: "Nexgard Masticable", categoria: "Antiparasitarios", precio: 9500, img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop" },
      { id: "ME005", nombre: "Bravecto Masticable", categoria: "Antiparasitarios", precio: 18900, img: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=400&auto=format&fit=crop" },
      { id: "ME006", nombre: "Revolution Plus Gato", categoria: "Antiparasitarios", precio: 14500, img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop" },
      { id: "ME009", nombre: "Meloxicam 1mg", categoria: "Antiinflamatorios", precio: 4500, img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400&auto=format&fit=crop" },
      { id: "ME011", nombre: "Clorhexidina Shampoo", categoria: "Dermatología", precio: 8900, img: "https://images.unsplash.com/photo-1597595735781-6a57fb8e3e3d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: "ME016", nombre: "Vetmedin 2.5mg", categoria: "Cardíaco", precio: 28000, img: "https://images.unsplash.com/photo-1673134768453-ffaf2f279b81?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: "ME021", nombre: "Omega vet 3-6-9", categoria: "Suplementos", precio: 9900, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=400&auto=format&fit=crop" }
    ];
    localStorage.setItem("productosVeterinaria", JSON.stringify(inventario));
  }

  let carrito = JSON.parse(localStorage.getItem('carritoVeterinaria')) || [];
  
  const contProductos = document.getElementById('contenedor-productos');
  const contCarrito = document.getElementById('items-carrito');
  const spanContador = document.getElementById('contador-carrito');
  const spanTotal = document.getElementById('total-carrito');

  // Renderizar productos en HTML
  if (contProductos) {
    inventario.forEach(prod => {
      const div = document.createElement('div');
      div.className = 'col-12 col-md-6 col-lg-3';
      div.innerHTML = `
        <div class="card h-100 border-0 shadow-sm service-card">
          <img src="${prod.img}" class="card-img-top" alt="${prod.nombre}" style="height:200px; object-fit:cover;">
          <div class="card-body text-center d-flex flex-column">
            <span class="badge bg-secondary mb-2 align-self-center">${prod.categoria}</span>
            <h5 class="card-title fw-bold flex-grow-1">${prod.nombre}</h5>
            <p class="text-primary-custom fs-4 fw-bold">$${prod.precio.toLocaleString('es-CL')}</p>
            <!-- Fíjate en las comillas simples dentro de agregarAlCarrito('${prod.id}') -->
            <button class="btn btn-warning fw-bold text-dark w-100 mt-auto" onclick="agregarAlCarrito('${prod.id}')">Añadir al carrito</button>
          </div>
        </div>
      `;
      contProductos.appendChild(div);
    });
  }

  // Función global para añadir al carrito
  window.agregarAlCarrito = (id) => {
    const producto = inventario.find(p => p.id === id);
    const itemEnCarrito = carrito.find(p => p.id === id);

    if (itemEnCarrito) {
      itemEnCarrito.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
  };

  // Función global para quitar del carrito
  window.quitarDelCarrito = (id) => {
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarrito();
  };

  // Guardar en LocalStorage y renderizar panel lateral[cite: 4]
  function actualizarCarrito() {
    localStorage.setItem('carritoVeterinaria', JSON.stringify(carrito));
    renderizarCarrito();
  }

  function renderizarCarrito() {
    if (!contCarrito) return;
    
    contCarrito.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;

    if (carrito.length === 0) {
      contCarrito.innerHTML = '<p class="text-muted text-center mt-4">Tu carrito está vacío.</p>';
    } else {
      carrito.forEach(item => {
        total += item.precio * item.cantidad;
        cantidadTotal += item.cantidad;
        contCarrito.innerHTML += `
          <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
            <div>
              <h6 class="mb-0 fw-bold">${item.nombre}</h6>
              <small class="text-muted">$${item.precio.toLocaleString('es-CL')} x ${item.cantidad}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="quitarDelCarrito(${item.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
      });
    }

    if (spanContador) spanContador.textContent = cantidadTotal;
    if (spanTotal) spanTotal.textContent = `$${total.toLocaleString('es-CL')}`;
  }

  // Inicializar carrito al cargar la página
  renderizarCarrito();

  // Limpiar carrito al pagar
  const btnPagar = document.getElementById('btn-pagar');
  if (btnPagar) {
    btnPagar.addEventListener('click', () => {
      if (carrito.length > 0) {
        alert("¡Compra procesada con éxito! (Simulación)");
        carrito = [];
        actualizarCarrito();
      } else {
        alert("Agrega productos antes de pagar.");
      }
    });
  }

  const formLogin = document.getElementById('formulario-login');
  
  if (formLogin) {
    formLogin.addEventListener('submit', (event) => {
      event.preventDefault();

      const loginCorreo = document.getElementById('loginCorreo');
      const loginPassword = document.getElementById('loginPassword');

      // Regla de negocio: Solo dominios permitidos
      const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
      const correoValue = loginCorreo.value.trim().toLowerCase();
      
      const esValidoCorreoLogin = validarCampo(
        loginCorreo,
        correoValue.length > 0 && correoValue.length <= 100 && dominiosPermitidos.some(dominio => correoValue.endsWith(dominio)),
        'error-loginCorreo'
      );

      // Regla de negocio: Contraseña entre 4 y 10 caracteres
      const passwordValue = loginPassword.value.trim();
      const esValidoPasswordLogin = validarCampo(
        loginPassword,
        passwordValue.length >= 4 && passwordValue.length <= 10,
        'error-loginPassword'
      );

      if (esValidoCorreoLogin && esValidoPasswordLogin) {

        // Credenciales del único administrador
        const CORREO_ADMIN = "admin@gmail.com";
        const CLAVE_ADMIN = "admin123";

        // ¿Es el administrador? → lo mandamos al panel
        if (correoValue === CORREO_ADMIN && passwordValue === CLAVE_ADMIN) {
          sessionStorage.setItem("sesionAdmin", "activa");
          window.location.href = "admin.html";
        } else {
          // Cliente normal (seguía como antes)
          alert("¡Inicio de sesión exitoso! (Simulación)");
          formLogin.reset();
          loginCorreo.classList.remove('is-valid');
          loginPassword.classList.remove('is-valid');
        }
      }
    });

    // Limpiar clases al escribir en el login
    formLogin.querySelectorAll('input').forEach(elemento => {
      elemento.addEventListener('input', () => {
        if (elemento.classList.contains('is-invalid')) {
          elemento.classList.remove('is-invalid');
        }
      });
    });
  }

  const form = document.getElementById('formulario-agenda');
  const alertaExito = document.getElementById('alerta-exito');

  // Establecer fecha minima en el selector de fecha
  const fechaInput = document.getElementById('fechaCita');
  if (fechaInput) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;
  }

  // Reglas de validacion
  const validarCampo = (input, condicion, mensajeErrorId) => {
    const feedback = document.getElementById(mensajeErrorId);
    if (!condicion) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (feedback) feedback.style.display = 'block';
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (feedback) feedback.style.display = 'none';
      return true;
    }
  };

  // Escuchar el evento submit
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener campos
    const nombreDueno = document.getElementById('nombreDueno');
    const telefono = document.getElementById('telefono');
    const correo = document.getElementById('correo');
    const nombreMascota = document.getElementById('nombreMascota');
    const tipoMascota = document.getElementById('tipoMascota');
    const servicio = document.getElementById('servicio');
    const horario = document.getElementById('horario');

    // Validaciones especificas
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTel = /^[0-9]{9}$/; // 9 dígitos estándar en Chile

    const esValidoNombreDueno = validarCampo(
      nombreDueno,
      nombreDueno.value.trim().length >= 3,
      'error-nombreDueno'
    );

    const esValidoTelefono = validarCampo(
      telefono,
      regexTel.test(telefono.value.trim()),
      'error-telefono'
    );

    const esValidoCorreo = validarCampo(
      correo,
      regexEmail.test(correo.value.trim()),
      'error-correo'
    );

    const esValidoNombreMascota = validarCampo(
      nombreMascota,
      nombreMascota.value.trim().length >= 2,
      'error-nombreMascota'
    );

    const esValidoTipoMascota = validarCampo(
      tipoMascota,
      tipoMascota.value !== '',
      'error-tipoMascota'
    );

    const esValidoServicio = validarCampo(
      servicio,
      servicio.value !== '',
      'error-servicio'
    );

    const esValidaFecha = validarCampo(
      fechaInput,
      fechaInput.value !== '',
      'error-fechaCita'
    );

    const esValidoHorario = validarCampo(
      horario,
      horario.value !== '',
      'error-horario'
    );

    // Si todo es válido:
    if (
      esValidoNombreDueno &&
      esValidoTelefono &&
      esValidoCorreo &&
      esValidoNombreMascota &&
      esValidoTipoMascota &&
      esValidoServicio &&
      esValidaFecha &&
      esValidoHorario
    ) {
      alertaExito.classList.remove('d-none');
      alertaExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Resetear campos tras el envío exitoso
      form.reset();
      const inputs = form.querySelectorAll('.form-control, .form-select');
      inputs.forEach(input => input.classList.remove('is-valid'));

      // Ocultar alerta a los 6 segundos
      setTimeout(() => {
        alertaExito.classList.add('d-none');
      }, 6000);
    }
  });

  // Limpiar clases al escribir o cambiar
  form.querySelectorAll('input, select, textarea').forEach(elemento => {
    elemento.addEventListener('input', () => {
      if (elemento.classList.contains('is-invalid')) {
        elemento.classList.remove('is-invalid');
      }
    });
  });
});