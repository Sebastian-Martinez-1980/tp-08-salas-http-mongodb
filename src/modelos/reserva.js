const mongoose = require("mongoose");

const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
const estadosPermitidos = ["pendiente", "confirmada"];

const reservaSchema = new mongoose.Schema(
  {
    estudiante: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+$/,
    },
    sala: {
      type: String,
      required: true,
      trim: true,
      enum: salasPermitidas,
    },
    fecha: { type: Date, required: true },
    turno: {
      type: String,
      required: true,
      trim: true,
      enum: turnosPermitidos,
    },
    personas: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      validate: {
        validator: Number.isInteger,
        message: "La cantidad de personas debe ser un número entero.",
      },
    },
    estado: {
      type: String,
      enum: estadosPermitidos,
      default: "pendiente",
    },
  },
  { collection: "reservas" },
);

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = {
  Reserva,
  salasPermitidas,
  turnosPermitidos,
  estadosPermitidos,
};
