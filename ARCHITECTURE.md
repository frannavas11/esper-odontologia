# ARCHITECTURE.md — Esper Odontología Mendoza

> Documento de arquitectura y contexto del proyecto. **Leelo completo al empezar cualquier chat o tarea.** Si un cambio altera algo descripto acá (estructura, secciones, tokens, SEO, deploy, datos), actualizá este archivo en el mismo commit.

---

## 1. Resumen

| Item | Valor |
|---|---|
| Cliente | Esper Odontología Mendoza (Vista Flores, Mendoza, Argentina) |
| Profesional | Od. Jorge Esteban Esper |
| Rubro | Rehabilitación oral y estética, implantes, carga inmediata de arcos completos con prótesis fijas |
| Tipo de sistema | Landing page estática de una sola página (demo comercial) |
| Producción | https://esper-odontologia.vercel.app/ |
| Repositorio | https://github.com/frannavas11/esper-odontologia (rama `main`) |
| Carpeta local | `Esper-Salud/` |
| Idioma | Español rioplatense (es_AR) |

**Objetivo del sistema:** transmitir seriedad clínica y convertir visitas en consultas por WhatsApp. No hay backend, formularios ni base de datos: el único canal de conversión es un enlace `wa.me`.

---

## 2. Contexto del sistema

```
                    ┌──────────────────────────────────────┐
  Visitante ──────▶ │  Vercel (CDN + hosting estático)      │
  (mobile/desktop)  │  index.html · css · js · assets       │
                    └───────────────┬──────────────────────┘
                                    │ el navegador carga además
          ┌─────────────────────────┼──────────────────────────┐
          ▼                         ▼                          ▼
   Google Fonts              Google Maps (iframe)       Enlaces de salida
   (Poppins)                 embed por dirección        wa.me (WhatsApp)
                                                        Instagram
                                                        Google Maps (reseñas, cómo llegar)

  GitHub (main) ──push──▶ Vercel ──deploy automático──▶ Producción
```

**Dependencias externas (todas en tiempo de ejecución, ninguna en build):**

| Servicio | Uso | Si falla |
|---|---|---|
| Google Fonts | Tipografía Poppins | Cae a `system-ui` (definido en `--font-family`) |
| Google Maps embed | Mapa en Contacto | Queda el botón "Cómo llegar" |
| WhatsApp (`wa.me`) | CTA principal | Es el canal de conversión: monitorear |
| Instagram | Enlace de salida | Sin impacto funcional |

No hay analytics, cookies, formularios, APIs propias ni almacenamiento de datos de pacientes.

---

## 3. Stack y restricciones

- HTML5 semántico + ARIA, CSS vanilla (variables CSS), JavaScript ES6+ puro.
- **Sin frameworks, sin bundler, sin `package.json`, sin build.** Es una decisión deliberada (ver sección 12). Antes de agregar cualquier dependencia, preguntar.
- Mobile-first. Accesibilidad objetivo: WCAG AA.
- Los archivos servidos son exactamente los del repo.

---

## 4. Estructura del repositorio

```
Esper-Salud/
├── index.html        Documento único: <head> (SEO, Open Graph, JSON-LD) + secciones
├── css/styles.css    Design system (tokens en :root) + estilos de todo el sitio
├── js/main.js        Comportamiento: menú, header, slider, animaciones, scroll
├── assets/
│   ├── logo.svg          Logo vectorial (el que se usa en header y footer)
│   ├── logo.png          Logo raster (~470 KB, candidato a eliminar/comprimir)
│   ├── esper-1.jpg       Retrato del profesional
│   ├── caso-1/2/3.jpg    Casos del slider (caso-3 ~400 KB)
│   └── og-image.jpg      Imagen para redes, 1200×630 (~380 KB)
├── robots.txt
├── sitemap.xml
├── .gitignore
├── README.md         Documentación pública (desactualizada, ver sección 13)
└── ARCHITECTURE.md   Este archivo
```

---

## 5. Arquitectura de la página

Una sola página con navegación por anclas. Cada sección usa `aria-labelledby` y una clase de fondo (`section--light | dark | white`) para alternar ritmo visual.

| # | `id` | Función | Contenido |
|---|---|---|---|
| – | `site-header` | Navegación | Logo, menú, botón "Agendá tu cita", hamburguesa en mobile |
| 1 | `inicio` | Captación | Título "Tu nueva sonrisa, en un solo día", CTAs, badges (4,6 ★, carga inmediata, planificación digital), tarjeta showcase |
| 2 | `servicios` | Oferta | 8 cards (3 destacadas de especialidad: prótesis fijas, implantes y rehabilitación oral) |
| 3 | `tecnologia` | Diferenciación | Planificación digital y precisión clínica, 4 bloques |
| 4 | `resultados` | Prueba | Slider antes/después de 3 casos con leyenda de consentimiento |
| 5 | `agendar` | Conversión | 3 pasos + horarios |
| 6 | `preguntas` | Objeciones | FAQ clínico (candidatos, primera consulta, dolor, duración, turnos) |
| 7 | `profesional` | Autoridad | Presentación del Od. Esper |
| 8 | `contacto` | Contacto | Dirección, horarios, WhatsApp, Instagram, mapa embebido |
| – | footer | Legal | Navegación, contacto, copyright, aviso de privacidad (Ley 25.326), aviso de carácter informativo |
| – | flotante | Conversión | Botón de WhatsApp fijo en toda la página |

Los enlaces del menú y del footer apuntan a estos `id`. Si se agrega, renombra o elimina una sección, actualizar menú, footer y este documento.

---

## 6. Módulos de JavaScript (`js/main.js`)

Cada módulo es una función autoejecutada que sale rápido (`return`) si no encuentra sus elementos en el DOM.

| Módulo | Responsabilidad |
|---|---|
| Menú móvil | Abre/cierra la hamburguesa, cierra al elegir un link y con `Escape` |
| Header | Cambia el estilo del header al hacer scroll (listener `passive`) |
| Slider de casos | `goTo(i)` alterna slides con `hidden`, dots con `aria-selected`, flechas, teclado, swipe táctil y autoplay que se pausa al interactuar. Toma slides y dots del HTML automáticamente |
| Animaciones | `IntersectionObserver` para fade-up/left/right; respeta `prefers-reduced-motion` |
| Navegación activa | `IntersectionObserver` que marca la sección visible en el menú |
| Scroll suave | Intercepta anclas internas |
| Footer | Escribe el año actual en `#copyright-year` |

Sin estado global, sin librerías.

---

## 7. Design system (`css/styles.css`)

Todo vive como variables CSS en `:root`. **Usar siempre los tokens; no hardcodear colores, espaciados ni tamaños nuevos.**

| Grupo | Tokens |
|---|---|
| Color | `--color-navy #001435` (fondo principal), `--color-royal #001F50`, `--color-accent #48B4DC`, `--color-accent-dark #34A0C8` (hover), `--color-sky-soft #CDEBFA`, escala `--color-gray-50…900`, `--color-text #1E293B`, `--color-text-light #475569`, `--color-star #F59E0B` |
| Tipografía | `--font-family` Poppins (300–800, `font-display: swap`), `--font-size-xs` 0.75rem a `--font-size-6xl` 3.75rem |
| Espaciado | `--space-1` 0.25rem a `--space-24` 6rem |
| Forma | `--radius-sm` a `--radius-full`, `--shadow-sm/md/lg/xl/accent` |

La paleta es la "versión sobria" (azul noche + acero). La paleta original del Instagram del cliente era más brillante (`#003087`, `#0047AB`, `#00B4D8`).

Principios: mobile-first, contraste AA, áreas táctiles mínimas de 44×44 px, animaciones suaves y respetuosas de `prefers-reduced-motion`.

---

## 8. SEO y descubribilidad

- **Metadatos:** `title`, `description`, `keywords`, `author`, `geo.placename`, `geo.region` (AR-M), `theme-color`.
- **Open Graph / Twitter Card** (`summary_large_image`) con `assets/og-image.jpg` en JPG de 1200×630 (los SVG no funcionan en redes).
- **JSON-LD `Dentist`:** nombre, descripción, teléfono `+5492622503823`, dirección, horarios (lun–vie, dos franjas), `sameAs` (Instagram), `employee`. **No agregar `aggregateRating`** (Google no admite reseñas propias en el marcado).
- **`robots.txt` y `sitemap.xml`** apuntan al dominio de Vercel. Actualizar `<lastmod>` al cambiar contenido.
- **`canonical`/`og:url`** = `https://esper-odontologia.vercel.app/`.
- **Si se compra dominio propio**, actualizar: canonical, `og:url`, `og:image`, `twitter:image`, `url` del JSON-LD, `robots.txt`, `sitemap.xml`.
- **Indexación:** configurado con `noindex, nofollow` mientras sea demo para no competir con la web definitiva (quitar al publicar en producción oficial).
- Para que Google la encuentre por el nombre del negocio hace falta dominio propio, ficha de Google Business con el enlace a la web, y registro en Search Console.

---

## 9. Datos del cliente (fuente de verdad)

- **Dirección:** San Martín 196, Vista Flores, Mendoza (CP 5565), según su Instagram. La ficha de Maps muestra otra (RP92 300 202): verificar el pin.
- **WhatsApp:** +54 9 2622 50-3823 → `https://wa.me/5492622503823?text=Hola%2C%20quiero%20agendar%20una%20consulta`
- **Horarios:** 8:30–12:30 y 15:00–19:00. En el sitio figura "lunes a viernes, con turno previo" (**sin confirmar**).
- **Instagram:** @esperodontologiamendoza
- **Google Maps:** 4,6 ★ / 11 reseñas (dato del 9/10/2026).
- **Servicios oficiales:** implantes, odontología digital, planificación digital, diseño de sonrisa, rehabilitación oral, prótesis fijas sobre implantes en el día, coronas cerámicas en el día, ortodoncia (incluye alineadores sin brackets).

**Acoplamiento a tener presente:** no hay una fuente única en código. El teléfono y el link de WhatsApp aparecen repetidos en hero, agendar, contacto, footer, botón flotante, JSON-LD y meta tags; los horarios en agendar, contacto, footer y JSON-LD. Cambiar un dato exige buscar y reemplazar en todo `index.html`.

---

## 10. Despliegue y entorno

1. `git push origin main`.
2. Vercel (proyecto conectado al repo) despliega solo. No hay build ni `vercel.json`.
3. Verificar en producción (~1 minuto, refrescar sin caché).

Local: abrir `index.html`, o `npx serve .` / `python -m http.server 8000`.

**Cada push a `main` es un deploy a producción.** No hay rama de staging; probar localmente antes de commitear.

---

## 11. Calidad transversal

- **Accesibilidad:** HTML semántico, `alt` descriptivos, foco visible, navegación por teclado (menú y slider), `aria-*` en tabs y menú, `prefers-reduced-motion`.
- **Rendimiento:** sin dependencias, JS con `defer`, fuentes con `swap`, imágenes a optimizar (ver deuda). Verificar con Lighthouse tras cambios grandes.
- **Seguridad y privacidad:** sin secretos ni backend. No commitear `.env`, claves ni datos de pacientes. El aviso de privacidad del footer cita la Ley 25.326 (confirmar redacción con el cliente). Las fotos de casos requieren consentimiento firmado.

---

## 12. Decisiones de arquitectura

| Decisión | Motivo |
|---|---|
| Sitio estático sin framework | Es una landing de contenido: cero build, carga rápida, mantenimiento trivial, deploy inmediato |
| Una sola página con anclas | Recorrido lineal hacia la conversión; menos superficie que mantener |
| WhatsApp como único canal (sin formulario) | Es el canal que ya usa la clínica y evita guardar datos de salud de personas |
| WhatsApp de recepción (no del profesional) | El canal de WhatsApp es atendido por la recepción de la clínica para coordinar turnos y consultas administrativas; no es comunicación directa con el profesional |
| Vercel + deploy por push | Gratis para una demo, HTTPS y CDN sin configurar |
| Tokens CSS | Cambiar la identidad visual tocando un solo bloque |
| Paleta sobria | Una clínica debe verse seria; el celeste brillante original lo perjudicaba |
| "Od." en vez de "Dr." | El título no está confirmado por el cliente |
| Lenguaje cauteloso de salud | Evita promesas de resultado; la publicidad sanitaria tiene reglas (validar con el Colegio Odontológico de Mendoza) |

---

## 13. Deuda técnica y pendientes

**Contenido (confirmar con Jorge):**
1. Título ("Od."/"Dr."), matrícula, formación y años de experiencia: solo si él los confirma.
2. Equipamiento real (escaneo 3D, cirugía guiada, CAD/CAM); sacar lo que no use.
3. Consentimiento firmado de los pacientes de los casos, o quitar la leyenda y las fotos.
4. Horarios (¿sábados?) y atención solo con turno.
5. Claims a revisar: "turnos programados", "dedicación exclusiva", "exactitud milimétrica".
~~6. FAQ del dolor: suavizar el "No" absoluto y la promesa de recuperación "rápida y confortable".~~ *(resuelto)*
~~7. "Opiniones verificadas" → "Opiniones en Google".~~ *(resuelto: sección opiniones eliminada por quedar sin reseñas específicas)*

**Técnico:**
~~8. El paso 3 de "Cómo agendar" dice "El **Dr.** Esper": unificar a "Od.".~~ *(resuelto)*
~~9. Copyright `© 2024` en el HTML (el JS lo corrige en el navegador, pero los buscadores ven 2024): poner 2026.~~ *(resuelto)*
10. Optimizar `logo.png`, `caso-3.jpg` y `og-image.jpg`; eliminar `logo.png` si no se usa.
11. Verificar el pin del mapa en San Martín 196.
12. `README.md` desactualizado: reescribirlo.
13. `robots.txt` y `sitemap.xml` con cambios sin commitear (fin de línea CRLF).
~~14. Decidir `noindex` mientras sea demo.~~ *(resuelto: agregado `noindex, nofollow` temporal en el HTML)*
15. Mantener al día el 4,6 / 11 reseñas.

**Checklist de entrega al cliente:** resolver 1–5 y 11, quitar `noindex`, dominio propio con actualización de URLs, enlazar la web desde Google Maps e Instagram, registrar el sitio en Search Console y enviar el sitemap.

---

## 14. Reglas de trabajo (obligatorias para todo chat o agente)

### 14.1 Commit y push automático en cada cambio

Al terminar **cada** cambio, por chico que sea, sin pedir confirmación:

1. `git status` y revisar que no haya archivos ajenos, secretos ni temporales.
2. `git add` solo de los archivos del cambio (evitar `git add .` a ciegas).
3. `git commit` con Conventional Commits en español (ver 14.2).
4. `git pull --rebase origin main` y luego `git push origin main`.
5. Informar hash, mensaje y si el push salió bien.

Seguridad:
- Nunca `git push --force` ni reescribir historia publicada.
- Si el push falla (conflicto, autenticación, red), no insistir en loop: explicar el error y frenar.
- Un commit = un cambio lógico; varias partes independientes, varios commits.
- Antes de commitear, abrir el sitio local y verificar que no haya errores en consola (el push despliega a producción).

### 14.2 Formato de commits

`tipo: descripción corta, en minúscula y en presente`

Tipos: `feat`, `fix`, `style`, `content`, `seo`, `perf`, `docs`, `refactor`, `chore`.
Ejemplos: `content: unificar "Od." en paso 3 de agendar`, `seo: agregar noindex mientras sea demo`.

### 14.3 Reglas de contenido

- No inventar datos médicos, años de experiencia, títulos, matrícula, equipamiento, precios ni promesas de resultado.
- Lo no confirmado queda como `[COMPLETAR]` solo en desarrollo; nunca visible en producción.
- Tono cercano y profesional, rioplatense ("Escribinos", "Agendá", "Vení"), sin absolutos en salud ("no duele", "garantizado").
- Profesional: **"Od. Jorge Esteban Esper"**.

### 14.4 Estilo de trabajo

- Cambios chicos y puntuales; editar en vez de reescribir archivos enteros.
- Respetar los tokens del design system.
- Mantener este documento al día.

### 14.5 Historial

`initial landing` → `fotos reales y logo vectorial` → `ajustes de layout` → `tercer caso en el slider` → `hero full-impact, paleta sobria, SEO, robots y sitemap` → `seriedad médica, FAQ, showcase del hero, og:image y correcciones técnicas`. Detalle exacto: `git log --oneline`.
