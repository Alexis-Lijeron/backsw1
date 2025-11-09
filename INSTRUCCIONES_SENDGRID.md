# 📧 Configurar SendGrid para Digital Ocean

## ⚠️ Problema Detectado

Digital Ocean bloquea los puertos SMTP estándar (25, 465, 587) por defecto, lo que impide usar Gmail directamente.

**Error:** `Connection timeout` al conectar a `smtp.gmail.com:587`

---

## ✅ Solución: SendGrid (Puerto 2525)

SendGrid usa el puerto **2525** que NO está bloqueado por Digital Ocean.

---

## 📋 Pasos para configurar SendGrid:

### 1. Crear cuenta en SendGrid

1. Ve a: https://signup.sendgrid.com/
2. Completa el registro
3. Verifica tu email

### 2. Crear API Key

1. Inicia sesión en SendGrid
2. Ve a **Settings** → **API Keys**
3. Click en **Create API Key**
4. Nombre: `Backend Diagramas` (o el que prefieras)
5. Permisos: Selecciona **Mail Send** → **Full Access**
6. Click en **Create & View**
7. **¡IMPORTANTE!** Copia la API Key inmediatamente (solo se muestra una vez)
   - Ejemplo: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Verificar el remitente (Sender Authentication)

SendGrid requiere que verifiques tu email:

1. Ve a **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Click en **Create New Sender**
3. Completa el formulario:
   - **From Name:** Sistema de Diagramas UML
   - **From Email Address:** plataeterna@gmail.com
   - **Reply To:** plataeterna@gmail.com
   - Completa los demás campos
4. Click en **Create**
5. **Verifica tu email:** SendGrid enviará un email a `plataeterna@gmail.com`
6. Click en el enlace de verificación

### 4. Actualizar el archivo `.env` en tu servidor Digital Ocean

Conéctate a tu servidor:
```bash
ssh root@tu-ip-digital-ocean
cd /root/backsw1  # O la ruta de tu proyecto
nano .env
```

Actualiza las variables SMTP:
```env
PORT=4000
DB_URI=mongodb+srv://admin:admin@diagramador.4hhnd.mongodb.net/?appName=diagramador
SECRET_KEY=mySecretKey
NODE_ENV=production
FRONTEND_URL=http://134.209.9.216:5173

# ==============================================
# CONFIGURACIÓN DE CORREO SMTP - SENDGRID
# ==============================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM_EMAIL=plataeterna@gmail.com
SMTP_FROM_NAME=Sistema de Diagramas UML
```

Guarda con `Ctrl + O`, Enter, `Ctrl + X`

### 5. Reiniciar el servidor

```bash
# Si usas PM2:
pm2 restart all

# Si usas systemd:
sudo systemctl restart tu-servicio

# Si lo corres con npm:
# Detén el proceso actual (Ctrl+C) y ejecuta:
npm run dev
```

### 6. Probar el envío

Intenta enviar una invitación desde tu frontend. Deberías ver en los logs:

```
=== CONFIGURACIÓN SMTP ===
SMTP_HOST: smtp.sendgrid.net
SMTP_PORT: 2525
SMTP_USER: apikey
=== CORREO ENVIADO EXITOSAMENTE ===
Message ID: <...>
```

---

## 🔍 Verificar logs

```bash
# Con PM2:
pm2 logs

# Con systemd:
sudo journalctl -u tu-servicio -f

# Con npm (se ven directamente en la terminal)
```

---

## 📊 Límites de SendGrid

**Plan Gratuito:**
- ✅ 100 correos/día (permanente)
- ✅ Análisis básicos
- ✅ Soporte por email

**Si necesitas más:**
- Essentials: $19.95/mes → 50,000 correos/mes
- Pro: $89.95/mes → 100,000 correos/mes

---

## ❓ Troubleshooting

### Error: "The from address does not match a verified Sender Identity"

**Solución:** Verifica tu email en SendGrid (Paso 3)

### Error: "Connection timeout" persiste

**Solución:** Verifica que:
1. El puerto sea **2525**
2. `SMTP_USER` sea exactamente `apikey` (en minúsculas)
3. La API Key sea correcta y tenga permisos de "Mail Send"

### Los correos van a spam

**Solución:** 
1. Configura SPF y DKIM en SendGrid (Domain Authentication)
2. Usa un dominio propio en lugar de @gmail.com

---

## 🎯 Alternativas a SendGrid

Si prefieres otro servicio, estas opciones también funcionan con Digital Ocean:

### **Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=2525
SMTP_USER=postmaster@tu-dominio.mailgun.org
SMTP_PASS=tu_password_mailgun
```

### **Amazon SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=2587
SMTP_USER=tu_access_key_id
SMTP_PASS=tu_secret_smtp_password
```

---

## ✅ Checklist Final

- [ ] Cuenta de SendGrid creada
- [ ] API Key generada y copiada
- [ ] Email verificado en SendGrid
- [ ] Archivo `.env` actualizado en el servidor
- [ ] Servidor reiniciado
- [ ] Correo de prueba enviado exitosamente

---

## 📞 ¿Necesitas ayuda?

Si tienes problemas, verifica:
1. Los logs del servidor para ver errores específicos
2. Que la API Key tenga los permisos correctos
3. Que el email esté verificado en SendGrid
