# Guía de Branding y Estilos Visuales (Pagurai)

Esta guía detalla la paleta de colores, tipografías, efectos interactivos de botones, tarjetas de brillo dinámico y animaciones del proyecto para que puedas replicar exactamente este tema visual premium en otro proyecto.

---

## 1. Paleta de Colores (CSS Variables)

El tema visual se basa en un esquema oscuro de ciencia ficción futurista con acentos azul neón y detalles en rosa neón para puntos de interactividad clave.

### Variables Globales de Color
```css
#vw-ghl-landing {
  /* Fondos */
  --bg-deep: #0a0a0f;       /* Fondo oscuro base del cuerpo */
  --bg: #12121a;            /* Fondo de secciones/bloques */
  --bg-elevated: #1a1a2e;   /* Fondo de modales o elementos elevados */
  --bg-soft: #101822;       /* Fondo alternativo suave */

  /* Bordes */
  --border: rgba(0, 152, 255, 0.15);
  --border-hover: rgba(0, 152, 255, 0.32);

  /* Texto */
  --text-primary: #f3f4f6;
  --text-secondary: rgba(243, 244, 246, 0.72);
  --text-tertiary: rgba(243, 244, 246, 0.44);

  /* Acentuación Neón */
  --accent: #0098FF;        /* Azul Eléctrico */
  --accent-light: #4DB8FF;  /* Azul Claro */
  --lime: #0360AB;          /* Azul Profundo / Cobalto */
  --white: #fff;
  --pink-neon: #E72175;     /* Rosa Neón (usado en checks, kickers y dots) */
}
```

### Degradados (Gradients)
* **Texto de Acento**: `linear-gradient(90deg, #0098FF, #4DB8FF, #0360AB)`
* **Botones CTA**: `linear-gradient(135deg, #0360AB, #0098FF, #4DB8FF)`
* **Fondo de Botones en Hover**: `linear-gradient(135deg, #0055FF, #3388FF)`

---

## 2. Tipografía (Google Fonts)

El proyecto utiliza tipografías limpias y de alta legibilidad, importando fuentes desde Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Oswald:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Inter:wght@100;300;400;500;700;900&display=swap');
```

* **Titulares (`h1`, `h2`, `h3`, etc.)**: `'Oswald', sans-serif;` con transformación `text-transform: uppercase;` y estilos en cursiva (`font-style: italic;`).
* **Cuerpo de texto**: `'DM Sans', sans-serif;` o `'Inter', sans-serif;`.
* **Función de Tiempo CSS**: `cubic-bezier(.16, 1, .3, 1)` (aporta transiciones fluidas de aceleración y parada).

---

## 3. Botón CTA Premium (Efecto de Respiración Neón y Glow de Cursor)

Este botón cuenta con un efecto de respiración neón en reposo, escalado interactivo, y un destello (glow) radial translúcido que sigue el movimiento exacto del puntero del ratón en hover.

### HTML
```html
<button type="button" class="vw-cta-btn" data-vw-popup>
  <span class="vw-btn-glow"></span>
  TEXTO LLAMATIVO
</button>
```

### CSS
```css
#vw-ghl-landing .vw-cta-btn {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: .035em;
  color: #ffffff;
  background: #0055FF;
  border: 1.5px solid rgba(0, 210, 255, 0.8);
  padding: 24px 54px;
  border-radius: 999px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
  animation: neon-breath-filled 3s ease-in-out infinite;
}

#vw-ghl-landing .vw-cta-btn:hover {
  transform: translateY(-3px) scale(1.04);
  background: #3388FF;
  border-color: #ffffff;
  animation-play-state: paused;
  box-shadow: 
    0 0 30px #0055FF,
    0 0 60px #0055FF,
    inset 0 0 16px rgba(255, 255, 255, 0.4);
  text-shadow: 0 0 8px #fff, 0 0 18px #0055FF;
}

#vw-ghl-landing .vw-cta-btn:active {
  transform: scale(.98);
}

/* Capa de destello que sigue el cursor */
#vw-ghl-landing .vw-cta-btn .vw-btn-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background: radial-gradient(140px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.35) 0%, rgba(0, 85, 255, 0.5) 45%, transparent 70%);
  opacity: 0;
  transition: opacity .4s ease;
}

#vw-ghl-landing .vw-cta-btn:hover .vw-btn-glow {
  opacity: 1;
}

/* Animación de respiración neón */
@keyframes neon-breath-filled {
  0%, 100% {
    box-shadow: 0 0 12px rgba(0, 85, 255, 0.5), inset 0 0 8px rgba(255, 255, 255, 0.1);
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 28px rgba(0, 85, 255, 0.9), 0 0 45px rgba(0, 85, 255, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.3);
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 15px #0055FF;
  }
}
```

### JavaScript (Seguimiento del Cursor)
```javascript
document.querySelectorAll('.vw-cta-btn').forEach(function (btn) {
  // Asegura que exista el elemento span del glow
  if (!btn.querySelector('.vw-btn-glow')) {
    var glow = document.createElement('span');
    glow.className = 'vw-btn-glow';
    btn.insertBefore(glow, btn.firstChild);
  }
  btn.addEventListener('pointermove', function (e) {
    var rect = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    btn.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  });
});
```

---

## 4. Tarjeta Glassmorphic Glow Dinámico (Glow Card)

Estas tarjetas simulan cristal esmerilado con bordes brillantes y un destello de luz interno que sigue el puntero del ratón por la página.

### HTML
```html
<article class="vw-glow-card">
  <div class="vw-card-icon">🚀</div>
  <h3 class="vw-card-title">Título</h3>
  <p class="vw-card-text">Descripción...</p>
</article>
```

### CSS
```css
#vw-ghl-landing .vw-glow-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background: linear-gradient(160deg, rgba(0, 152, 255, 0.08) 0%, rgba(0, 152, 255, 0.018) 100%);
  border: 1px solid rgba(0, 152, 255, 0.15);
  padding: 28px;
  text-align: left;
  --glow-x: 50%;
  --glow-y: 50%;
  transition: transform .35s cubic-bezier(.16, 1, .3, 1), border-color .35s cubic-bezier(.16, 1, .3, 1), box-shadow .35s cubic-bezier(.16, 1, .3, 1);
}

/* Efecto de destello interno radial */
#vw-ghl-landing .vw-glow-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(600px circle at var(--glow-x) var(--glow-y), rgba(0, 152, 255, 0.13), rgba(77, 184, 255, 0.06) 40%, transparent 70%);
  opacity: 0;
  transition: opacity .4s ease;
  pointer-events: none;
  z-index: 1;
}

/* Iluminación de bordes (borde con gradiente interactivo) */
#vw-ghl-landing .vw-glow-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(420px circle at var(--glow-x) var(--glow-y), rgba(0, 152, 255, 0.42), rgba(77, 184, 255, 0.2) 40%, transparent 70%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity .4s ease;
  pointer-events: none;
  z-index: 1;
}

#vw-ghl-landing .vw-glow-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 152, 255, 0.34);
  box-shadow: 0 24px 60px rgba(0, 152, 255, 0.09);
}

#vw-ghl-landing .vw-glow-card:hover::before,
#vw-ghl-landing .vw-glow-card:hover::after {
  opacity: 1;
}

#vw-ghl-landing .vw-glow-card > * {
  position: relative;
  z-index: 2;
}
```

### JavaScript (Cálculo de Posición en Documento Global)
```javascript
document.addEventListener('pointermove', function (e) {
  document.querySelectorAll('.vw-glow-card').forEach(function (card) {
    var rect = card.getBoundingClientRect();
    card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
  });
});
```

---

## 5. Fondo Interactivo de Matriz de Puntos (Dot Matrix Canvas)

Se renderiza sobre un elemento `<canvas>` que simula un fondo dinámico con estrellas o píxeles digitales que parpadean.

### HTML
```html
<div class="vw-dot-bg">
  <canvas data-vw-dot="hero"></canvas>
  <div class="vw-dot-fade"></div>
</div>
```

### JavaScript (Generador del Canvas y Efectos)
El script calcula las posiciones en una cuadrícula y aplica efectos de parpadeo (flicker/blink) con opacidades aleatorias basadas en el `devicePixelRatio` para máxima nitidez en pantallas de alta resolución.
> Puedes encontrar el código de inicialización completo del canvas en la función `createDotMatrix` en el archivo [main.js](file:///c:/Users/DELL/OneDrive/Documentos/Pagurai-LandingPage/js/main.js#L318-L423).
