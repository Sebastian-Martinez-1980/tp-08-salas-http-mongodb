# TP 08 --- Endpoints persistentes de reservas de salas

## 1. Descripción

Este proyecto corresponde al Trabajo Práctico 08 de la Unidad 8 del
curso de Desarrollo Back-end con Node.js. El objetivo es migrar la
creación, el listado y la consulta de reservas desde una implementación
en memoria/JSON a MongoDB Atlas, conservando el sitio HTML y agregando
una API REST que responde en JSON.

El sitio web y la API deben utilizar el mismo modelo, servicio y base de
datos. Los datos no deben cargarse automáticamente desde una semilla al
iniciar el servidor ni al consultar el listado.

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
-   Conservar `package.json`, `package-lock.json`, la configuración de
    calidad y las versiones existentes.
-   Mantener la estructura por capas de la entrega anterior y adaptar
    las operaciones de reservas para que sean asíncronas.

**Procedencia concreta de esta copia:** completar con la URL o el nombre
del repositorio TP 07 utilizado: `PENDIENTE`.

## 3. Versiones y dependencias

El proyecto debe conservar las versiones del manifiesto y del lockfile
de la copia del TP 07; no actualizar todas las dependencias como parte
de esta migración.

Registrar las versiones reales ejecutando:

``` bash
node --version
npm --version
npm ls express mongoose
```

  Componente        Versión / estado
  ----------------- --------------------------------------------------
  Node.js           Completar con `node --version`
  npm               Completar con `npm --version`
  Express           Completar con `npm ls express`
  Mongoose          Completar con `npm ls mongoose`
  MongoDB Atlas     Clúster Free (M0), según la consigna
  Modo de módulos   CommonJS (`require` / `module.exports`)
  Lockfile          `package-lock.json`, conservar en el repositorio

El `package.json` declara Node.js `>=20.19.0`, requerido por
Mongoose `9.10.3` del lockfile. Verificar la versión instalada antes de
ejecutar `npm install`. No declarar versiones de ejecución como
comprobadas en el equipo del alumno si no se ejecutó allí
`node --version` y `npm ls express mongoose`.

## 4. Preparación de MongoDB Atlas

1.  Ingresar a MongoDB Atlas y reutilizar el clúster de práctica Free
    (M0), con acceso autorizado.
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
`.env.example`:

``` dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u8?retryWrites=true&w=majority
```

`USUARIO`, `CLAVE` y `HOST` son marcadores ilustrativos: reemplazarlos
únicamente en el archivo local por los datos reales de Atlas. Si la
contraseña contiene caracteres especiales, codificarlos correctamente
para una URI.

El archivo `.env` contiene secretos y **no debe subirse a GitHub**. La
plantilla `.env.example` sí se entrega, con marcadores y sin
credenciales reales. Verificar que `.gitignore` excluya `.env` y
`node_modules`.

### Entorno y DNS

La aplicación debe leer la configuración de entorno y establecer la
conexión con MongoDB antes de abrir el puerto HTTP.

La clase indica conservar en `src/config/base-datos.js` la corrección
DNS con `node:dns` y:

``` js
dns.setServers(["8.8.8.8", "1.1.1.1"]);
```

Este ajuste debe utilizarse **solo si está autorizado y funciona en la
red utilizada**. Registrar aquí el estado real:

-   Ajuste DNS aplicado: `PENDIENTE: sí / no`.
-   Motivo o diagnóstico: `PENDIENTE`.
-   Prueba de conexión: `PENDIENTE: comando y resultado observado`.

Cambiar resolutores no soluciona credenciales incorrectas, IP no
autorizada, URI inválida ni falta de conectividad. No duplicar el ajuste
DNS por solicitud. Ante un fallo de conexión al inicio, el servidor no
debe anunciar que está disponible.

## 5. Instalación y ejecución

Desde la carpeta raíz del proyecto:

``` bash
npm ci
```

Ejecutar los controles disponibles en el `package.json`:

``` bash
npm run format
npm run check
```

Si esos scripts no existen en la copia, revisar los nombres definidos en
`package.json` y documentar los comandos reales.

Iniciar cargando el archivo local de entorno:

``` bash
npm run start:local
```

El script ejecuta `node --env-file=.env src/index.js`. El comando
`npm start` ejecuta el servidor sin cargar `.env` automáticamente y
requiere que las variables ya estén disponibles en el entorno. No iniciar dos servidores simultáneamente sobre el
mismo puerto.

Con `PORT=3000`, la aplicación debería informar que está disponible en:

`http://localhost:3000`

La conexión a Atlas debe completarse antes de ejecutar `listen`. El
servidor mantiene la conexión durante las solicitudes y contempla cierre
ordenado al recibir `SIGINT` o `SIGTERM`.

## 6. Estructura por capas

La estructura exacta debe coincidir con los archivos que existan en el
repositorio. La organización prevista por la consigna es:

``` text
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
├── datos/                 # referencia anterior, si se conserva
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidad de cada capa

-   **`src/index.js`:** lee el entorno, conecta con Atlas, crea el
    servicio y la aplicación, inicia el servidor y gestiona su cierre.
-   **`src/app.js`:** configura Express, vistas, recursos estáticos,
    parsers, middleware, routers, la ruta `/estado`, 404 y manejador de
    errores.
-   **`src/config/`:** centraliza configuración del entorno y conexión a
    MongoDB.
-   **`src/modelos/reserva.js`:** define los campos y reglas del esquema
    Mongoose.
-   **`src/servicios/reservas-mongo.js`:** ejecuta consultas y
    escrituras asíncronas; no define rutas HTTP ni envía respuestas.
-   **`src/controladores/reservas.js`:** espera las operaciones del
    servicio y decide las respuestas HTML o JSON.
-   **`src/rutas/`:** separa las rutas del sitio HTML de los endpoints
    de la API JSON.
-   **`src/middleware/`:** valida la entrada, prepara datos de solicitud
    y procesa errores.
-   **`scripts/`:** conserva herramientas de diagnóstico o pruebas de
    terminal; no se importa un script de ejecución puntual desde el
    servidor.
-   **`views/` y `public/`:** mantienen las plantillas HTML, estilos y
    recursos estáticos.

El servicio anterior en memoria puede conservarse como referencia, pero
debe dejar de importarse en el arranque persistente. El JSON anterior
también puede conservarse como referencia, pero no debe cargarse
automáticamente.

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

  `estado`                            Default `pendiente`; enum:
                                      `pendiente` o `confirmada`.
                                      El cliente no lo asigna al crear
  -----------------------------------------------------------------------

En la creación, copiar explícitamente solo los seis campos admitidos. No
pasar `req.body` completo a Mongoose. Los campos extra como `estado` o
`_id` enviados por el cliente no deben controlar el documento creado.

El identificador público `id` es la representación textual del
`ObjectId` de MongoDB. No convertir los parámetros de ID con `Number()`.

## 8. Endpoints

Dirección base local: `http://localhost:3000`

  -----------------------------------------------------------------------------------------
  Método            Endpoint                            Propósito         Resultado
                                                                          esperado
  ----------------- ----------------------------------- ----------------- -----------------
  GET               `/`                                 Página de inicio  `200` y HTML

  GET               `/estado`                           Estado del         `200` JSON con
                                                        servicio y conteo  servicio,
                                                        persistente        reservas y
                                                                          solicitud

  GET               `/reservas`                         Listado HTML de   `200` y HTML
                                                        reservas          

  GET               `/reservas/nueva`                   Formulario HTML   `200` y HTML

  POST              `/reservas`                         Crear desde el    `302` hacia el
                                                        formulario        listado si
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

La ruta `GET /estado` conserva el contrato del TP 07. Responde HTTP
`200` con JSON y calcula el total directamente desde MongoDB:

``` json
{
  "servicio": "activo",
  "reservas": 0,
  "solicitud": "SOL-0001"
}
```

`reservas` es el conteo actual de documentos en la colección y
`solicitud` es el identificador asignado a esa petición. El valor `0`
del ejemplo es ilustrativo; no representa el contenido real de Atlas.

No se implementan `PUT`, `PATCH` ni `DELETE` en este TP.

## 9. Ejemplo JSON para crear una reserva

En Postman, configurar:

-   **Método:** `POST`
-   **URL:** `http://localhost:3000/api/reservas`
-   **Body:** `raw` → `JSON`
-   **Header de solicitud:** `Content-Type: application/json`

Cuerpo de ejemplo con datos ficticios:

``` json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2
}
```

La fecha es ilustrativa: la consigna exige texto no vacío, pero no una
fecha real o futura. No enviar `estado` ni `_id`.

### Respuesta esperada de creación

El servidor debe responder `201 Created`, devolver el documento guardado
con un `id` textual y `estado: "pendiente"`, y enviar la cabecera de
respuesta `Location` con la dirección del recurso creado.

Ejemplo de forma de respuesta (el `id` real lo genera MongoDB):

``` json
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
```

El marcador `ID_REAL_GENERADO_POR_MONGODB` es ilustrativo y no debe
usarse literalmente. Copiar el ID y la cabecera `Location` de la
respuesta real. Luego realizar un `GET` a esa dirección para comprobar
que devuelve el mismo recurso.

## 10. Matriz de pruebas y registro de persistencia

Los códigos de la columna "Esperado" son los que debe devolver la
aplicación. Las columnas de observación deben completarse con la
ejecución real contra la base `reservas_salas_u8`, colección `reservas`.
No se deben inventar IDs ni cantidades.

| Prueba | Esperado | Observado | ID / cantidad / evidencia |
|---|---|---|---|
| Listado inicial con colección vacía | `200`, `[]` | Pendiente | Cantidad inicial: `PENDIENTE` |
| Crear reserva válida por API | `201`, JSON y `Location` | Pendiente | ID real: `PENDIENTE`; cantidad antes/después: `PENDIENTE` |
| Consultar el ID creado | `200`, mismo recurso | Pendiente | ID consultado: `PENDIENTE` |
| Consultar ID `1` | `400` JSON | Pendiente | Sin escritura; cantidad: `PENDIENTE` |
| Consultar ObjectId válido inexistente | `404` JSON | Pendiente | Sin escritura |
| Estudiante vacío | `400` | Pendiente | Cantidad antes/después: `PENDIENTE` |
| Email sin `@` | `400` | Pendiente | Cantidad antes/después: `PENDIENTE` |
| Sala no permitida | `400` | Pendiente | Cantidad antes/después: `PENDIENTE` |
| Turno no permitido | `400` | Pendiente | Cantidad antes/después: `PENDIENTE` |
| Fecha vacía o imposible | `400` | Pendiente | Cantidad antes/después: `PENDIENTE` |
| `personas`: `0`, `7`, `2.5` o `"abc"` | `400` | Pendiente | Cantidad antes/después: `PENDIENTE` |
| `personas`: booleano, arreglo u objeto | `400` | Pendiente | Cantidad antes/después: `PENDIENTE` |
| POST sin cuerpo | `400` JSON | Pendiente | Cantidad antes/después: `PENDIENTE` |
| JSON mal formado | `400` JSON | Pendiente | Cantidad antes/después: `PENDIENTE` |
| Enviar `estado` o `_id` en el POST | `201`; ignora esos campos, ID propio y estado `pendiente` | Pendiente | ID real: `PENDIENTE`; cantidad antes/después: `PENDIENTE` |
| Filtro `?sala=Sala%20Norte` | `200`, solo coincidencias | Pendiente | Cantidad devuelta: `PENDIENTE` |
| Filtro por sala sin coincidencias | `200`, `[]` | Pendiente | Cantidad devuelta: `0` |
| Parámetro `sala` repetido | `400` JSON | Pendiente | Sin escritura |
| Listar dos veces sin cambios | Misma cantidad | Pendiente | Primera/segunda consulta: `PENDIENTE` |
| Formulario válido | `302` y reserva visible | Pendiente | Cantidad antes/después: `PENDIENTE` |
| Formulario inválido | `400`, errores y valores conservados | Pendiente | Cantidad antes/después: `PENDIENTE` |
| `/estado` | `200`, conteo obtenido de MongoDB | Pendiente | `reservas`: `PENDIENTE` |
| Ruta API inexistente | `404` JSON | Pendiente | — |
| URI ausente o conexión fallida al iniciar | No abre el puerto | Pendiente | Error observado: `PENDIENTE` |

**Cómo completar la evidencia:** para cada caso negativo, consultar
`GET /api/reservas` antes y después y registrar ambas cantidades. Deben
ser iguales. Para una creación válida, registrar la cantidad anterior,
la posterior, el ID de MongoDB y la cabecera `Location`. Para los
campos extra `estado` y `_id`, la prueba es una creación válida: aumenta
la cantidad en uno, pero el servidor debe generar su propio ID y asignar
`estado: "pendiente"`.

## 11. Prueba de reinicio y persistencia

1. Iniciar el servidor con `npm run start:local`.
2. Ejecutar `GET http://localhost:3000/api/reservas` y registrar la
   cantidad inicial.
3. Ejecutar una sola vez el POST válido de la sección 9.
4. Guardar el `id` de la respuesta y la cabecera `Location`.
5. Ejecutar un GET a la URL de `Location` y comprobar el mismo ID,
   campos y `estado: "pendiente"`.
6. Detener el servidor con `Ctrl + C` para permitir el cierre ordenado.
7. Iniciar nuevamente con el mismo `.env` y la misma base de Atlas.
8. Repetir el GET al mismo ID. Deben conservarse el ID y los datos; no
   repetir el POST.
9. Consultar el listado dos veces y verificar que la cantidad permanezca
   estable.
10. En Atlas Data Explorer, comprobar el documento en
    `reservas_salas_u8` → `reservas` y comparar su `_id`.

**Registro de evidencia de reinicio:**

- ID creado: `PENDIENTE`
- Cantidad antes de crear: `PENDIENTE`
- Cantidad después de crear: `PENDIENTE`
- Cabecera `Location`: `PENDIENTE`
- GET antes del reinicio: `PENDIENTE`
- GET después del reinicio: `PENDIENTE`
- Mismo ID, campos y estado confirmados: `PENDIENTE`
- Capturas de Postman y Atlas: `PENDIENTE`

## 12. Límites de validación y alcance

Esta entrega es una API de aprendizaje, no una API lista para
producción.

Las validaciones requeridas **no** garantizan:

-   Que el email tenga un formato completo o que la dirección exista.
-   Que la fecha sea real, futura o compatible con el calendario.
-   Que no haya reservas con horarios superpuestos.
-   Que los cupos compartidos estén disponibles.
-   Que no existan reservas duplicadas.
-   Que haya autenticación o autorización de usuarios.
-   Que el formulario tenga protección adicional contra solicitudes
    maliciosas.
-   Que se pueda confirmar una reserva mediante un endpoint: la API del
    TP 08 no incorpora esa operación.
-   Que existan paginación, ordenamiento, actualización o eliminación.

No se exige un índice único. No publicar el servidor en Internet sin las
protecciones previstas en unidades posteriores.

Los errores de entrada deben distinguirse de los errores internos: `400`
para entradas inválidas, `404` para recurso inexistente o ruta
desconocida, y `500` para fallos inesperados de operación. Los errores
de la API deben responder JSON sin trazas, credenciales ni URI de
conexión. Un fallo de Atlas no debe presentarse como un listado vacío
exitoso.

## 13. Comparación con el TP 07

  -----------------------------------------------------------------------
  Aspecto                 TP 07 (punto de         TP 08 (objetivo)
                          partida)                
  ----------------------- ----------------------- -----------------------
  Persistencia de         Completar según la      MongoDB Atlas, base
  reservas                implementación          `reservas_salas_u8`,
                          heredada; el TP 08      colección `reservas`
                          parte de una copia      
                          funcional del TP 07     

  Operaciones             Conservar lo ya         Crear, listar y
                          implementado en la      consultar reservas con
                          entrega anterior        operaciones asíncronas

  API JSON                Se amplía en esta       `GET` colección, `GET`
                          unidad                  por ID y `POST` de
                                                  creación

  Sitio HTML              Se conserva             Continúa leyendo la
                                                  misma base que la API

  Servicio                El servicio en memoria  Servicio MongoDB
                          deja de ser fuente      asíncrono compartido
                          activa para el arranque por HTML y API
                          persistente             

  Modelo                  Se conservan los seis   Se mantienen los seis
                          campos de reserva       campos y se agrega
                                                  `estado` con default
                                                  `pendiente`

  Identificador           Verificar la            `id` textual derivado
                          representación          de `ObjectId`
                          utilizada en el TP 07   

  Estado del servidor     Conservar el contrato   `/estado` debe contar
                          previo                  desde MongoDB

  Reinicio                Verificar el            Los datos creados deben
                          comportamiento anterior continuar disponibles
                                                  tras reiniciar

  Alcance                 Según la entrega        Sin `PUT`, `PATCH`,
                          anterior                `DELETE`, paginación ni
                                                  confirmación de
                                                  reservas
  -----------------------------------------------------------------------

La consigna no pide borrar el código de referencia de la unidad
anterior. Pide evitar que el servicio en memoria y el JSON sigan
funcionando como fuentes activas paralelas para el mismo dominio.

## 14. Calidad y entrega

Antes de entregar:

-   [ ] El repositorio parte de la copia individual del TP 07 y conserva
    la entrega anterior.
-   [ ] `package.json` y `package-lock.json` están incluidos.
-   [ ] `.env.example` contiene solo marcadores, nunca secretos.
-   [ ] `.env`, `node_modules` y datos personales reales no están en
    GitHub.
-   [ ] El arranque espera la conexión con Atlas antes de escuchar el
    puerto.
-   [ ] El servidor conserva la conexión entre solicitudes y cierra
    ordenadamente.
-   [ ] HTML y API utilizan el mismo servicio y los mismos documentos.
-   [ ] La creación devuelve `201` y `Location` después de guardar.
-   [ ] Se distinguen los errores `400`, `404` y `500`.
-   [ ] Se ejecutaron las pruebas de persistencia y los casos negativos.
-   [ ] Se completó la columna de resultados observados sin inventar
    evidencias.
-   [ ] Se ejecutaron los comandos de formato y comprobación
    disponibles.
-   [ ] El README documenta versiones reales, origen de la copia y
    estado del ajuste DNS.
-   [ ] El docente puede acceder al repositorio GitHub.

## 15. Referencias de trabajo

-   Unidad 8, Clase 01 --- *Creación y lectura desde Express y MongoDB*.
-   Unidad 8 --- *Trabajo práctico 08: Endpoints persistentes de
    reservas de salas*.
-   Documentación de Express 5, Mongoose, MongoDB Atlas y Postman, según
    los temas indicados en los apuntes.
