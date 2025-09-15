// server/api/contact.post.ts
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

  const { smtpHost, smtpPort, smtpUser, smtpPass, contactTo } = useRuntimeConfig()

  // Evita 500 si faltan ENV en Vercel
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !contactTo) {
    console.warn('SMTP env missing; skipping send.')
    return { ok: true, skipped: true }
  }

  // Importa dentro del handler (mejor para serverless)
  const { default: nodemailer } = await import('nodemailer')

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: { user: smtpUser, pass: smtpPass },
    tls: { minVersion: 'TLSv1.2' }
  })

  const html = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${body.nombre}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Teléfono:</strong> ${body.telefono || '-'}</p>
    <p><strong>Mensaje:</strong><br>${(body.mensaje || '').replace(/\n/g, '<br>')}</p>
  `

  await transporter.sendMail({
    from: `"Formulario Web" <${smtpUser}>`,
    to: contactTo,
    replyTo: body.email,
    subject: `Contacto: ${body.nombre}`,
    html
  })

  return { ok: true }
})
