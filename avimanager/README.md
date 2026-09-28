# Avimanager — Landing

Sitio estático (HTML/CSS/JS, sin build). Ruta prevista: `agromack.online/avimanager/` (subcarpeta del dominio, no subdominio). Todas las rutas internas son relativas, así que funciona igual en cualquier carpeta.

## Estructura

```
index.html                       página principal
demo.html                        demo interactivo (3 pantallas de ejemplo)
calculadora-uniformidad.html     calculadora gratuita
privacidad.html                  política de privacidad
assets/css/styles.css
assets/js/main.js                nav, lightbox, CTA móvil, video, eventos de plan
assets/js/demo.js                navegación de la demo
assets/js/calculadora-uniformidad.js
assets/img/                      imágenes (webp), logo, favicons, og-image.jpg
```

Sin dependencias de build: se sirve tal cual desde cualquier hosting estático.

## Paleta

| Uso | Hex | RGB |
|---|---|---|
| Azul marino (primario, texto) | `#1A2A5C` | 26, 42, 92 |
| Verde azulado (secundario) | `#0A7272` | 10, 114, 114 |
| Turquesa (acento, CTA) | `#1FBCBD` | 31, 188, 189 |

Tipografías: Space Grotesk (titulares, cifras) + IBM Plex Sans (texto),
vía Google Fonts.

## Mejoras UX/UI (sin cambios de texto)

- Orden de secciones: Antes/después sube tras el contexto; Plataformas pasa antes de Equipo; FAQ queda justo antes del formulario.
- Ritmo de fondos alternado (`--bg` / `--bg-alt`) y padding de sección fluido (`--section-y`).
- Marcos de capturas unificados: `.frame-browser` (escritorio), `.frame-crop` (recorte móvil), `.frame-paper` (papel). Sin recortes (`object-fit: contain`).
- Hovers honestos: solo lo clicable se eleva; estados `:active` en botones; subrayado animado y sección activa en el menú; hovers desactivados en pantallas táctiles.
- Mobile: hamburguesa desde 900px, menú con X, fondo oscuro y cierre con Escape; barra CTA aparece al pasar el hero y se oculta en Precios/Acceso; WhatsApp se acomoda; chips del hero bajo la captura; Antes/después como carrusel; lightbox desplazable para capturas anchas; áreas táctiles de 44px en el footer.
- Rendimiento/accesibilidad: imagen del hero sin lazy-load, video de YouTube carga al hacer clic, foco en teal (turquesa sobre fondos oscuros), `--ink-faint` más oscuro para contraste AA, botón "volver arriba" en escritorio.

## Integraciones

| Qué | Dónde | Notas |
|---|---|---|
| Google Analytics 4 | `<head>` de las 4 páginas | ID `G-YMJ07HMBLQ` |
| Meta Pixel | `<head>` de las 4 páginas | ID `1386238589918832`; `PageView` en todas y `Lead` al enviar el formulario |
| Microsoft Clarity | `<head>` de las 4 páginas | mapas de calor y grabaciones |
| MailerLite | formulario `#acceso` de `index.html` | envío real; la función `ml_webform_success_46151553` (al final de `index.html`) muestra el mensaje de éxito y dispara `Lead` (Meta) y `generate_lead` (GA4) |
| Hotmart | botones de plan (`#precios`, calculadora) | checkout externo; `InitiateCheckout` y `Purchase` los reporta Hotmart a Meta. El sitio NO los envía (se contarían doble) |
| WhatsApp | botón flotante en las 4 páginas | enlace `wa.me/56998791270` con mensaje prellenado; cada clic se mide como `Contact` (ver eventos) |
| YouTube | video de `index.html` | se carga al hacer clic (`.video-facade`) |

Eventos propios del sitio:

| Acción | Meta | Google Analytics |
|---|---|---|
| Cargar cualquier página | `PageView` | página vista |
| Enviar el formulario de acceso | `Lead` (`content_name: formulario`) | `generate_lead` (`lead_source: formulario`) |
| Clic en el botón de WhatsApp | `Contact` (`content_name: whatsapp`) | `whatsapp_click` |
| Clic en un plan (sale a Hotmart) | `AddToCart` | `begin_checkout` |
| Pantallas y CTA de la demo | (no) | `demo_screen`, `demo_cta` |

El plan y el precio de los eventos de plan se leen de la tarjeta, así que siguen al precio si cambia. Deben marcarse como eventos clave en GA4 los que se quieran contar como conversión.

## Caché

`styles.css` y los `.js` se cargan con `?v=AAAAMMDD` (con una letra si hay varios cambios el mismo día, ej. `20260928d`) para que los navegadores (y Cloudflare) no sirvan una versión vieja tras un cambio. **Al desplegar cambios de CSS o JS, actualiza esa fecha en las 4 páginas.**

Comando para cambiarla en todas:

```
sed -i 's/?v=20260928d/?v=NUEVAVERSION/g' *.html
```

## Antes de subir

- Reemplazar en `index.html`, `calculadora-uniformidad.html` y `demo.html` las URLs absolutas de `og:url`, `og:image` y `canonical` si la ruta final no es `https://agromack.online/avimanager/`.
- Verificar el dominio en Meta Business (conviene el método DNS TXT, porque el sitio vive en una subcarpeta).
- Probar en Meta Test Events que llegue `Lead`, y en GA4 (tiempo real) `generate_lead`, `begin_checkout` y `demo_screen`.
- Revisar la política de privacidad con un abogado antes de campañas pagas en varios países.
- No hay `robots.txt` ni `sitemap.xml` dentro de esta carpeta: al vivir en una subcarpeta, el `robots.txt` va en la raíz del dominio.
