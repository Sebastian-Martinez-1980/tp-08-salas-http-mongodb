# TP 08 --- Endpoints persistentes de reservas de salas

## 1. Descripción

El objetivo  de este proyecto es migrar la creación, el listado y la consulta de reservas desde una implementación
en memoria/JSON a MongoDB Atlas, conservando el sitio HTML y agregando una API REST que responde en JSON.

El sitio web y la API deben utilizar el mismo modelo, servicio y base de
datos.

-   **Nombre sugerido del proyecto:** `tp-08-salas-http-mongodb`
-   **Base de datos Atlas:** `reservas_salas_u8`
-   **Colección:** `reservas`
-   **Modalidad:** individual
-   **Entrega:** URL del repositorio GitHub, según la fecha indicada en
    la consigna.

## 2. Origen de la copia

El punto de partida es una **copia funcional e individual del TP 07**.
Se debe conservar la entrega anterior y trabajar en una
carpeta/repositorio separado.

Al copiar el proyecto:

-   No copiar el historial Git (`.git`).
-   No copiar `node_modules`.
-   No copiar el archivo privado `.env`.
-   Conservar `package.json`, `package-lock.json`, la configuración de calidad y las versiones existentes.
-   Mantener la estructura por capas de la entrega anterior y adaptar las operaciones de reservas para que sean asíncronas.


## 3. Versiones y dependencias

El proyecto debe conservar las versiones del manifiesto y del lockfile de la copia del TP 07; no actualizar todas las dependencias como parte
de esta migración.

Registrar las versiones reales ejecutando desde la terminal:

node --version
npm --version
npm ls express mongoose


Componente        Versión / estado
----------------- --------------------------------------------------
Node.js           Completar con `node --version`
npm               Completar con `npm --version`
Express           Completar con `npm ls express`
Mongoose          Completar con `npm ls mongoose`
MongoDB Atlas     Clúster Free (M0), según la consigna
Modo de módulos   CommonJS (`require` / `module.exports`)
Lockfile          `package-lock.json`, conservar en el repositorio

No declarar versiones que no se hayan comprobado en el entorno del
proyecto.

## 4. Preparación de MongoDB Atlas

1.  Ingresar a MongoDB Atlas y se reutilizar el clúster de práctica Free
    (M0).
2.  Configurar un usuario de base de datos y la lista de direcciones IP
    autorizadas para el entorno desde el que se ejecutará el proyecto.
3.  Obtener la URI de conexión del clúster.
4.  Usar la base `reservas_salas_u8` en la URI. La base y la colección
    pueden aparecer cuando se guarde el primer documento; no es
    necesario insertar una semilla desde el panel.
5.  No borrar ni migrar silenciosamente los datos del TP 07.
6.  Verificar la conexión antes de iniciar la aplicación.

### Variables de entorno

Crear localmente un archivo `.env` a partir de la plantilla
.env.example

PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u8?retryWrites=true&w=majority

USUARIO, CLAVE y HOST son marcadores ilustrativos: se debe reemplazarlos
únicamente en el archivo local por los datos reales de Atlas MongoDB.

El archivo .env contiene secretos y *no debe subirse a GitHub*. La
plantilla .env.example sí se entrega, con marcadores y sin
credenciales reales. 

### Entorno y DNS

La aplicación debe leer la configuración de entorno y establecer la
conexión con MongoDB antes de abrir el puerto HTTP.

La clase indica conservar en **src/config/base-datos.js** la corrección
DNS con *node:dns* y:

js
dns.setServers(["8.8.8.8", "1.1.1.1"]);


Este ajuste debe utilizarse **solo si está autorizado y funciona en la
red utilizada**. Registrar aquí el estado real:

-   Ajuste DNS aplicado: *PENDIENTE: sí / no*.
-   Motivo o diagnóstico: *PENDIENTE*.
-   Prueba de conexión: *PENDIENTE: comando y resultado observado*.

Cambiar resolutores no soluciona credenciales incorrectas, IP no
autorizada, URI inválida ni falta de conectividad. No duplicar el ajuste
DNS por solicitud. Ante un fallo de conexión al inicio, el servidor no
debe anunciar que está disponible.

## 5. Instalación y ejecución

Desde la carpeta raíz del proyecto, ejecutar desde la terminal:

npm install

Ejecutar los controles disponibles en el `package.json`:

npm run format
npm run check

Si esos scripts no existen en la copia, revisar los nombres definidos en
*package.json* y documentar los comandos reales.

Iniciar el sitio cargando el archivo local de entorno:

node --env-file=.env src/index.js


Si el proyecto tiene un script equivalente que carga .env, también
puede utilizarse.

Con PORT=3000, la aplicación debería informar que está disponible en:

http://localhost:3000

La conexión a Atlas debe completarse antes de ejecutar `listen`.


## 6. Estructura por capas

La organización prevista por la consigna es:

tp-08-salas-http-mongodb/
├── src/
│   ├── index.js
│   ├── app.js
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   ├── modelos/
│   │   └── reserva.js
│   ├── servicios/
│   │   └── reservas-mongo.js
│   ├── controladores/
│   │   └── reservas.js
│   ├── rutas/
│   │   ├── reservas.js
│   │   └── reservas-api.js
│   └── middleware/
│       ├── reservas.js
│       ├── solicitudes.js
│       └── errores.js
├── scripts/
├── views/
├── public/
├── datos/                 
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md


### Responsabilidad de cada capa

- `src/index.js`: lee el entorno, conecta con Atlas, crea el servicio y la aplicación, inicia el servidor y gestiona su cierre.
- `src/app.js`: configura Express, vistas, recursos estáticos, parsers, middleware, routers, 404 y manejador de errores.
- `src/config/`: centraliza configuración del entorno y conexión a MongoDB.
- `src/modelos/reserva.js`: define los campos y reglas del esquema Mongoose.
- `src/servicios/reservas-mongo.js`: ejecuta consultas y escrituras asíncronas; no define rutas HTTP ni envía respuestas.
- `src/controladores/reservas.js`: espera las operaciones del servicio y decide las respuestas HTML o JSON.
- `src/rutas/`: separa las rutas del sitio HTML de los endpoints de la API JSON.
- `src/middleware/`: valida la entrada, prepara datos de solicitud y procesa errores.
- `scripts/`:conserva herramientas de diagnóstico o pruebas de terminal; no se importa un script de ejecución puntual desde el servidor.
- `views/` y `public/`: mantienen las plantillas HTML, estilos y recursos estáticos.

El servicio anterior en memoria puede conservarse como referencia, pero debe dejar de importarse en el arranque persistente. El JSON anterior
también puede conservarse como referencia, pero no debe cargarse automáticamente.

## 7. Modelo de reserva y validación

El recurso conserva los seis campos del TP 07 y agrega un estado por
defecto:

  -----------------------------------------------------------------------
  Campo                               Regla de entrada
  ----------------------------------- -----------------------------------
  `estudiante`                        Texto obligatorio, se recortan
                                      espacios externos (`trim`)

  `email`                             Texto obligatorio; debe contener
                                      `@`

  `sala`                              Texto obligatorio; `Sala Norte`,
                                      `Sala Sur` o `Sala Multimedia`

  `fecha`                             Texto obligatorio, con `trim`

  `turno`                             `Mañana`, `Tarde` o `Noche`

  `personas`                          Número entero entre 1 y 6

  `estado`                            Default `pendiente`; el esquema
                                      admite `pendiente` y `confirmada`,
                                      pero el cliente no lo asigna al
                                      crear
  -----------------------------------------------------------------------

En la creación, copiar explícitamente solo los seis campos admitidos. No
pasar req.body completo a Mongoose. Los campos extra como `estado` o
`_id` enviados por el cliente no deben controlar el documento creado.

El identificador público `id` es la representación textual del
`ObjectId` de MongoDB. No convertir los parámetros de ID con `Number()`.

## 8. Endpoints

Dirección base local: `http://localhost:3000`

 
  Método            Endpoint                            Propósito                   Resultado esperado
  ----------------- ----------------------------------- ----------------- -----------------
  GET               `/`                                 Página de inicio            `200` y HTML

  GET               `/reservas`                         Listado HTML de reservas   `200` y HTML
          

  GET               `/reservas/nueva`                   Formulario HTML             `200` y HTML

  POST              `/reservas`                         Crear desde el              `302` hacia el
                                                        formulario                  listado si
                                                                                    guarda; `400` si
                                                                                    la entrada es
                                                                                    inválida

  GET               `/api/reservas`                     Listar reservas   `200` y arreglo
                                                                          JSON; `[]` es
                                                                          válido

  GET               `/api/reservas/:id`                 Consultar una     `200`, `400` si
                                                        reserva           ID mal formado,
                                                                          `404` si ID
                                                                          válido no existe

  POST              `/api/reservas`                     Crear una reserva `201`, recurso
                                                        desde JSON        guardado y
                                                                          cabecera
                                                                          `Location`; `400`
                                                                          si la entrada es
                                                                          inválida

  GET               `/api/reservas?sala=Sala%20Norte`   Filtrar por sala  `200` con
                                                        exacta            coincidencias o
                                                                          `[]`; `400` si el
                                                                          parámetro está
                                                                          repetido

  Cualquier ruta    `/api/...`                          Ruta inexistente  `404` JSON
  API desconocida                                                         

  Cualquier ruta    Ruta inexistente                    Página no         `404` HTML
  HTML desconocida                                      encontrada        
  -----------------------------------------------------------------------------------------

La consigna también requiere que `/estado` conserve el contrato del TP
07 y obtenga el conteo desde MongoDB, no desde una semilla. Documentar
su ruta y respuesta exactas según la implementación heredada:
`PENDIENTE DE VERIFICAR EN EL CÓDIGO`.

No se implementan `PUT`, `PATCH` ni `DELETE` en este TP.

## 9. Ejemplo JSON para crear una reserva

En Postman, configurar:

-   Método:`POST`
-   URL: `http://localhost:3000/api/reservas`
-   Body: `raw` → `JSON`
-   Header de solicitud: `Content-Type: application/json`

Cuerpo de ejemplo con datos ficticios:

json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2
}


La fecha es ilustrativa: la consigna exige texto no vacío, pero no una
fecha real o futura. No enviar `estado` ni `_id`.

### Respuesta esperada de creación

El servidor debe responder `201 Created`, devolver el documento guardado
con un `id` textual y `estado: "pendiente"`, y enviar la cabecera de
respuesta `Location` con la dirección del recurso creado.

Ejemplo de forma de respuesta (el `id` real lo genera MongoDB):

json
{
  "id": "ID_REAL_GENERADO_POR_MONGODB",
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2,
  "estado": "pendiente"
}


El marcador `ID_REAL_GENERADO_POR_MONGODB` es ilustrativo y no debe
usarse literalmente. Copiar el ID y la cabecera `Location` de la
respuesta real. Luego realizar un `GET` a esa dirección para comprobar
que devuelve el mismo recurso.

## 10. Matriz de pruebas

Los resultados de la segunda columna son los esperados según la
consigna. Completar el resultado observado y la evidencia después de
ejecutar cada prueba en Postman o el navegador.

  -----------------------------------------------------------------------
  Caso                    Resultado esperado      Resultado observado /
                                                  evidencia
  ----------------------- ----------------------- -----------------------
  Listado inicial con     `200`, `[]`             Pendiente
  base vacía                                      

  Crear reserva válida    `201`, documento y      Pendiente
  por API                 `Location`              

  Consultar el ID creado  `200`, mismo recurso    Pendiente

  Consultar ID `1`        `400` JSON              Pendiente

  Consultar ID válido     `404` JSON, si no       Pendiente
  inexistente             existe                  

  Estudiante vacío        `400`, sin aumento de   Pendiente
                          cantidad                

  Email sin `@`           `400`, sin aumento de   Pendiente
                          cantidad                

  Sala no permitida       `400`, sin aumento de   Pendiente
                          cantidad                

  Turno no permitido      `400`, sin aumento de   Pendiente
                          cantidad                

  Fecha vacía             `400`                   Pendiente

  `personas`: `0`, `7`,   `400`                   Pendiente
  `2.5` o `"abc"`                                 

  `personas`: booleano,   `400`                   Pendiente
  arreglo u objeto                                

  POST sin cuerpo         `400` JSON              Pendiente

  JSON mal formado        `400` JSON              Pendiente

  Campos extra `estado` o El servidor no los      Pendiente
  `_id`                   acepta del cliente;     
                          crea con ID propio y    
                          estado pendiente        

  Filtro por sala exacta  `200`, solo             Pendiente
                          coincidencias           

  Filtro sin              `200`, `[]`             Pendiente
  coincidencias                                   

  Parámetro `sala`        `400` JSON              Pendiente
  repetido                                        

  Listar dos veces sin    Cantidad estable        Pendiente
  cambios                                         

  Formulario válido       `302` y reserva visible Pendiente

  Formulario inválido     `400` y valores         Pendiente
                          conservados             

  `/estado`               Conteo consultado desde Pendiente
                          MongoDB                 

  Ruta API inexistente    `404` JSON              Pendiente

  Fallo de arranque por   No abre el puerto ni    Pendiente
  URI ausente o conexión  anuncia disponibilidad  
  fallida                                         

  Reinicio del servidor   Se conserva el mismo ID Pendiente
                          y los mismos datos      
  -----------------------------------------------------------------------

Para verificar que una solicitud inválida no escribió datos, consultar
el listado sin filtros antes y después y comparar las cantidades. La
prueba de campos extra es una creación válida: debe anotarse como tal y
aumenta la cantidad.

## 11. Prueba de reinicio y persistencia

1.  Iniciar el servidor con el comando documentado y mantenerlo activo.
2.  Ejecutar `GET http://localhost:3000/api/reservas`; registrar la cantidad inicial.
3.  Ejecutar una sola vez el `POST` válido. Guardar el `id` y la cabecera `Location`.
4.  Consultar la URL de `Location` mediante `GET` y comprobar el mismo ID y los mismos campos.
5.  Detener el servidor con `Ctrl + C` para permitir el cierre ordenado.
6.  Volver a iniciar el servidor con el mismo archivo `.env` y la misma base de Atlas.
7.  Repetir el `GET` al mismo ID. Deben conservarse el ID y los datos; no repetir el `POST`.
8.  Consultar el listado dos veces y verificar que la cantidad permanezca estable.
9.  En Atlas Data Explorer, comprobar el documento en `reservas_salas_u8` → `reservas` y comparar su `_id`.
10. Guardar capturas de Postman y Atlas sin mostrar credenciales ni URI privada.

## 12. Límites de validación y alcance

Esta entrega es una API de aprendizaje, no una API lista para
producción.

Las validaciones requeridas NO garantizan:

-   Que el email tenga un formato completo o que la dirección exista.
-   Que la fecha sea real, futura o compatible con el calendario.
-   Que no haya reservas con horarios superpuestos.
-   Que los cupos compartidos estén disponibles.
-   Que no existan reservas duplicadas.
-   Que haya autenticación o autorización de usuarios.
-   Que el formulario tenga protección adicional contra solicitudes maliciosas.
-   Que se pueda confirmar una reserva mediante un endpoint: la API del TP 08 no incorpora esa operación.
-   Que existan paginación, ordenamiento, actualización o eliminación.
