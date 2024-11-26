const API_URL = "http://localhost:3000/salas";
const tableSalas = document.getElementById("table-salas");
const salasForm = document.getElementById("salas-form");
const reservasForm_R = document.getElementById("reservas-form");
const reserveMessage = document.getElementById("reserve-message");
const tableDispo = document.getElementById("table-dispo");

const btnEdit = document.getElementById("btn-edit");
const btnReservar = document.getElementById("btn-reservar");
const reservaOptions = document.getElementById("reserva-options");
let editingUser = null;

async function reiniciarSalas() {
  try {
    
    const response = await fetch(`http://localhost:3000/reiniciar`, { method: "POST" });
    console.log(response);
    
    if (!response.ok) throw new Error("No se pudo reiniciar las salas");
    console.log("Salas reiniciadas al estado inicial");
    mostrarSalas(tableSalas);
    mostrarSalas(tableDispo);
  } catch (error) {
    console.error("Error al reiniciar las salas:", error);
  }
}
//GET -> mostrar las salas
//En esta función hubo cambios
async function mostrarSalas(table) {
  const response = await fetch(API_URL);
  const salas = await response.json();
  const responseDispo = await fetch(`${API_URL}/disponibles`);
  const salasDisponibles = await responseDispo.json();
  if (table === tableSalas) {
    table.innerHTML = ""; //Aquí hubo un cambio
    salas.forEach((sala) => {
      const row = document.createElement("tr"); //Aquí hubo un cambio
      row.innerHTML = `
          <td>${sala.id}</td>
          <td>${sala.nombre}</td>
          <td>${sala.capacidad}</td>
          <td>${sala.estado}</td>
          <td>
            <button class="btn btn-warning" onclick=editarSala(${sala.id})>Editar</button>
            <button class="btn btn-danger" onclick=eliminarSala(${sala.id})>Eliminar</button>
            <button id="btn-reserva" class="btn btn-success" ${sala.estado === "Inactiva" ? "disabled" : ""} onclick=reservar(${sala.id},"1")>Reservar</button>
          </td>
        `;
      table.appendChild(row); //Aquí hubo un cambio
    });
  }else if(table === tableDispo){
    table.innerHTML = ""; //Aquí hubo un cambio
    salasDisponibles.forEach((sala) => {
      const row = document.createElement("tr"); //Aquí hubo un cambio
      row.innerHTML = `
          <td>${sala.id}</td>
          <td>${sala.nombre}</td>
          <td>${sala.capacidad}</td>
          <td>${sala.estado}</td>
          <td>
            <button id="btn-reserva" class="btn btn-success" ${sala.estado === "Inactiva" ? "disabled" : ""} onclick=reservar(${sala.id},"2")>Reservar</button>
          </td>
        `;
      table.appendChild(row); //Aquí hubo un cambio
    });
  }
}
async function reservar(id, table) {
  reservasForm_R.classList.replace("d-none", "d-block");
  document.getElementById("reserva-salaID").value = id;
  deshabilitarBoton(id, table);
}
function deshabilitarBoton(id, table) {
  const rowSelector = table === "1" ? "#table-salas" : "#table-dispo";
  const row = Array.from(document.querySelectorAll(`${rowSelector} tr`)).find((tr) => {
    return parseInt(tr.children[0].textContent) === parseInt(id);
  });
  console.log(row);
  if (row) {
    const reservarBtn = row.querySelector(`#btn-reserva`);
    if (reservarBtn) {
      reservarBtn.setAttribute("disabled", "true");
    }
    return
  } else {
    console.error(`No se encontró la fila para la sala con ID ${id}`);
  }
}
async function guardarSalas(e) {
  e.preventDefault();
  const id = document.getElementById("sala-id").value,
    nombre = document.getElementById("sala-nombre").value,
    capacidad = document.getElementById("sala-capacidad").value;
  // estado = document.getElementById("sala-estado").value;

  const sala = {
    id: parseInt(id),
    nombre,
    capacidad: parseInt(capacidad),
    estado: "Activa",
  };
  try {
    if (editingUser) {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(sala),
      });
      editingUser = null;
    } else {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(sala),
      });
    }
    await mostrarSalas(tableSalas);
    await mostrarSalas(tableDispo);
    salasForm.reset();
  } catch (error) {
    alert("Error al cargar sala");
  }
}

function editarSala(id) {
  const row = Array.from(document.querySelectorAll(`#table-salas tr`)).find(
    (sala) => {
      return parseInt(sala.children[0].textContent) === id;
    }
  );
  if (row) {
    document.getElementById("sala-id").value = row.children[0].textContent;
    document.getElementById("sala-nombre").value = row.children[1].textContent;
    document.getElementById("sala-capacidad").value =
      row.children[2].textContent;

    editingUser = id;
  } else {
    alert("Sala no encontrada");
  }
}
async function eliminarSala(id) {
  if (!confirm("Estás seguro de que quieres eliminar la sala?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      alert("No se pudo eliminar");
      return;
    }
    alert("Sala eliminada correcamente");
    await mostrarSalas(tableSalas);
    await mostrarSalas(tableDispo);
  } catch (error) {
    throw new Error(error.message);
  }
}

salasForm.addEventListener("submit", guardarSalas);
mostrarSalas(tableDispo);
setInterval(() => {
  mostrarSalas(tableSalas); 
  mostrarSalas(tableDispo);
}, 2000);
document.addEventListener("DOMContentLoaded", async () => {
  await reiniciarSalas(); 
  mostrarSalas(tableSalas);
  mostrarSalas(tableDispo);
});

