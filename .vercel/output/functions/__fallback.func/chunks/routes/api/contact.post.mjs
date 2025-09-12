import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
import nodemailer from 'nodemailer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const contact_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.nombre) || !(body == null ? void 0 : body.email) || !(body == null ? void 0 : body.mensaje)) {
    throw createError({ statusCode: 400, statusMessage: "Faltan campos obligatorios" });
  }
  const config = useRuntimeConfig();
  const transporter = nodemailer.createTransport({
    host: config.smtpHost || "smtp.gmail.com",
    port: Number(config.smtpPort || 465),
    secure: String(config.smtpPort || "465") === "465",
    // true si 465, false si 587
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: { minVersion: "TLSv1.2" }
  });
  const html = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${body.nombre}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Tel\xE9fono:</strong> ${body.telefono || "-"}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${(body.mensaje || "").replace(/\n/g, "<br>")}</p>
  `;
  await transporter.sendMail({
    from: `"Formulario Web" <${config.smtpUser}>`,
    to: config.contactTo,
    replyTo: body.email,
    subject: `Contacto: ${body.nombre}`,
    html
  });
  return { ok: true };
});

export { contact_post as default };
//# sourceMappingURL=contact.post.mjs.map
