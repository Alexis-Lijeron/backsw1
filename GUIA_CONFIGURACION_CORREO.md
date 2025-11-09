# 📧 Guía de Configuración de Correo para Producción (HTTPS)

## 🚨 Problema
Mailtrap (servicio actual) solo funciona para desarrollo/testing y no permite enviar correos reales en producción con HTTPS.

## ✅ Soluciones para Producción

### **Opción 1: Gmail (Recomendada - Gratuita)** ⭐

#### Ventajas:
- ✅ Completamente gratis
- ✅ Fácil de configurar
- ✅ Confiable y soportado
- ✅ Compatible con HTTPS
- ✅ Límite: 500 correos/día

#### Pasos de configuración:

1. **Habilitar verificación en 2 pasos en tu cuenta de Google:**
   - Ve a: https://myaccount.google.com/security
   - Activa la "Verificación en 2 pasos"

2. **Crear una contraseña de aplicación:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Windows PC" (o el dispositivo que prefieras)
   - Genera la contraseña (16 caracteres)
   - **Guarda esta contraseña, solo se muestra una vez**

3. **Configurar el archivo `.env`:**
   ```env
   # Configuración Gmail
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # La contraseña de aplicación de 16 caracteres
   SMTP_FROM_EMAIL=tu-email@gmail.com
   SMTP_FROM_NAME=Sistema de Diagramas UML
   ```

4. **Reiniciar el servidor:**
   ```powershell
   npm run dev
   ```

---

### **Opción 2: SendGrid (Profesional)** 🚀

#### Ventajas:
- ✅ Plan gratuito: 100 correos/día
- ✅ Análisis avanzados
- ✅ Mayor reputación de entrega
- ✅ API REST adicional

#### Pasos de configuración:

1. **Crear cuenta en SendGrid:**
   - Ve a: https://signup.sendgrid.com/
   - Completa el registro

2. **Crear API Key:**
   - En el dashboard, ve a Settings > API Keys
   - Crea una nueva API Key con permisos de "Mail Send"
   - Copia la API Key

3. **Verificar dominio o email:**
   - Ve a Settings > Sender Authentication
   - Verifica tu email o dominio

4. **Configurar el archivo `.env`:**
   ```env
   # Configuración SendGrid
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Tu API Key de SendGrid
   SMTP_FROM_EMAIL=tu-email-verificado@dominio.com
   SMTP_FROM_NAME=Sistema de Diagramas UML
   ```

---

### **Opción 3: Mailgun** 📮

#### Ventajas:
- ✅ Plan gratuito: 5,000 correos/mes (primeros 3 meses)
- ✅ Documentación excelente
- ✅ Validación de emails

#### Pasos de configuración:

1. **Crear cuenta:**
   - Ve a: https://www.mailgun.com/
   - Regístrate

2. **Obtener credenciales SMTP:**
   - En el dashboard, ve a "Sending" > "Domain settings"
   - Encuentra las credenciales SMTP

3. **Configurar el archivo `.env`:**
   ```env
   # Configuración Mailgun
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=postmaster@sandbox-xxxxx.mailgun.org
   SMTP_PASS=tu_password_de_mailgun
   SMTP_FROM_EMAIL=noreply@tudominio.com
   SMTP_FROM_NAME=Sistema de Diagramas UML
   ```

---

### **Opción 4: AWS SES (Amazon)** ☁️

#### Ventajas:
- ✅ Muy económico (€0.10 por 1000 emails)
- ✅ Altamente escalable
- ✅ Integrado con AWS

#### Pasos de configuración:

1. **Crear cuenta AWS:**
   - Ve a: https://aws.amazon.com/ses/

2. **Configurar SES:**
   - Verifica tu email o dominio
   - Obtén las credenciales SMTP

3. **Configurar el archivo `.env`:**
   ```env
   # Configuración AWS SES
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=tu_access_key_id
   SMTP_PASS=tu_secret_smtp_password
   SMTP_FROM_EMAIL=verificado@tudominio.com
   SMTP_FROM_NAME=Sistema de Diagramas UML
   ```

---

## 🔧 Cambios Realizados en el Código

### 1. Archivo `src/config/nodemailer.ts`
Se actualizó para soportar múltiples servicios SMTP y HTTPS:

```typescript
const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
    },
});
```

### 2. Archivo `src/services/diagram.service.ts`
Se actualizó para usar variables de entorno para el remitente:

```typescript
from: `"${process.env.SMTP_FROM_NAME || 'Sistema de Diagramas'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
```

---

## 📋 Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
SMTP_FROM_EMAIL=tu-email@gmail.com
SMTP_FROM_NAME=Sistema de Diagramas UML

# Environment
NODE_ENV=production
```

---

## 🧪 Cómo Probar

1. **Actualiza tu archivo `.env` con las credenciales del servicio elegido**

2. **Reinicia el servidor:**
   ```powershell
   npm run dev
   ```

3. **Prueba enviando una invitación:**
   - Usa Postman o Thunder Client
   - Endpoint: `POST /api/diagrams/user/invite/:diagramId`
   - Verifica que el correo llegue correctamente

---

## 🚀 Despliegue en Producción

### Variables de entorno en tu servidor:

```env
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM_EMAIL=tu-email@gmail.com
SMTP_FROM_NAME=Sistema de Diagramas UML
FRONTEND_URL=https://tu-dominio-frontend.com
```

---

## ⚠️ Notas Importantes

1. **Nunca subas tu archivo `.env` a Git** - Está en `.gitignore`
2. **Usa contraseñas de aplicación** - No uses tu contraseña personal de Gmail
3. **Para producción** - Considera usar SendGrid o Mailgun para mayor confiabilidad
4. **Límites de Gmail** - 500 correos/día, si necesitas más usa servicios profesionales
5. **Verificación de dominios** - Para mejor entregabilidad, verifica tu dominio con el servicio SMTP

---

## 📞 Soporte

Si tienes problemas:
- Verifica que las credenciales sean correctas
- Revisa los logs del servidor
- Asegúrate de que el puerto no esté bloqueado por firewall
- Verifica que la cuenta de email esté verificada con el servicio SMTP
