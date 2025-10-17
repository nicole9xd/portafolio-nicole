// Mostrar archivo seleccionado y guardarlo en localStorage
function mostrarArchivo(input, id) {
  const el = document.getElementById(id);
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      // Guardar archivo en base64 en localStorage
      const archivos = JSON.parse(localStorage.getItem("archivos")) || {};
      archivos[id] = {
        name: file.name,
        content: e.target.result
      };
      localStorage.setItem("archivos", JSON.stringify(archivos));

      // Mostrar nombre en la tarjeta
      el.textContent = "📂 Subido: " + file.name;
    };
    reader.readAsDataURL(file);
  } else {
    el.textContent = "";
  }
}

// Borrar archivo
function borrarArchivo(id) {
  const el = document.getElementById(id);
  el.textContent = "";
  const archivos = JSON.parse(localStorage.getItem("archivos")) || {};
  delete archivos[id];
  localStorage.setItem("archivos", JSON.stringify(archivos));
}

// Ver archivo
function verArchivo(id) {
  const archivos = JSON.parse(localStorage.getItem("archivos")) || {};
  if(archivos[id]) {
    // Abrir en nueva ventana/tab
    const win = window.open();
    win.document.write(`<iframe src="${archivos[id].content}" style="width:100%; height:100vh;" frameborder="0"></iframe>`);
  } else {
    alert("❌ No hay archivo subido para esta semana");
  }
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "index.html"; // landing o login
}

// Redirigir si no hay usuario activo
window.onload = function() {
  const usuario = localStorage.getItem("usuarioActivo");
  if(!usuario) {
    window.location.href = "index.html";
  }
};
const supabaseUrl = 'https://kmxnmkjnzhiolfmzdnet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteG5ta2puemhpb2xmbXpkbmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTcwMDMsImV4cCI6MjA3Mzg3MzAwM30.KMlip04UmkwBFo29VQtftss9je2HCi7mn_Ls7Ein36g';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const inputArchivo = document.getElementById('inputArchivo'); // tu input tipo file

inputArchivo.addEventListener('change', async (event) => {
  const archivo = event.target.files[0];
  if (!archivo) return alert('Selecciona un archivo primero');

  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  const nombreArchivo = `${usuario.email}/${Date.now()}-${archivo.name}`;

  const { data, error } = await supabase.storage
    .from('archivos_portafolio')
    .upload(nombreArchivo, archivo, { upsert: true });

  if (error) {
    console.error(error);
    alert('❌ Error al subir el archivo');
  } else {
    const { data: urlData } = supabase.storage
      .from('archivos_portafolio')
      .getPublicUrl(nombreArchivo);
    alert('✅ Archivo subido correctamente');
    console.log('URL del archivo:', urlData.publicUrl);
  }
});
