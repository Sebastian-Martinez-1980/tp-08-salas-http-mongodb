const {
  salasPermitidas,
  turnosPermitidos,
} = require("../modelos/reserva");

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de Salas";
  res.locals.salasPermitidas = salasPermitidas;
  res.locals.turnosPermitidos = turnosPermitidos;
  next();
}

function validarReserva(req, res, next) {
  const valores = req.body && typeof req.body === "object" ? req.body : {};
  const errores = [];

  function leerTexto(campo) {
    const valor = valores[campo];
    return typeof valor === "string" ? valor.trim() : "";
  }

  const estudiante = leerTexto("estudiante");
  const email = leerTexto("email");
  const sala = leerTexto("sala");
  const fecha = leerTexto("fecha");
  const turno = leerTexto("turno");
  const personasOriginal = valores.personas;
  const personasTexto =
    typeof personasOriginal === "string" ? personasOriginal.trim() : personasOriginal;
  const personas =
    typeof personasTexto === "number" || typeof personasTexto === "string"
      ? Number(personasTexto)
      : NaN;

  if (!estudiante) errores.push("El estudiante es obligatorio.");

  if (!email) {
    errores.push("El email es obligatorio.");
  } else if (!/^[^\s@]+@[^\s@]+$/.test(email)) {
    errores.push("El email debe contener un formato válido con @.");
  }

  if (!fecha) {
    errores.push("La fecha es obligatoria.");
  } else {
    const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha);
    const fechaParseada = new Date(`${fecha}T00:00:00.000Z`);
    if (
      !fechaValida ||
      Number.isNaN(fechaParseada.getTime()) ||
      fechaParseada.toISOString().slice(0, 10) !== fecha
    ) {
      errores.push("La fecha no es válida.");
    }
  }

  if (
    personasTexto === "" ||
    personasTexto === undefined ||
    personasTexto === null
  ) {
    errores.push("La cantidad de personas es obligatoria.");
  } else if (
    !Number.isInteger(personas) ||
    personas < 1 ||
    personas > 6
  ) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  if (!sala) {
    errores.push("Debes seleccionar una sala.");
  } else if (!salasPermitidas.includes(sala)) {
    errores.push("La sala seleccionada no es válida.");
  }

  if (!turno) {
    errores.push("Debes seleccionar un turno.");
  } else if (!turnosPermitidos.includes(turno)) {
    errores.push("El turno seleccionado no es válido.");
  }

  if (errores.length > 0) {
    const esApi = req.originalUrl.split("?")[0].startsWith("/api/");
    if (esApi) {
      return res.status(400).json({
        error: "Revisá los datos enviados.",
        errores,
      });
    }

    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      errores,
      valores,
      salasPermitidas,
      turnosPermitidos,
    });
  }

  // Se copian únicamente los campos admitidos. estado e _id nunca
  // se toman del cliente: estado lo asigna el default del modelo.
  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = { prepararAreaReservas, validarReserva };
