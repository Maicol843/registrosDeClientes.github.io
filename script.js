var clienteEditandoIndex = -1; // Índice del cliente que se está editando (-1 indica que no se está editando ningún cliente)

// Función para insertar el cliente en la tabla y localStorage
function insertarCliente() {
  // Obtener los valores del formulario
  var nombre = document.getElementById('nombre').value;
  var dia = document.getElementById('dia').value;
  var mes = document.getElementById('mes').value;
  var anio = document.getElementById('anio').value;
  var contacto = document.getElementById('contacto').value;
  var domicilio = document.getElementById('domicilio').value;
  var servicio = document.getElementById('servicio').value;

  // Crear fecha de nacimiento en formato dd/mm/aaaa
  var fechaNacimiento = dia + "/" + mes + "/" + anio;

  // Si estamos editando un cliente
  if (clienteEditandoIndex !== -1) {
    // Actualizar el cliente en la tabla y localStorage
    var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes[clienteEditandoIndex] = { nombre: nombre, dni: dni, fechaNacimiento: fechaNacimiento, servicio: servicio };
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Actualizar la fila en la tabla
    var tabla = document.getElementById("tabla-clientes");
    var fila = tabla.rows[clienteEditandoIndex + 1];
    fila.cells[0].innerHTML = nombre;
    fila.cells[1].innerHTML = contacto;
    fila.cells[2].innerHTML = fechaNacimiento;
    fila.cells[3].innerHTML = domicilio;
    fila.cells[4].innerHTML = servicio;

    // Reiniciar el estado de edición
    clienteEditandoIndex = -1;
  } else {
    // Crear fila de la tabla
    var fila = "<tr><td>" + nombre + "</td><td>" + contacto + "</td><td>" + fechaNacimiento + "</td><td>" + domicilio + "</td><td>" + servicio + "</td></tr>";

    // Agregar fila a la tabla
    document.getElementById("tabla-clientes").insertAdjacentHTML('beforeend', fila);

    // Guardar en localStorage
    var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.push({ nombre: nombre, contacto: contacto, fechaNacimiento: fechaNacimiento, domicilio: domicilio, servicio: servicio });
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }
  // Limpiar el formulario
  document.getElementById("formulario").reset();
}

// Función para cargar los datos de localStorage al cargar la página
window.onload = function () {
  var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  clientes.forEach(function (cliente) {
    var fila = "<tr><td>" + cliente.nombre + "</td><td>" + cliente.contacto + "</td><td>" + cliente.fechaNacimiento + "</td><td>" + cliente.domicilio + "</td><td>" + cliente.servicio + "</td></tr>";
    document.getElementById("tabla-clientes").insertAdjacentHTML('beforeend', fila);
  });
}

// Función para reestablecer la tabla (eliminar todos los clientes)
function reestablecerTabla() {
  localStorage.removeItem('clientes');
  document.getElementById("tabla-clientes").innerHTML = "";
}

// Función para editar los datos de un cliente
function editarCliente(index) {
  clienteEditandoIndex = index - 1; // El índice de la tabla es 1 más que el índice del array
  var clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  var cliente = clientes[clienteEditandoIndex];
  document.getElementById('nombre').value = cliente.nombre;
  document.getElementById('contacto').value = cliente.contacto;
  var fechaNacimiento = cliente.fechaNacimiento.split('/');
  document.getElementById('dia').value = parseInt(fechaNacimiento[0]);
  document.getElementById('mes').value = parseInt(fechaNacimiento[1]);
  document.getElementById('anio').value = parseInt(fechaNacimiento[2]);
  document.getElementById('domicilio').value = cliente.domicilio;
  document.getElementById('servicio').value = cliente.servicio;
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

  clientes.forEach(function (cliente) {
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

// Función para buscar un cliente por nombre
function buscarCliente() {
  var busqueda = document.getElementById("busqueda").value.toLowerCase();
  var tabla = document.getElementById("tabla-clientes");
  var filas = tabla.getElementsByTagName("tr");

  var encontrados = false;
  for (var i = 0; i < filas.length; i++) {
    var celdaNombre = filas[i].getElementsByTagName("td")[0];
    if (celdaNombre) {
      var contenido = celdaNombre.textContent || celdaNombre.innerText;
      if (contenido.toLowerCase().indexOf(busqueda) > -1) {
        filas[i].style.display = "";
        encontrados = true;
      } else {
        filas[i].style.display = "none";
      }
    }
  }

  if (!encontrados) {
    alert("No se encontraron resultados.");
  }
}

// Función para habilitar la edición del servicio al hacer clic en la celda
function editarServicio() {
  var tabla = document.getElementById("tabla-clientes");
  var filas = tabla.getElementsByTagName("tr");

  for (var i = 0; i < filas.length; i++) {
    var celdaNombre = filas[i].getElementsByTagName("td")[0];
    celdaNombre.setAttribute("contenteditable", "true");
    var celdaContacto = filas[i].getElementsByTagName("td")[1];
    celdaContacto.setAttribute("contenteditable", "true");
    var celdaFecha = filas[i].getElementsByTagName("td")[2];
    celdaFecha.setAttribute("contenteditable", "true");
    var celdaDomicilio = filas[i].getElementsByTagName("td")[3];
    celdaDomicilio.setAttribute("contenteditable", "true");
    var celdaServicio = filas[i].getElementsByTagName("td")[4];
    celdaServicio.setAttribute("contenteditable", "true");
  }
}