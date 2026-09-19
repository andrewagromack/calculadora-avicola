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
| Azul marino (primario, texto) | `#22366D` | 34, 54, 109 |
| Verde azulado (secundario) | `#0A7272` | 10, 114, 114 |
| Turquesa (acento, CTA) | `#1FBCBD` | 31, 188, 189 |

Tipografías: Space Grotesk (titulares, cifras) + IBM Plex Sans (texto),
vía Google Fonts.

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
  indicando el nombre de archivo sugerido (`assets/img/shot-dashboard.jpg`,
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
