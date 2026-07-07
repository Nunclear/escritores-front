# Despliegue y Deploy

## Opciones de Deployment

### 1. Vercel (Recomendado)

**Ventajas:**
- Deployment automático con push a GitHub
- CDN global
- Dominio gratis (vercel.app)
- Integración GitHub nativa
- Enviroment variables

**Setup:**

```bash
# 1. Conectar GitHub a Vercel
# Visita https://vercel.com/new
# Click "Import Git Repository"
# Selecciona tu repo

# 2. Configurar variables
# En Vercel dashboard:
# Settings → Environment Variables
# Agregar: VITE_API_URL = https://api.ejemplo.com

# 3. Deploy automático
# Cada push a main → deploy automático
```

### 2. Netlify

**Setup:**

```bash
# 1. Conectar en Netlify
# https://app.netlify.com/

# 2. Build command: npm run build
# Publish directory: dist

# 3. Redirecciones
# Crear netlify.toml:
```

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS S3 + CloudFront

**Setup:**

```bash
# 1. Crear bucket S3
aws s3 mb s3://mi-bucket

# 2. Subir archivos
npm run build
aws s3 sync dist/ s3://mi-bucket

# 3. CloudFront para cache
# En AWS console: Create distribution
# Origin: S3 bucket
# Default root object: index.html
```

### 4. Servidor Propio (nginx)

**Setup:**

```bash
# 1. Compilar
npm run build

# 2. Transferir a servidor
scp -r dist/ usuario@servidor:/var/www/app/

# 3. Configurar nginx (nginx.conf)
# Ver sección anterior

# 4. Iniciar nginx
sudo systemctl restart nginx
```

---

## Variables de Entorno en Producción

### Vercel

Dashboard → Settings → Environment Variables

```
VITE_API_URL = https://api.produccion.com
```

### Netlify

netlify.toml:

```toml
[context.production]
  environment = { VITE_API_URL = "https://api.produccion.com" }

[context.deploy-preview]
  environment = { VITE_API_URL = "https://api-staging.com" }
```

### Servidor Propio

Crear `.env.production`:

```bash
VITE_API_URL=https://api.produccion.com
```

---

## Proceso de Deploy Manual

### 1. Preparar

```bash
# Asegurar cambios guardados
git status

# Actualizar dependencias
npm install

# Compilar
npm run build

# Probar localmente
npm run preview
```

### 2. Verificar Build

```bash
# Revisar dist/
ls -la dist/

# Tamaño
du -sh dist/

# Verificar archivos principales
ls -la dist/*.html
ls -la dist/assets/
```

### 3. Transferir

```bash
# Opción 1: SCP
scp -r dist/* usuario@servidor:/ruta/destino/

# Opción 2: FTP
lftp -u usuario,password ftp.servidor.com
put -R dist/*

# Opción 3: Git + webhook
git push origin main
# Webhook automáticamente dispara deploy
```

### 4. Configurar en Servidor

```bash
# Si nginx, recargar
sudo systemctl reload nginx

# Si Apache
sudo systemctl reload apache2

# Verificar logs
sudo tail -f /var/log/nginx/error.log
```

---

## DNS y Dominios

### Apuntar Dominio

**En tu registrador (GoDaddy, Namecheap, etc):**

1. Ir a DNS settings
2. Agregar registros:

```
Tipo    Nombre          Valor
A       ejemplo.com     IP_DEL_SERVIDOR
CNAME   www             ejemplo.com
```

Para Vercel:
```
CNAME   ejemplo.com     cname.vercel-dns.com
```

### HTTPS/SSL

**Automático en:**
- ✅ Vercel - Let's Encrypt automático
- ✅ Netlify - Let's Encrypt automático
- ✅ AWS CloudFront con ACM

**Manual en servidor propio:**

```bash
# Con Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d ejemplo.com
sudo certbot renew --dry-run  # Probar renovación automática
```

---

## CI/CD Pipeline

### GitHub Actions (Automático)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install
        run: npm install
      
      - name: Lint (opcional)
        run: npm run lint || true
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Jenkins Pipeline

Crear `Jenkinsfile`:

```groovy
pipeline {
  agent any
  
  environment {
    NODE_ENV = 'production'
  }
  
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    
    stage('Deploy') {
      steps {
        sh 'scp -r dist/* usuario@servidor:/var/www/app/'
        sh 'ssh usuario@servidor "sudo systemctl restart nginx"'
      }
    }
  }
  
  post {
    failure {
      echo 'Deploy failed!'
    }
    success {
      echo 'Deploy successful!'
    }
  }
}
```

---

## Rollback

Si algo sale mal en producción:

### Vercel

1. Dashboard → Deployments
2. Seleccionar versión anterior
3. Click "Promote to Production"

### Servidor Propio

```bash
# Guardar cada deploy
tar czf backups/deploy-$(date +%s).tar.gz /var/www/app/

# Restaurar si necesario
tar xzf backups/deploy-TIMESTAMP.tar.gz -C /var/www/app/

# Restart
sudo systemctl restart nginx
```

---

## Monitoreo Post-Deploy

### Verificaciones

```bash
# ¿Sitio responde?
curl -I https://ejemplo.com

# ¿Código 200?
curl -I https://ejemplo.com | grep HTTP

# ¿Assets cargan?
curl -I https://ejemplo.com/assets/index-*.js

# ¿API se conecta?
curl https://api.ejemplo.com/api/stories
```

### Logs

```bash
# nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Sentry (si configurado)
# Dashboard de errores en tiempo real

# Google Analytics
# Dashboard de tráfico
```

### Alertas

Configurar alertas en:
- Sentry para errores
- DataDog para performance
- Uptime Robot para disponibilidad

---

## Performance Post-Deploy

### Verificar Velocidad

```bash
# Lighthouse
npm install -g lighthouse
lighthouse https://ejemplo.com --view

# WebPageTest
# https://www.webpagetest.org/

# GTmetrix
# https://gtmetrix.com/
```

### Core Web Vitals

Métricas objetivo:
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1

---

## Seguridad en Producción

### Headers

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### HTTPS

Asegurar:
- ✅ Todo tráfico es HTTPS
- ✅ Certificado válido
- ✅ Redireccionar HTTP a HTTPS

```nginx
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ...
}
```

---

**Última actualización**: Enero 2024
