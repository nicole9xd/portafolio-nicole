
function mostrarArchivo(input, id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (input.files && input.files[0]) {
      el.textContent = "Subido: " + input.files[0].name;
    } else {
      el.textContent = "";
    }
  }
  