import { createTransport } from "nodemailer";

// Configuración de Nodemailer para múltiples servicios SMTP
// Soporta: Mailtrap (desarrollo), Gmail (producción), y otros servicios
const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true para puerto 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Configuraciones adicionales para compatibilidad con HTTPS
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production", // Solo validar certificados en producción
    },
});

export { transport };