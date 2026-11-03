const {
  salasPermitidas,
  turnosPermitidos,
} = require("../modelos/reserva");

function crearControladorReservas(servicio) {
  async function listar(req, res) {
    const reservas = await servicio.listar();
    res.render("reservas/lista", {
      titulo: "Reservas de Salas",
      reservas,
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      errores: [],
      valores: {},
      salasPermitidas,
      turnosPermitidos,
    });
  }

  async function mostrarDetalle(req, res) {
    const reserva = await servicio.obtenerPorId(req.params.id);
    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }

    return res.render("reservas/detalle", {
      titulo: `Reserva ${reserva.id}`,
      reserva,
    });
  }

  async function crear(req, res) {
    await servicio.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  async function listarApi(req, res) {
    const reservas = await servicio.listar(req.query.sala);
    res.json(reservas);
  }

  async function obtenerApi(req, res) {
    const reserva = await servicio.obtenerPorId(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }
    return res.json(reserva);
  }

  async function crearApi(req, res) {
    const reserva = await servicio.crear(req.reservaValidada);
    return res.location(`/api/reservas/${reserva.id}`).status(201).json(reserva);
  }

  async function estado(req, res) {
    const cantidad = await servicio.contar();
    return res.status(200).json({
      servicio: "activo",
      reservas: cantidad,
      solicitud: res.locals.solicitudId,
    });
  }

  return {
    listar,
    mostrarFormulario,
    mostrarDetalle,
    crear,
    listarApi,
    obtenerApi,
    crearApi,
    estado,
  };
}

module.exports = { crearControladorReservas };
