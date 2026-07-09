# CampusHub — Landing Page

Landing page de marketing para CampusHub (PMV). Es un proyecto **independiente** del
app real (`frontend/`/`backend/`): estático, sin build, pensado para desplegarse gratis
en GitHub Pages.

## Stack tecnológico

- HTML5 + CSS3 (vanilla, sin frameworks ni preprocesadores)
- JavaScript vanilla (sin dependencias/npm)
- Google Fonts (Inter)
- [Formspree](https://formspree.io) para recibir los envíos del formulario de leads sin backend propio
- Google Analytics 4 (GA4) para medición
- GitHub Actions + GitHub Pages para el despliegue

## Estructura

```
landing-page/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── logo.svg
│   └── favicon.svg
└── README.md
```

## Ver en local

No requiere instalación. Sirve la carpeta con cualquier servidor estático, por ejemplo:

```bash
npx serve landing-page
# o
python -m http.server 8080 --directory landing-page
```

Abrir la URL indicada en el navegador (no basta abrir `index.html` con doble clic si
quieres probar el `fetch` del formulario, ya que algunos navegadores bloquean
peticiones desde `file://`).

## Antes de publicar: datos por completar

| Dato | Dónde | Qué hacer |
|------|-------|-----------|
| Número de WhatsApp | `js/main.js`, constante `WHATSAPP_NUMBER` | Reemplazar con el número real (código de país + número, sin símbolos) |
| Endpoint del formulario | `js/main.js`, constante `FORMSPREE_ENDPOINT` | Crear un formulario gratis en [formspree.io](https://formspree.io) y pegar la URL que te den |
| Redes sociales | `index.html`, sección `<footer>`, enlaces marcados con `TODO` | Reemplazar los `href="#"` con las URLs reales |
| Correo de contacto | `index.html`, sección `<footer>` | Reemplazar `contacto@campushub.pe` con el correo real |

## Desplegar en GitHub Pages

El repo ya incluye el workflow `.github/workflows/deploy-landing.yml`, que publica
automáticamente el contenido de `landing-page/` cada vez que se hace push a `main`.

Pasos (una sola vez):

1. Hacer push de estos cambios a `main` en GitHub.
2. En el repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Esperar a que corra el workflow (pestaña **Actions**) — al terminar, la URL pública
   queda disponible en **Settings → Pages** y en el resumen del workflow.

## Entregables para Persona 2

Una vez desplegada la página:

- [ ] Capturas de pantalla de la landing terminada (desktop y mobile)
- [ ] Lista de tecnologías utilizadas (ver sección de arriba)
- [ ] URL de producción (HTTPS) de GitHub Pages
