CREATE DATABASE SOPES_P1;
USE SOPES_P1;

CREATE  TABLE prueba(
    id_prueba INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100)
);

INSERT INTO prueba(descripcion)
VALUES('cuchau');
INSERT INTO prueba(descripcion)
VALUES('cuchau1');
INSERT INTO prueba(descripcion)
VALUES('cuchau2');

SELECT * FROM prueba;


CREATE  TABLE monitoreo(
    id_history INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME,
    ram DECIMAL(6,2),
    cpu DECIMAL(6,2),
    maquina VARCHAR(20)
);

SELECT id_history, DATE_FORMAT(fecha, '%d/%m/%Y %H:%i') AS fecha, ram, cpu, maquina FROM monitoreo
