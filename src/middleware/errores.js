function crearManejadorErrores({ vistaFormulario, tituloFormulario }) {
  return function manejarErrores(error, req, res, next) {
    if (res.headersSent) {
      return next(error);
    }

    const esValidacion = error.name === "ValidationError";
    const esEntrada =
      esValidacion ||
      error.name === "CastError" ||
      error.codigo === "ID_INVALIDO" ||
      error.codigo === "FILTRO_INVALIDO" ||
      error.type === "entity.parse.failed";

    const estado = esEntrada ? 400 : 500;
    let mensaje = esEntrada
      ? "Revisá los datos enviados."
      : "No se pudo completar la operación.";

    if (error.codigo === "ID_INVALIDO") {
      mensaje = "El identificador debe tener 24 caracteres hexadecimales.";
    } else if (error.codigo === "FILTRO_INVALIDO") {
      mensaje = "El filtro sala debe ser un único valor válido.";
    } else if (error.type === "entity.parse.failed") {
      mensaje = "El cuerpo JSON enviado no tiene un formato válido.";
    }

    console.error("Solicitud fallida:", {
      solicitudId: res.locals.solicitudId,
      metodo: req.method,
      ruta: req.originalUrl,
      nombre: error.name,
      mensaje: error.message,
      codigo: error.codigo,
      tipo: error.type,
    });

    if (req.originalUrl.split("?")[0].startsWith("/api/")) {
      return res.status(estado).json({
        error: mensaje,
        campos: esValidacion ? Object.keys(error.errors) : [],
      });
    }

    if (esValidacion && req.method === "POST") {
      return res.status(400).render(vistaFormulario, {
        titulo: tituloFormulario,
        errores: Object.values(error.errors).map((item) => item.message),
        valores: req.body ?? {},
        salasPermitidas: res.locals.salasPermitidas ?? [],
        turnosPermitidos: res.locals.turnosPermitidos ?? [],
      });
    }

    return res.status(estado).render("no-encontrado", {
      titulo: esEntrada ? "Solicitud inválida" : "Error del servicio",
      mensaje,
    });
  };
}

module.exports = { crearManejadorErrores };