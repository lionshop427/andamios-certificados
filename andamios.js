// app.js

// "Base de datos" simulada para andamios (AHORA CON IMÁGENES)
const DB_ANDAMIOS = [
  {
    id: 1,
    nombre: "Cuerpo completo Acrow",
    descripcion: "2 laterales, 2 tijerales y 1 plataforma certificada por la UNI.",
    precioDia: 10.0,
    stock: 1000,
    imagen: "andamio2.jpg"
  },
  {
    id: 2,
    nombre: "Medio cuerpo de andamio",
    descripcion: "Ideal para interiores y trabajos en alturas menores.",
    precioDia: 8.0,
    stock: 25,
    imagen: "mediocuerpo.jpg"
  },
  {
    id: 3,
    nombre: "Juego de garruchas (4 unidades)",
    descripcion: "Ruedas con freno para desplazar andamios de forma segura.",
    precioDia: 8.0,
    stock: 40,
    imagen: "garuchas.jpg"
  },
  {
    id: 4,
    nombre: "Niveladores para (Andamios)",
    descripcion: "Niveladores galvanizados, certificados por la UNI.",
    precioDia: 6.0,
    stock: 40,
    imagen: "niveladores.png"
  },
  {
    id: 5,
    nombre: "Escalera telescópica (20 pasos)",
    descripcion: "Escaleras telescópicas para trabajos de pintura y acabados.",
    precioDia: 8.0,
    stock: 40,
    imagen: "escalera.png"
  }
];

// "Base de datos" simulada para reservas
let DB_RESERVAS = [];

// NÚMERO DE WHATSAPP DONDE LLEGARÁ LA COTIZACIÓN
const WHATSAPP_NUMBER = "51958799539"; // ← AQUÍ RECIBIRÁS LAS COTIZACIONES

// Cargar catálogo de andamios en la página
function renderAndamios() {
  const lista = document.getElementById("andamios-list");
  const select = document.getElementById("andamioSelect");

  lista.innerHTML = "";
  select.innerHTML = '<option value="">Selecciona un tipo de andamio</option>';

  DB_ANDAMIOS.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card-andamio";
    card.innerHTML = `
      <img 
        src="${item.imagen}" 
        alt="${item.nombre}" 
        class="card-andamio__img"
      />
      <h3>${item.nombre}</h3>
      <p>${item.descripcion}</p>
      <p class="precio">S/ ${item.precioDia.toFixed(2)} por día</p>
      <p>Stock disponible: ${item.stock}</p>
    `;
    lista.appendChild(card);

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.nombre} (S/ ${item.precioDia.toFixed(2)} x día)`;
    select.appendChild(option);
  });
}

// Mostrar reservas en el listado
function renderReservas() {
  const contenedor = document.getElementById("reservas-list");
  contenedor.innerHTML = "";

  if (DB_RESERVAS.length === 0) {
    contenedor.innerHTML = "<p>Todavía no hay reservas registradas.</p>";
    return;
  }

  DB_RESERVAS.forEach((reserva) => {
    const item = document.createElement("div");
    item.className = "reserva-item";
    item.innerHTML = `
      <strong>${reserva.nombre}</strong> – ${reserva.telefono}<br/>
      Andamio: ${reserva.nombreAndamio}<br/>
      Días: ${reserva.dias} · Total aprox: S/ ${reserva.total.toFixed(2)}
    `;
    contenedor.appendChild(item);
  });
}

// Guardar reserva + enviar WhatsApp
function manejarFormularioReserva(event) {
  event.preventDefault();

  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const andamioSelect = document.getElementById("andamioSelect");
  const diasInput = document.getElementById("dias");
  const mensaje = document.getElementById("mensaje");

  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const andamioId = Number(andamioSelect.value);
  const dias = Number(diasInput.value);

  if (!nombre || !telefono || !andamioId || !dias || dias <= 0) {
    mensaje.textContent = "Por favor, completa todos los campos correctamente.";
    mensaje.style.color = "red";
    return;
  }

  const andamio = DB_ANDAMIOS.find((a) => a.id === andamioId);
  if (!andamio) {
    mensaje.textContent = "El andamio seleccionado no existe.";
    mensaje.style.color = "red";
    return;
  }

  const total = dias * andamio.precioDia;

  // REGISTRO EN LA PÁGINA
  const nuevaReserva = {
    nombre,
    telefono,
    andamioId,
    nombreAndamio: andamio.nombre,
    dias,
    total
  };

  DB_RESERVAS.push(nuevaReserva);
  renderReservas();

  // CREACIÓN DEL MENSAJE PARA WHATSAPP
  const texto = `
Nueva cotización solicitada

Cliente: ${nombre}
Teléfono: ${telefono}

Equipo solicitado:
- ${andamio.nombre}
- Precio por día: S/ ${andamio.precioDia.toFixed(2)}
- Días de alquiler: ${dias}
- Total estimado: S/ ${total.toFixed(2)}

Por favor, confirmar disponibilidad y coordinar entrega.
  `;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

  // ENVIAR A TU WHATSAPP
  window.open(url, "_blank");

  mensaje.textContent = "Cotización enviada a WhatsApp.";
  mensaje.style.color = "green";

  // LIMPIAR FORMULARIO
  nombreInput.value = "";
  telefonoInput.value = "";
  andamioSelect.value = "";
  diasInput.value = "1";
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  renderAndamios();
  renderReservas();

  const form = document.getElementById("reserva-form");
  form.addEventListener("submit", manejarFormularioReserva);
});
