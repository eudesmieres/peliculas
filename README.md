# Peliculas
Este es un proyecto de React.js iniciado con create-react-app.

## Tecnologías utilizadas
- React.js
- Node.js
- Express.js
- Mysql
- Sequelize
- Axios
- JavaScript
- CSS
- Git

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

- Node.js (versión 18.12.1)
- NPM  o Yarn
- nodemon (versión 2.0.22)
- react (versión 18.2.0)

## Configuración

Sigue los pasos a continuación para configurar el proyecto:

1. Clona el repositorio en tu máquina local:
git clone: https://github.com/eudesmieres/peliculas.git

2. Instala las dependencias del proyecto:
 npm install
# or
yarn install

## Uso

Sigue los pasos a continuación para ejecutar el proyecto:

1. Inicia la aplicación:
Ejecute el servidor de desarrollo:

npm start
# or
yarn dev

2. Abre tu navegador web y visita la siguiente URL: http://localhost:3000 para ver el resultado.


## Configuración de la base de datos

1. Crea una base de datos en tu MySQL con el nombre peliculas: 

   CREATE DATABASE peliculas;

2. Verifica que la base de datos se haya creado correctamente ejecutando el siguiente comando:

   SHOW DATABASES;

3. Crea un archivo de configuración .env en la raíz de la Carpeta Back.

4. Abre el archivo .env y proporciona los siguientes valores para configurar la conexión a la base de datos:

DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost

Asegúrate de reemplazar tu_usuario y tu_contraseña con tus propias credenciales.

Guarda el archivo .env.

5. Ahora puedes utilizarla y establecer la conexión utilizando las credenciales correspondientes en el archivo .env.


## Información Adicional

Si deseas cargar archivos CSV en el proyecto el separador que se trabaja en este es  ";"
