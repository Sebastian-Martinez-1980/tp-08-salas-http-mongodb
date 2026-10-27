function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas";
  next();
}
function validarReserva(req, res, next) {
  const valores = req.body ?? {};
  const estudiante = typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";
  const email = typeof valores.email === "string" ? valores.email.trim() : "";
  const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";
  const fecha = valores.fecha;
  const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";
  const personas = typeof valores.personas === "number" ? valores.personas : NaN;
  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    !Number.isFinite(personas) ||
    personas < 1
  ) {
    if (req.baseUrl === "/api/reservas") {
      return res.status(400).json({
        error:
          "Completá los campos con un número de personas mayor o igual a 1.",
      });
    }
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: "Completá los campos con un número de personas mayor o igual a 1.",
      valores,
    });
  }
  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
}
module.exports = { prepararAreaReservas, validarReserva };
