// LOGIN CON USUARIO
document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("password").value.trim();

  // Usuario y contraseña fijos
  if(user.toLowerCase() === "nicole" && pass === "1234"){
    alert("✅ Bienvenida, Nicole!");
    window.location.href = "./portafolio.html"; // 👈 Redirige al portafolio
  } else {
    alert("❌ Usuario o contraseña incorrectos");
  }
});

// ACCESO COMO INVITADO
document.getElementById("guestBtn").addEventListener("click", function(){
  window.location.href = "./portafolio.html"; // 👈 Redirige al portafolio
});
 