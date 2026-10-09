# Esper Odontología Mendoza — Landing Page

Landing page demo para **Esper Odontología Mendoza**, clínica de rehabilitación oral y estética especializada en carga inmediata de arcos completos con prótesis fijas sobre implantes. Dr. Jorge Esteban Esper — Vista Flores, Mendoza.

## Estructura del proyecto

```
Esper-Salud/
├── index.html          ← Página principal (HTML semántico, Schema.org, Open Graph)
├── css/
│   └── styles.css      ← Design system + estilos Mobile-first (vanilla CSS)
├── js/
│   └── main.js         ← Lógica: hamburguesa, slider, animaciones, scroll
├── assets/
│   ├── logo.png        ← Logo generado (muela estilizada + patrón geométrico)
│   ├── esper-1.jpg     ← [COMPLETAR] Foto retrato Dr. Esper (4:5 o cuadrado)
│   ├── esper-2.jpg     ← [COMPLETAR] Segunda foto del Dr. Esper
│   ├── antes-despues-1-antes.jpg   ← [COMPLETAR]
│   ├── antes-despues-1-despues.jpg ← [COMPLETAR]
│   ├── antes-despues-2-antes.jpg   ← [COMPLETAR]
│   ├── antes-despues-2-despues.jpg ← [COMPLETAR]
│   ├── antes-despues-3-antes.jpg   ← [COMPLETAR]
│   ├── antes-despues-3-despues.jpg ← [COMPLETAR]
│   └── og-image.jpg    ← [COMPLETAR] Imagen para Open Graph (1200×630px)
├── vercel.json         ← Configuración para deploy en Vercel
└── .gitignore
```

## Placeholders que requieren completar

| Campo | Sección |
|-------|---------|
| Foto `assets/esper-1.jpg` | Profesional |
| Foto `assets/esper-2.jpg` | Profesional |
| Matrícula del Dr. Esper | Profesional |
| Formación y títulos | Profesional |
| Años de experiencia | Profesional |
| Fotos antes/después (6 imágenes) | Resultados |
| Testimonios reales de Google (3) | Opiniones |
| Imagen OG `assets/og-image.jpg` | Meta / Open Graph |
| URL canónica real | `<head>` |
| Embed de Google Maps (src del iframe) | Contacto |

## Cómo visualizar localmente

Abrí `index.html` directamente en el navegador, o usá un servidor local:

```bash
# Con Python (si está instalado)
python -m http.server 8000

# Con Node.js (npx)
npx serve .
```

## Cómo publicar en Vercel

1. Subí el proyecto a GitHub:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/esper-odontologia.git
   git push -u origin main
   ```
2. Entrá a [vercel.com](https://vercel.com) → Import Project → seleccioná el repo.
3. Vercel detecta automáticamente el sitio estático. Hacé clic en **Deploy**.
4. (Opcional) Configurá tu dominio en Settings → Domains.

## Tecnologías

- HTML5 semántico + ARIA
- CSS vanilla (sin frameworks, design tokens como variables CSS)
- JavaScript puro (ES6+, sin dependencias)
- Schema.org `Dentist`, Open Graph, meta SEO

## Créditos

Desarrollado con la skill **ui-ux-pro-max** (paleta, tipografía, espaciado, accesibilidad WCAG AA) y **git-workflow** (conventional commits).
