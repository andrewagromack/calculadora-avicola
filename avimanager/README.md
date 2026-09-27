# Avimanager — Landing

Sitio estático (HTML/CSS/JS, sin build) para `avimanager.agromack.online`.

## Estructura

```
index.html
assets/css/styles.css
assets/js/main.js
assets/img/logo.png, favicon-*.png, favicon.ico, apple-touch-icon.png
```

Sin dependencias de build: se sirve tal cual desde Vercel (o cualquier
hosting estático) apuntando la raíz a esta carpeta.

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

## Contenido de Claude Design integrado

Esta versión incorpora las secciones que agregó Claude Design (Producto/
capturas, Equipo, Precios, FAQ), reescritas en HTML/CSS/JS plano —
sin `x-dc`, `support.js` ni `image-slot.js`, que no son deployables tal
cual. El acordeón de FAQ usa `<details>/<summary>` nativo, sin JS.

Se sacó la sección de video (sin video listo aún): quedó como bio de
equipo en texto, sin imagen ni ícono de play que sugiriera un video
inexistente.

## Pendientes antes de publicar

- **5 placeholders de imagen (`.media-slot`) sin reemplazar:** foto del
  hero + 3 capturas de producto. Están marcados con comentarios HTML
  indicando el nombre de archivo sugerido (`assets/img/shot-dashboard.webp`,
  etc.). Reemplazar el `<div class="media-slot">` por un `<img>` real.
- **Precios son placeholder** (`$XX.XXX` / `$XXX.XXX`). El badge "Ahorra
  2 meses" del plan anual debe cuadrar matemáticamente una vez pongas
  los valores reales.
- **Los botones "Quiero este plan" no llevan a un checkout real**, van
  al formulario de contacto (`#acceso`). Si ya tienes un link de pago
  (Hotmart/Flow), reemplázalos por ese link y ahí sí puede decir
  "Suscribirme".
- **Formulario de contacto no envía datos a ningún lado todavía.** Ver
  el comentario `TODO(backend)` en `assets/js/main.js`.
- Confirmar que `avimanager.agromack.online` quede apuntado en Cloudflare
  antes del deploy en Vercel.
