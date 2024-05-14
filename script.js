// Función para insertar el cliente en la tabla y localStorage
function insertarCliente() {
  // Obtener los valores del formulario
  var nombre = document.getElementById('nombre').value;
  var dia = document.getElementById('dia').value;
  var mes = document.getElementById('mes').value;
  var anio = document.getElementById('anio').value;
  var dni = document.getElementById('dni').value;
  var domicilio = document.getElementById('domicilio').value;
  var notas = document.getElementById('notas').value;

  // Crear fecha de nacimiento en formato dd/mm/aaaa
  var fechaNacimiento = dia + "/" + mes + "/" + anio;

  // Crear fila de la tabla
  var fila = "<tr><td>" + nombre + "</td><td>" + dni + "</td><td>" + fechaNacimiento + "</td><td>" + domicilio + "</td><td>" + notas + "</td></tr>";

  // Agregar fila a la tabla
  document.getElementById("tabla-clientes").insertAdjacentHTML('beforeend', fila);

  // Guardar en localStorage
  var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  clientes.push({nombre: nombre, dni: dni, fechaNacimiento: fechaNacimiento, domicilio: domicilio, notas: notas});
  localStorage.setItem('clientes', JSON.stringify(clientes));

  // Limpiar el formulario
  document.getElementById("formulario").reset();
}

// Función para cargar los datos de localStorage al cargar la página
window.onload = function() {
  var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  clientes.forEach(function(cliente) {
    var fila = "<tr><td>" + cliente.nombre + "</td><td>" + cliente.dni + "</td><td>" + cliente.fechaNacimiento + "</td><td>" + cliente.domicilio + "</td><td>" + cliente.notas + "</td></tr>";
    document.getElementById("tabla-clientes").insertAdjacentHTML('beforeend', fila);
  });
}

// Función para reestablecer la tabla (eliminar todos los clientes)
function reestablecerTabla() {
  localStorage.removeItem('clientes');
  document.getElementById("tabla-clientes").innerHTML = "";
}

// Función para eliminar el último cliente de la tabla
function eliminarUltimoCliente() {
  var tabla = document.getElementById("tabla-clientes");
  var rowCount = tabla.rows.length;
  if (rowCount > 0) {
    tabla.deleteRow(rowCount - 1);

    // También eliminamos el último cliente del localStorage
    var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.pop();
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }
}

// Función para verificar cumpleaños de los clientes
function verificarCumpleanos() {
  var hoy = new Date();
  var diaHoy = hoy.getDate();
  var mesHoy = hoy.getMonth() + 1; // Meses en JavaScript son indexados desde 0

  var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  var cumpleaneros = [];

  clientes.forEach(function(cliente) {
    var fechaNacimiento = cliente.fechaNacimiento.split('/');
    var diaNacimiento = parseInt(fechaNacimiento[0]);
    var mesNacimiento = parseInt(fechaNacimiento[1]);

    if (diaNacimiento === diaHoy && mesNacimiento === mesHoy) {
      cumpleaneros.push(cliente.nombre);
    }
  });

  if (cumpleaneros.length > 0) {
    alert("Hoy es el cumpleaños de : " + cumpleaneros.join(", ") + "!");
  } else {
    alert("No cumple años ningun cliente hoy.");
  }
}

function descargarTabla() {
  const tabla = document.getElementById("tablaGenerada");

  // Utilizar html2canvas para capturar la tabla como imagen
  html2canvas(tabla).then(function (canvas) {
      // Crear un enlace para descargar la imagen
      const enlace = document.createElement("a");
      enlace.href = canvas.toDataURL("image/png");
      enlace.download = "Tabla de Clientes.png";

      // Simular un clic en el enlace para iniciar la descarga
      enlace.click();
  });
}