CREATE DATABASE peliculas;
USE peliculas;
CREATE TABLE pelicula (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,titulo VARCHAR(100),duracion INT(5),director VARCHAR(400),anio INT(5),fecha_lanzamiento DATE,puntuacion INT(2),poster VARCHAR(300),trama VARCHAR(700));
SOURCE script-paso-1-peliculas.sql;
CREATE TABLE genero (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,nombre VARCHAR(30));
alter table pelicula add column genero_id INT(5) after trama;
SOURCE script-paso-2-generos.sql;
CREATE TABLE actor (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,nombre VARCHAR(30));
CREATE TABLE actor_pelicula (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,actor_id INT(6),pelicula_id INT(6));
source script-paso-3-actores.sql