const API_URL_R = "http://localhost:3000/reservas";
const API_URL_S = "http://localhost:3000/salas";

const reservasForm = document.getElementById("reservas-form");
const tableReservas = document.getElementById("table-reservas");
const tableAllReserva = document.getElementById("table-all-reserva");

let editingUser_R = null;
async function mostrarReservas(){
  try {
    const response = await fetch(API_URL_R);
    const reservas = await response.json();
    tableReservas.innerHTML = "";
    reservas.forEach((reserva) =>{
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${reserva.id}</td>
        <td>${reserva.salaId}</td>
        <td>${reserva.nombre}</td>
        <td>${reserva.fechaInicio}</td>
        <td>${reserva.fechaFin}</td>
        <td>
          <button class="btn btn-warning" onclick=editarReserva(${reserva.id})>Editar</button>
          <button class="btn btn-danger" onclick=eliminarReserva(${reserva.id})>Cancelar</button>
        </td>
      ` 
      tableReservas.appendChild(row);
    });
  } catch (error) {
    alert("Error al cargar reserva:", error.message);
  }
}
async function cambiarEstado(idSala, nuevoEstado, table) {
  try {
    const url = table === "1" ? `${API_URL_S}/${idSala}` : `${API_URL_S}/disponibles/${idSala}`;
    const responseSala = await fetch(url);
    
    if (!responseSala.ok) {
      throw new Error("No se pudo obtener la sala");
    }

    const sala = await responseSala.json();
    sala.estado = nuevoEstado;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sala),
    });

    if (!response.ok) {
      throw new Error("No se pudo cambiar el estado de la sala");
    }

    deshabilitarBoton(sala.id, table);
    mostrarReservas();
  } catch (error) {
    alert(`Error al cambiar el estado de la sala: ${error.message}`);
  }
}
function replaceStyle(element,original, end){
  return element.classList.replace(original, end);
}
async function guardarReservas(e) {
  e.preventDefault();
  const id = document.getElementById("reserva-id").value,
    nombre = document.getElementById("reserva-nombre").value,
    salaId = document.getElementById("reserva-salaID").value,
    fechaInicio = document.getElementById("reserva-fechaInicio").value,
    fechaFin = document.getElementById("reserva-fechaFin").value;

  const reserva = {
    id: parseInt(id),
    nombre,
    salaId: parseInt(salaId),
    fechaInicio,
    fechaFin,
  };
  try {
    if (editingUser_R) {
      const response = await fetch(`${API_URL_R}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(reserva),
      });
      editingUser_R = null;
    } else {
      const response = await fetch(API_URL_R, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(reserva),
      });
      if(response.ok){
        const table = await determinarOrigenSala(salaId);
        await cambiarEstado(salaId, "Inactiva", table);
      }
    }
  // CAMBIAR LÓGICA PARA SALAS DISPONIBLES
  mostrarReservas();
  replaceStyle(reservasForm, "d-block", "d-none");
  replaceStyle(reserveMessage, "d-block", "d-none");
  replaceStyle(tableAllReserva,"d-none", "d-block" );
  reservasForm.reset();
  } catch (error) {
    alert("Error al cargar reserva");
  }
}
async function determinarOrigenSala(id){
  try {
    const response = await fetch(`${API_URL_S}/${id}`);
    if (response.ok) return "1"; //
    const responseDispo = await fetch(`${API_URL_S}/disponibles/${id}`);
    if (responseDispo.ok) return "2";
  } catch (error) {
    console.error(`Error determinando el origen de la sala con ID ${id}:`, error);
  }
  return null; // Origen desconocido
}
function editarReserva(id){
  reservasForm.classList.replace("d-none", "d-block");
  const row = Array.from(document.querySelectorAll("#table-reservas tr")).find((reserva) =>{
    return parseInt(reserva.children[0].textContent) === id;
  });
  if(row){
    document.getElementById("reserva-id").value = row.children[0].textContent;
    document.getElementById("reserva-salaID").value = row.children[1].textContent;
    document.getElementById("reserva-nombre").value = row.children[2].textContent;
    document.getElementById("reserva-fechaInicio").value = row.children[3].textContent;
    document.getElementById("reserva-fechaFin").value = row.children[4].textContent;

    editingUser_R = id;
  }else{
    alert("reserva no encontrada");
  }
}
async function eliminarReserva(id, table){
  if(!confirm("Estás seguro de que quieres eliminar la reserva?")) return;
  try {
    const reserva = await fetch(`${API_URL_R}/${id}`).then((res) => res.json());
    const response = await fetch(`${API_URL_R}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      alert("No se pudo eliminar la reserva");
      return;
    }

    const origen =  await determinarOrigenSala(reserva.salaId);
    await cambiarEstado(reserva.salaId, "Activa", origen);
    mostrarReservas();
  } catch (error) {
    console.error(`Error eliminando la reserva con ID ${id}:`, error);
  }
}

reservasForm.addEventListener("submit", guardarReservas);
setInterval(() => {
  mostrarReservas();
}, 2000);
