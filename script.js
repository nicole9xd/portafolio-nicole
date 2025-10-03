document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("rolActivo"); // admin, usuario, invitado
  const portfolio = document.getElementById("portfolioGrid");
  
  // Botón salir
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("rolActivo");
    window.location.href = "index.html";
  });

  // Crear 16 semanas
  for(let i=1; i<=16; i++){
    const card = document.createElement("div");
    card.classList.add("card");

    const titulo = document.createElement("h3");
    titulo.textContent = `Semana ${i}`;

    const descripcion = document.createElement("p");
    descripcion.textContent = `Descripción de la semana ${i}`;

    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");

    // Botón ver siempre visible
    const btnVer = document.createElement("a");
    btnVer.href = `archivos/semana${i}.pdf`;
    btnVer.target = "_blank";
    btnVer.textContent = "📄 Ver";
    btnVer.classList.add("btn");
    btnGroup.appendChild(btnVer);

    // Solo para admin (Nicole) los botones de subir y borrar
    if(rol === "admin"){
      const label = document.createElement("label");
      label.classList.add("btn");
      label.textContent = "📂 Subir ";
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = function(){ mostrarArchivo(this, `Semana${i}`) };
      label.appendChild(input);

      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-delete");
      btnBorrar.textContent = "🗑 Borrar";
      btnBorrar.onclick = function(){ borrarArchivo(`Semana${i}`) };

      btnGroup.appendChild(label);
      btnGroup.appendChild(btnBorrar);
    }

    const small = document.createElement("small");
    small.id = `Semana${i}`;
    small.classList.add("archivo-subido");

    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(btnGroup);
    card.appendChild(small);

    portfolio.appendChild(card);
  }
});

function mostrarArchivo(input, id) {
  const el = document.getElementById(id);
  if (input.files && input.files[0]) {
    el.textContent = "📂 Subido: " + input.files[0].name;
  } else {
    el.textContent = "";
  }
}

function borrarArchivo(id) {
  const el = document.getElementById(id);
  el.textContent = "";
}
