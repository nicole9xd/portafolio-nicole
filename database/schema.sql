-- TABLA DE ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL  -- 'admin', 'usuario', 'invitado'
);

-- TABLA DE USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id INT REFERENCES roles(id) NOT NULL
);

-- TABLA DE ARCHIVOS
CREATE TABLE archivos (
    id SERIAL PRIMARY KEY,
    semana INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url_archivo VARCHAR(255),
    creado_por INT REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles base
INSERT INTO roles (nombre) VALUES ('admin'), ('usuario'), ('invitado');

-- Insertar usuario admin inicial
INSERT INTO usuarios (usuario, nombre, password, rol_id)
VALUES ('nicole', 'Nicole', '1234', 1);
