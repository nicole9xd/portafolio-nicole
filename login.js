function mostrarForm(tipo) {
  document.getElementById("form-login").classList.remove("active");
  document.getElementById("form-register").classList.remove("active");
  document.getElementById("tab-login").classList.remove("active");
  document.getElementById("tab-register").classList.remove("active");

  if (tipo === "login") {
    document.getElementById("form-login").classList.add("active");
    document.getElementById("tab-login").classList.add("active");
  } else {
    document.getElementById("form-register").classList.add("active");
    document.getElementById("tab-register").classList.add("active");
  }
}

// Registrar usuario
function registrarUsuario(e) {
  e.preventDefault();
  const usuario = document.getElementById("nuevoUsuario").value.trim();
  const nombre = document.getElementById("nombreMostrar").value.trim();
  const pass = document.getElementById("nuevaPassword").value;

  if (!usuario || !nombre || !pass) {
    alert("⚠️ Completa todos los campos");
    return false;
  }

  let cuentas = JSON.parse(localStorage.getItem("cuentas")) || {};

  // Evitar sobreescribir a Nicole
  if(usuario.toLowerCase() === "nicole") {
    alert("❌ No puedes registrar este usuario");
    return false;
  }

  if (cuentas[usuario]) {
    alert("❌ El usuario ya existe");
    return false;
  }

  cuentas[usuario] = { nombre, pass, rol: "usuario" };
  localStorage.setItem("cuentas", JSON.stringify(cuentas));

  alert("✅ Cuenta creada con éxito. Ahora puedes iniciar sesión.");
  mostrarForm("login");
  return false;
}

// Validar login
function validarLogin(e) {
  e.preventDefault();
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("password").value;

  // Admin predefinido Nicole
  if(user.toLowerCase() === "nicole" && pass === "1234") {
    localStorage.setItem("usuarioActivo", "Nicole");
    localStorage.setItem("rolActivo", "admin");
    window.location.href = "portafolio.html";
    return;
  }

  let cuentas = JSON.parse(localStorage.getItem("cuentas")) || {};
  if (cuentas[user] && cuentas[user].pass === pass) {
    localStorage.setItem("usuarioActivo", cuentas[user].nombre);
    localStorage.setItem("rolActivo", "usuario");
    window.location.href = "portafolio.html";
  } else {
    alert("❌ Usuario o contraseña incorrectos");
  }
}

// Invitado
function entrarInvitado() {
  localStorage.setItem("usuarioActivo", "Invitado");
  localStorage.setItem("rolActivo", "invitado");
  window.location.href = "portafolio.html";
}
