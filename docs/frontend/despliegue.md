# Despliegue del Frontend

## Opciones de Despliegue

### Opción 1: Vercel (Recomendado)

**Ventajas:**
- Zero-config
- Despliegue automático con Git
- Global CDN
- HTTPS automático
- Precio competitivo

**Pasos:**

1. Ir a https://vercel.com
2. Conectar repositorio GitHub
3. Seleccionar rama (main)
4. Agregar variables de entorno:
   ```
   VITE_API_URL=https://api.ejemplo.com
   ```
5. Click "Deploy"

**Resultado:**
```
https://escritores-front.vercel.app
```

### Opción 2: Netlify

**Pasos:**

1. Ir a https://netlify.com
2. Conectar GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Agregar variable: `VITE_API_URL`
6. Deploy

**Resultado:**
```
https://escritores-front.netlify.app
```

### Opción 3: Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Build:**
```bash
docker build -t escritores-front:latest .
```

**Run:**
```bash
docker run -p 3000:3000 escritores-front:latest
```

### Opción 4: Servidor Propio

**Requisitos:**
- Servidor Linux (Ubuntu, CentOS, etc.)
- Nginx o Apache
- Node.js (opcional)

**Pasos:**

1. Build localmente:
```bash
npm run build
```

2. Subir carpeta `dist/` al servidor

3. Configurar Nginx:
```nginx
server {
    listen 80;
    server_name ejemplo.com;
    root /var/www/dist;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

4. Reiniciar Nginx:
```bash
sudo systemctl restart nginx
```

---

## Variables de Entorno en Producción

### Vercel

1. Ir a Project Settings
2. Environment Variables
3. Agregar:
   - **VITE_API_URL**: `https://api.produccion.com`
4. Re-deploy

### Netlify

1. Ir a Site Settings → Build & Deploy → Environment
2. Add variable
3. Key: `VITE_API_URL`
4. Value: `https://api.produccion.com`

### Docker

```dockerfile
ENV VITE_API_URL=https://api.produccion.com
```

O pasar en tiempo de ejecución:

```bash
docker run -e VITE_API_URL=https://api.prod.com escritores-front
```

---

## Configuración de Nginx

### Archivo completo: `/etc/nginx/sites-available/default`

```nginx
upstream backend {
    server localhost:8080;
}

server {
    listen 80;
    listen [::]:80;
    
    server_name ejemplo.com www.ejemplo.com;
    
    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name ejemplo.com www.ejemplo.com;
    
    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/ejemplo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ejemplo.com/privkey.pem;
    
    # Root del frontend
    root /var/www/dist;
    
    # Índice
    index index.html;
    
    # Frontend - todo va a index.html (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Caché de activos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        expires 31536000s;
        add_header Cache-Control "public, immutable";
    }
    
    # Headers de seguridad
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Instalación de SSL (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Solicitar certificado
sudo certbot certonly --nginx -d ejemplo.com -d www.ejemplo.com

# Auto-renovación
sudo systemctl enable certbot.timer
```

---

## CI/CD con Jenkinsfile

Ver archivo `Jenkinsfile` en la raíz del proyecto.

**Pipeline:**
1. Checkout
2. Install dependencies
3. Build
4. Test
5. Deploy to Vercel/Netlify/Server

---

## Monitoreo Post-Despliegue

### Verificar que la app funciona

```bash
curl https://ejemplo.com
curl https://ejemplo.com/api  # Backend proxy
```

### Verificar SSL

```bash
openssl s_client -connect ejemplo.com:443
```

### Monitorear Logs

**Vercel Dashboard**: https://vercel.com/dashboard

**Nginx**:
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**Docker**:
```bash
docker logs -f <container_id>
```

---

## Checklist de Despliegue

- [ ] Build compila sin errores: `npm run build`
- [ ] Variables de entorno configuradas
- [ ] Backend accesible desde production
- [ ] SSL/HTTPS habilitado
- [ ] Dominios apuntando correctamente
- [ ] CORS configurado si es necesario
- [ ] Revisar performance en producción
- [ ] Testing de rutas privadas
- [ ] Testing de login/logout
- [ ] Monitoreo configurado
- [ ] Alertas configuradas
- [ ] Backup de código configurado

---

## Debugging en Producción

### 1. Ver Logs de Build

**Vercel**: Project → Deployments → Deployment → Logs

**Netlify**: Deploys → Logs

**Docker**: `docker logs <container>`

### 2. Revisar Network Requests

1. Abrir DevTools
2. Network tab
3. Ver solicitudes y respuestas
4. Revisar errors

### 3. Ver Console Errors

DevTools → Console tab

### 4. Performance Audit

1. DevTools → Lighthouse
2. Analyze page load
3. Seguir recomendaciones

---

## Rollback (Revertir Despliegue)

### Vercel

1. Ir a Deployments
2. Seleccionar despliegue anterior
3. Click "Promote to Production"

### Netlify

1. Ir a Deploys
2. Seleccionar despliegue anterior
3. Click "Publish deploy"

### Docker

```bash
# Ver imagen anterior
docker images

# Crear contenedor con imagen anterior
docker run -d -p 80:3000 <old_image_id>
```

---

## Escalabilidad

### Más Usuarios

1. Mejorar caché en Nginx:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
```

2. Usar CDN global (Cloudflare, Akamai)

3. Loadbalancer si múltiples servidores

### Más Datos

1. Backend: Optimizar queries
2. Frontend: Lazy loading de componentes
3. Paginación automática

---

## Seguridad en Producción

### Headers de Seguridad

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'";
```

### HTTPS Obligatorio

```nginx
# Redirigir HTTP a HTTPS
return 301 https://$server_name$request_uri;
```

### Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api {
    limit_req zone=api burst=20;
    proxy_pass http://backend;
}
```

---

## Mantenimiento

### Actualizar Dependencias

```bash
npm outdated           # Ver qué está desactualizado
npm update             # Actualizar
npm audit              # Ver vulnerabilidades
npm audit fix          # Arreglar vulnerabilidades
```

### Redeploy Periódico

```bash
# Cada semana
git pull
npm install
npm run build
# Deploy
```

### Limpieza

```bash
# Limpiar logs antiguos
find /var/log/nginx -mtime +30 -delete

# Limpiar Docker
docker system prune -a
```
