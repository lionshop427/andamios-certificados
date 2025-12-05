// app.js

// "Base de datos" simulada para andamios (AHORA CON IMÁGENES)
const DB_ANDAMIOS = [
  {
    id: 1,
    nombre: "Cuerpo completo Acrow",
    descripcion: "2 laterales, 2 tijerales y 1 plataforma certificada por la UNI.",
    precioDia: 10.0,
    stock: 1000,
    imagen: "andamios/andamio2.jpg"
  },
  {
    id: 2,
    nombre: "Medio cuerpo de andamio",
    descripcion: "Ideal para interiores y trabajos en alturas menores.",
    precioDia: 8.0,
    stock: 25,
    imagen: "andamios/mediocuerpo.jpg"
  },
  {
    id: 3,
    nombre: "Juego de garruchas (4 unidades)",
    descripcion: "Ruedas con freno para desplazar andamios de forma segura.",
    precioDia: 8.0,
    stock: 40,
    imagen: "andamios/garuchas.jpg"
  },
  {
    id: 4,
    nombre: "Niveladores para (Andamios)",
    descripcion: "Niveladores galvanizados, certificados por la UNI.",
    precioDia: 6.0,
    stock: 40,
    imagen: "andamios/niveladores.jpg"
  },
  {
    id: 5,
    nombre: "Escalera telescópica (20 pasos)",
    descripcion: "Escaleras telescópicas para trabajos de pintura y acabados.",
    precioDia: 8.0,
    stock: 40,
    imagen: "andamios/escalera.jpg"
  }
];

let DB_RESERVAS = [];

const WHATSAPP_NUMBER = "51958799539";

// 🔹 NUEVA FUNCIÓN: llenar la cantidad de andamios del 1 al 12
function renderCantidadAndamios() {
  const selectCantidad = document.getElementById("cantidad");
  if (!selectCantidad) return; // por si acaso

  selectCantidad.innerHTML = "";

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i} andamio${i > 1 ? "s" : ""}`;
    selectCantidad.appendChild(option);
  }
}

// Cargar catálogo
function renderAndamios() {
  const lista = document.getElementById("andamios-list");
  const select = document.getElementById("andamioSelect");

  lista.innerHTML = "";
  select.innerHTML = '<option value="">Selecciona un tipo de andamio</option>';

  DB_ANDAMIOS.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card-andamio";
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" class="card-andamio__img"/>
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

// Mostrar reservas
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
      Cantidad: ${reserva.cantidad} unidad(es)<br/>
      Días: ${reserva.dias}<br/>
      Total aprox: S/ ${reserva.total.toFixed(2)}
    `;
    contenedor.appendChild(item);
  });
}

// Guardar reserva
function manejarFormularioReserva(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const andamioId = Number(document.getElementById("andamioSelect").value);
  const dias = Number(document.getElementById("dias").value);
  const cantidad = Number(document.getElementById("cantidad").value);
  const mensaje = document.getElementById("mensaje");

  if (!nombre || !telefono || !andamioId || dias <= 0 || cantidad <= 0) {
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

  const total = dias * cantidad * andamio.precioDia;

  const nuevaReserva = {
    nombre,
    telefono,
    andamioId,
    nombreAndamio: andamio.nombre,
    dias,
    cantidad,
    total
  };

  DB_RESERVAS.push(nuevaReserva);
  renderReservas();

  const texto = `
Nueva cotización solicitada

Cliente: ${nombre}
Teléfono: ${telefono}

Equipo solicitado:
- ${andamio.nombre}
- Cantidad: ${cantidad} andamio(s)
- Precio por día: S/ ${andamio.precioDia.toFixed(2)}
- Días de alquiler: ${dias}

Total estimado: S/ ${total.toFixed(2)}

Por favor, confirmar disponibilidad y coordinar entrega.
`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");

  mensaje.textContent = "Cotización enviada a WhatsApp.";
  mensaje.style.color = "green";

  document.getElementById("nombre").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("andamioSelect").value = "";
  document.getElementById("dias").value = "1";
  document.getElementById("cantidad").value = "1";
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  renderAndamios();
  renderReservas();
  renderCantidadAndamios(); // 🔹 aquí llenamos del 1 al 12
  document
    .getElementById("reserva-form")
    .addEventListener("submit", manejarFormularioReserva);
});

