CREATE TABLE pelicula (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,titulo VARCHAR(100),duracion INT(5),director VARCHAR(400),anio INT(5),fecha_lanzamiento DATE,puntuacion INT(2),poster VARCHAR(300),trama VARCHAR(700));

source C:\Users\Usuario1\Google Drive\Cursos\Full Stack\9-que-veo-hoy-recursos\scripts\script-paso-1-peliculas.sql;

CREATE TABLE genero (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,nombre VARCHAR(30));

alter table pelicula add column genero_id INT(5) after trama; /*Agrego columna a tabla pelicula para poder correr script numero 2*/

source C:\Users\Usuario1\Google Drive\Cursos\Full Stack\9-que-veo-hoy-recursos\scripts\script-paso-2-generos.sql