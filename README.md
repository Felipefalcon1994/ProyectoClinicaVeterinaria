#  Veterinaria San Marcos - Frontend Web

Proyecto académico desarrollado para la asignatura **DSY1104 - Desarrollo FullStack II** (Evaluación Parcial 1). Este repositorio contiene la primera fase del proyecto: una aplicación web (Frontend) construida con HTML5, CSS3 y JavaScript puro (Vanilla JS), orientada a la gestión de clientes, agenda médica y venta de productos para una clínica veterinaria.

## Características Implementadas

Se han desarrollado múltiples vistas interconectadas cumpliendo con las reglas de negocio y requerimientos de la evaluación:

### 1. Interfaz de Usuario y Navegación (HTML5 & CSS3)
* Página Principal (index.html): Landing page responsiva con presentación de servicios, equipo médico, formulario de agendamiento de horas, video educativo integrado y mapa de ubicación (Google Maps).
* Diseño Responsivo:** Implementación de Bootstrap 5.3 combinada con una hoja de estilos externa (estilos.css) para asegurar adaptabilidad en dispositivos móviles, tablets y escritorio.
* Semántica Web:** Uso correcto de etiquetas estructurales (header, nav, main, section, article, footer).

### 2. Validaciones Dinámicas de Formularios (JavaScript)
Se implementaron validaciones en tiempo real para evitar el envío de datos incorrectos, mostrando mensajes de error personalizados y controlando las clases de éxito/error de Bootstrap:
* Agendamiento de Horas:** Validación de largo de nombres, formato de teléfono chileno (9 dígitos), correos válidos y fechas posteriores al día actual.
* Inicio de Sesión (login.html): Restricción de dominios permitidos (solo @duocuc.cl, @profesor.duoc.cl o @gmail.com) y longitud de contraseña (4 a 10 caracteres).
* Registro de Usuarios (registro.html): Validación de coincidencia de contraseñas y carga dinámica en cascada de los selectores de Región y Comuna mediante arreglos de JavaScript.

### 3. E-commerce y Carrito de Compras (productos.html)
* Catálogo Dinámico:** Renderizado de productos (medicamentos y accesorios) directamente desde un arreglo en JavaScript basado en el catálogo oficial de la veterinaria.
* Carrito Funcional:** Implementación de un carrito de compras lateral (Offcanvas) que permite añadir y sumar productos, calculando el total automáticamente.
* Persistencia de Datos:** Uso de localStorage para guardar el estado del carrito, permitiendo al usuario navegar entre el Inicio y la Tienda sin perder los productos seleccionados.

## Tecnologías Utilizadas

* **HTML5:** Estructura semántica.
* **CSS3:** Estilos personalizados (css/estilos.css).
* **Bootstrap 5.3:** Framework CSS para grid, componentes (Offcanvas, Cards, Alerts) e íconos.
* **JavaScript (ES6):** Manipulación del DOM, validaciones, renderizado de arrays y localStorage (js/app.js).

## Estructura del Proyecto

```text
/
├── css/
│   └── estilos.css       # Hoja de estilos personalizada
├── js/
│   └── app.js            # Lógica principal, validaciones y carrito
├── index.html            # Página de inicio y agendamiento
├── login.html            # Inicio de sesión de clientes
├── registro.html         # Registro de nuevos usuarios
├── productos.html        # Tienda / Farmacia y carrito de compras
└── README.md             # Documentación del proyecto
