// ✅ Configura Supabase
const supabaseUrl = 'https://kmxnmkjnzhiolfmzdnet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteG5ta2puemhpb2xmbXpkbmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTcwMDMsImV4cCI6MjA3Mzg3MzAwM30.KMlip04UmkwBFo29VQtftss9je2HCi7mn_Ls7Ein36g';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ✅ Redirige si no hay sesión activa
window.onload = async function() {
    const usuario = localStorage.getItem("usuarioActivo");
    if (!usuario) {
        window.location.href = "index.html";
        return;
    }
    
    // Cargar archivos existentes al iniciar
    await cargarArchivosExistentes();
};

// ✅ Lista de semanas
const semanas = [
    { num: 1, titulo: "Introducción y alcance" },
    { num: 2, titulo: "Levantamiento de requerimientos" },
    { num: 3, titulo: "Modelado de procesos (BPMN)" },
    { num: 4, titulo: "Arquitectura (C4 + vistas)" },
    { num: 5, titulo: "Diseño de datos (MER → SQL)" },
    { num: 6, titulo: "Front-end base" },
    { num: 7, titulo: "Back-end base" },
    { num: 8, titulo: "Autenticación" },
    { num: 9, titulo: "Integración de datos" },
    { num: 10, titulo: "Pruebas" },
    { num: 11, titulo: "Seguridad" },
    { num: 12, titulo: "DevOps" },
    { num: 13, titulo: "BI & Dashboards" },
    { num: 14, titulo: "Ajustes finales" },
    { num: 15, titulo: "Ensayo de sustentación" },
    { num: 16, titulo: "Entrega final" }
];

const grid = document.getElementById('gridSemanas');

// ✅ Crear las tarjetas de semanas
semanas.forEach(semana => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <h3>Semana ${semana.num}</h3>
        <p>${semana.titulo}</p>
        <div class="btn-group">
            <button class="btn" onclick="verArchivo('Semana${semana.num}')">📄 Ver</button>
            <label class="btn">
                📂 Subir
                <input type="file" style="display:none" onchange="subirArchivo(this, 'Semana${semana.num}')">
            </label>
            <button class="btn btn-delete" onclick="borrarArchivo('Semana${semana.num}')">🗑 Borrar</button>
        </div>
        <small id="Semana${semana.num}" class="archivo-subido"></small>
    `;
    grid.appendChild(card);
});

// ✅ Cargar archivos existentes desde Supabase
async function cargarArchivosExistentes() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuario) return;

    try {
        const { data: files, error } = await supabase.storage
            .from('archivos_portafolio')
            .list(usuario.email);

        if (error) {
            console.error('Error al cargar archivos:', error);
            return;
        }

        // Mostrar archivos existentes en las semanas correspondientes
        if (files) {
            files.forEach(file => {
                const semanaMatch = file.name.match(/Semana(\d+)/);
                if (semanaMatch) {
                    const semanaId = `Semana${semanaMatch[1]}`;
                    const span = document.getElementById(semanaId);
                    if (span) {
                        // Mostrar nombre del archivo sin el timestamp
                        const nombreArchivo = file.name.replace(/Semana\d+-\d+-/, '');
                        span.textContent = `✅ ${nombreArchivo}`;
                        span.dataset.fileName = `${usuario.email}/${file.name}`;
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// ✅ Subir archivo a Supabase Storage
async function subirArchivo(input, semanaId) {
    const archivo = input.files[0];
    if (!archivo) return;

    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuario) {
        alert('⚠️ Primero inicia sesión.');
        return;
    }

    // Nombre único para el archivo
    const nombreArchivo = `${usuario.email}/${semanaId}-${Date.now()}-${archivo.name}`;

    try {
        // Subir archivo
        const { data, error } = await supabase.storage
            .from('archivos_portafolio')
            .upload(nombreArchivo, archivo, {
                upsert: false // Cambiado a false para evitar reemplazo automático
            });

        if (error) throw error;

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from('archivos_portafolio')
            .getPublicUrl(nombreArchivo);

        // Actualizar interfaz
        const span = document.getElementById(semanaId);
        span.textContent = `✅ ${archivo.name}`;
        span.dataset.fileName = nombreArchivo;
        span.dataset.url = urlData.publicUrl;

        // Limpiar el input
        input.value = '';

        alert('✅ Archivo subido correctamente.');

    } catch (error) {
        console.error('Error al subir:', error);
        alert('❌ Error al subir el archivo: ' + error.message);
    }
}

// ✅ Ver archivo
async function verArchivo(semanaId) {
    const span = document.getElementById(semanaId);
    const fileName = span.dataset.fileName;

    if (!fileName) {
        alert('⚠️ No hay archivo subido para esta semana.');
        return;
    }

    try {
        // Obtener URL de descarga
        const { data, error } = await supabase.storage
            .from('archivos_portafolio')
            .createSignedUrl(fileName, 60); // Válido por 60 segundos

        if (error) throw error;

        // Abrir en nueva pestaña
        window.open(data.signedUrl, '_blank');

    } catch (error) {
        console.error('Error al ver archivo:', error);
        alert('❌ Error al abrir el archivo.');
    }
}

// ✅ Borrar archivo de Supabase
async function borrarArchivo(semanaId) {
    const span = document.getElementById(semanaId);
    const fileName = span.dataset.fileName;

    if (!fileName || !confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
        return;
    }

    try {
        const { error } = await supabase.storage
            .from('archivos_portafolio')
            .remove([fileName]);

        if (error) throw error;

        // Limpiar interfaz
        span.textContent = '';
        delete span.dataset.fileName;
        delete span.dataset.url;

        alert('🗑 Archivo eliminado correctamente.');

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('❌ Error al eliminar el archivo.');
    }
}

// ✅ Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
}