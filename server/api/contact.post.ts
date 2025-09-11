// server/api/contact.post.ts
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    nombre: string
    email: string
    telefono?: string
    mensaje: string
  }>(event)

  if (!body?.nombre || !body?.email || !body?.mensaje) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios' })
  }

  const config = useRuntimeConfig()

  // ---- Transporter (elige 465 o 587) ----
  const transporter = nodemailer.createTransport({
    host: config.smtpHost || 'smtp.gmail.com',
    port: Number(config.smtpPort || 465),
    secure: String(config.smtpPort || '465') === '465', // true si 465, false si 587
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    tls: { minVersion: 'TLSv1.2' },
  })

  const html = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${body.nombre}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Teléfono:</strong> ${body.telefono || '-'}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${(body.mensaje || '').replace(/\n/g, '<br>')}</p>
  `

  await transporter.sendMail({
    from: `"Formulario Web" <${config.smtpUser}>`, 
    to: config.contactTo,
    replyTo: body.email,
    subject: `Contacto: ${body.nombre}`,
    html,
  })

  return { ok: true }
})
