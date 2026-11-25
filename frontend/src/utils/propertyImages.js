// Self-contained, resilient architectural illustrations for luxury real estate properties.
// Styled in the natural, earthy olive green palette (#636B2F, #BAC095, #D4DE95, #3D4127).

const createSvgDataUri = (svgString) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

// 1. Luxury Villa Architecture
export const VILLA_SVG = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="vBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFBF7" />
      <stop offset="100%" stop-color="#E2E6D5" />
    </linearGradient>
    <linearGradient id="vRoof" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3D4127" />
      <stop offset="100%" stop-color="#636B2F" />
    </linearGradient>
    <linearGradient id="vGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4DE95" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#BAC095" stop-opacity="0.8" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#vBg)" />
  <g opacity="0.35" stroke="#BAC095" stroke-width="1">
    <path d="M0 60h800M0 120h800M0 180h800M0 240h800M0 300h800M0 360h800M60 0v450M120 0v450M180 0v450M240 0v450M300 0v450M360 0v450M420 0v450M480 0v450M540 0v450M600 0v450M660 0v450M720 0v450" />
  </g>
  <!-- Landscape ground line -->
  <line x1="80" y1="360" x2="720" y2="360" stroke="#3D4127" stroke-width="3" stroke-linecap="round" />
  <!-- Villa Main Block -->
  <rect x="220" y="180" width="360" height="180" rx="4" fill="#FFFFFF" stroke="#3D4127" stroke-width="2.5" />
  <!-- Upper cantilever level -->
  <rect x="180" y="110" width="320" height="90" rx="4" fill="#FAFBF7" stroke="#3D4127" stroke-width="2.5" />
  <!-- Modern overhang roof line -->
  <polygon points="160,110 520,110 500,95 180,95" fill="url(#vRoof)" />
  <!-- Panoramic windows -->
  <rect x="200" y="130" width="120" height="55" rx="3" fill="url(#vGlass)" stroke="#3D4127" stroke-width="1.5" />
  <rect x="340" y="130" width="140" height="55" rx="3" fill="url(#vGlass)" stroke="#3D4127" stroke-width="1.5" />
  <!-- Ground floor expansive glass & entry -->
  <rect x="245" y="210" width="150" height="150" fill="url(#vGlass)" stroke="#3D4127" stroke-width="1.5" />
  <line x1="320" y1="210" x2="320" y2="360" stroke="#3D4127" stroke-width="1.5" />
  <!-- Timber Louvers feature -->
  <g stroke="#636B2F" stroke-width="2" opacity="0.8">
    <line x1="420" y1="210" x2="420" y2="360" />
    <line x1="432" y1="210" x2="432" y2="360" />
    <line x1="444" y1="210" x2="444" y2="360" />
    <line x1="456" y1="210" x2="456" y2="360" />
    <line x1="468" y1="210" x2="468" y2="360" />
    <line x1="480" y1="210" x2="480" y2="360" />
  </g>
  <!-- Main Entrance Door -->
  <rect x="500" y="230" width="60" height="130" fill="#3D4127" rx="2" />
  <circle cx="512" cy="295" r="3" fill="#D4DE95" />
  <!-- Architectural Accent Label -->
  <rect x="260" y="390" width="280" height="28" rx="14" fill="#636B2F" />
  <text x="400" y="409" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">PROPWISE SIGNATURE VILLA</text>
</svg>
`);

// 2. High-Rise Luxury Penthouse
export const PENTHOUSE_SVG = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="pBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFBF7" />
      <stop offset="100%" stop-color="#E2E6D5" />
    </linearGradient>
    <linearGradient id="pRoof" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#636B2F" />
      <stop offset="100%" stop-color="#3D4127" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#pBg)" />
  <!-- Tower Background silhouettes -->
  <rect x="140" y="160" width="100" height="220" fill="#E2E6D5" stroke="#BAC095" stroke-width="1.5" opacity="0.6" />
  <rect x="560" y="130" width="110" height="250" fill="#E2E6D5" stroke="#BAC095" stroke-width="1.5" opacity="0.6" />
  <!-- Main Penthouse Tower -->
  <rect x="280" y="70" width="240" height="310" rx="6" fill="#FFFFFF" stroke="#3D4127" stroke-width="2.5" />
  <!-- Crown / Sky Terrace Deck -->
  <polygon points="260,70 540,70 520,40 280,40" fill="url(#pRoof)" stroke="#3D4127" stroke-width="2" />
  <line x1="400" y1="40" x2="400" y2="15" stroke="#636B2F" stroke-width="3" stroke-linecap="round" />
  <!-- Glazed Curtain Wall Grid in Olive Glass -->
  <g stroke="#3D4127" stroke-width="1.5" fill="#D4DE95" fill-opacity="0.35">
    <rect x="305" y="90" width="85" height="40" rx="3" />
    <rect x="410" y="90" width="85" height="40" rx="3" />
    <rect x="305" y="145" width="85" height="40" rx="3" />
    <rect x="410" y="145" width="85" height="40" rx="3" />
    <rect x="305" y="200" width="85" height="40" rx="3" />
    <rect x="410" y="200" width="85" height="40" rx="3" />
    <rect x="305" y="255" width="85" height="40" rx="3" />
    <rect x="410" y="255" width="85" height="40" rx="3" />
    <rect x="305" y="310" width="85" height="50" rx="3" fill="#3D4127" fill-opacity="1" />
    <rect x="410" y="310" width="85" height="50" rx="3" fill="#3D4127" fill-opacity="1" />
  </g>
  <line x1="80" y1="380" x2="720" y2="380" stroke="#3D4127" stroke-width="3" stroke-linecap="round" />
  <!-- Architectural Accent Label -->
  <rect x="260" y="400" width="280" height="28" rx="14" fill="#3D4127" />
  <text x="400" y="419" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#D4DE95" text-anchor="middle" letter-spacing="1.5">PROPWISE SKY PENTHOUSE</text>
</svg>
`);

// 3. Contemporary Apartment Complex
export const APARTMENT_SVG = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="aBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFBF7" />
      <stop offset="100%" stop-color="#E2E6D5" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#aBg)" />
  <g opacity="0.35" stroke="#BAC095" stroke-width="1">
    <path d="M0 60h800M0 120h800M0 180h800M0 240h800M0 300h800M0 360h800M60 0v450M120 0v450M180 0v450M240 0v450M300 0v450M360 0v450M420 0v450M480 0v450M540 0v450M600 0v450M660 0v450M720 0v450" />
  </g>
  <line x1="80" y1="360" x2="720" y2="360" stroke="#3D4127" stroke-width="3" stroke-linecap="round" />
  <!-- Apartment Complex Blocks -->
  <rect x="200" y="100" width="400" height="260" rx="4" fill="#FFFFFF" stroke="#3D4127" stroke-width="2.5" />
  <!-- Balcony projections in soft olive lime -->
  <g fill="#D4DE95" fill-opacity="0.3" stroke="#3D4127" stroke-width="1.8">
    <rect x="230" y="130" width="75" height="45" rx="2" />
    <rect x="330" y="130" width="75" height="45" rx="2" />
    <rect x="430" y="130" width="75" height="45" rx="2" />
    <rect x="230" y="200" width="75" height="45" rx="2" />
    <rect x="330" y="200" width="75" height="45" rx="2" />
    <rect x="430" y="200" width="75" height="45" rx="2" />
    <rect x="230" y="270" width="75" height="45" rx="2" />
    <rect x="330" y="270" width="75" height="45" rx="2" />
    <rect x="430" y="270" width="75" height="45" rx="2" />
  </g>
  <!-- Architectural Accent Label -->
  <rect x="260" y="390" width="280" height="28" rx="14" fill="#636B2F" />
  <text x="400" y="409" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">PROPWISE URBAN APARTMENT</text>
</svg>
`);

// 4. Commercial Corporate Tower
export const COMMERCIAL_SVG = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="cBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFBF7" />
      <stop offset="100%" stop-color="#E2E6D5" />
    </linearGradient>
    <linearGradient id="cCurtain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#636B2F" />
      <stop offset="100%" stop-color="#3D4127" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#cBg)" />
  <line x1="80" y1="360" x2="720" y2="360" stroke="#3D4127" stroke-width="3" stroke-linecap="round" />
  <!-- Angular Architectural Tower -->
  <polygon points="260,360 300,60 500,60 540,360" fill="url(#cCurtain)" stroke="#3D4127" stroke-width="2.5" />
  <!-- Glass Mullions -->
  <g stroke="#D4DE95" stroke-width="1.5" opacity="0.6">
    <line x1="320" y1="60" x2="280" y2="360" />
    <line x1="360" y1="60" x2="340" y2="360" />
    <line x1="400" y1="60" x2="400" y2="360" />
    <line x1="440" y1="60" x2="460" y2="360" />
    <line x1="480" y1="60" x2="520" y2="360" />
    <!-- Horizontal floor bands -->
    <line x1="295" y1="110" x2="505" y2="110" />
    <line x1="290" y1="160" x2="510" y2="160" />
    <line x1="285" y1="210" x2="515" y2="210" />
    <line x1="280" y1="260" x2="520" y2="260" />
    <line x1="275" y1="310" x2="525" y2="310" />
  </g>
  <!-- Architectural Accent Label -->
  <rect x="250" y="390" width="300" height="28" rx="14" fill="#3D4127" />
  <text x="400" y="409" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">PROPWISE COMMERCIAL FLOOR</text>
</svg>
`);

// 5. Historic Colonial / Heritage Estate
export const HERITAGE_SVG = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="hBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFBF7" />
      <stop offset="100%" stop-color="#E2E6D5" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#hBg)" />
  <line x1="80" y1="360" x2="720" y2="360" stroke="#3D4127" stroke-width="3" stroke-linecap="round" />
  <!-- Classical Pediment / Triangular roof in Olive -->
  <polygon points="200,160 400,60 600,160" fill="#636B2F" stroke="#3D4127" stroke-width="2.5" />
  <rect x="210" y="160" width="380" height="200" fill="#FFFFFF" stroke="#3D4127" stroke-width="2.5" />
  <!-- Heritage Portico Columns in Sage/Lime -->
  <g fill="#D4DE95" fill-opacity="0.4" stroke="#3D4127" stroke-width="2">
    <rect x="250" y="160" width="24" height="200" />
    <rect x="330" y="160" width="24" height="200" />
    <rect x="446" y="160" width="24" height="200" />
    <rect x="526" y="160" width="24" height="200" />
  </g>
  <!-- Classical Arched Entrance -->
  <path d="M370 360 v-70 a30 30 0 0 1 60 0 v70 z" fill="#3D4127" />
  <!-- Architectural Accent Label -->
  <rect x="250" y="390" width="300" height="28" rx="14" fill="#3D4127" />
  <text x="400" y="409" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#D4DE95" text-anchor="middle" letter-spacing="1.5">PROPWISE HERITAGE ESTATE</text>
</svg>
`);

// Helper to select the exact matching architectural illustration
export const getPropertyFallbackImage = (propertyType = 'Apartment', title = '') => {
  const t = (propertyType || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();

  if (t.includes('villa') || titleLower.includes('villa')) {
    return VILLA_SVG;
  }
  if (t.includes('penthouse') || titleLower.includes('penthouse') || titleLower.includes('sky')) {
    return PENTHOUSE_SVG;
  }
  if (t.includes('commercial') || t.includes('office') || titleLower.includes('commercial')) {
    return COMMERCIAL_SVG;
  }
  if (t.includes('historic') || t.includes('heritage') || titleLower.includes('heritage') || titleLower.includes('colonial')) {
    return HERITAGE_SVG;
  }
  return APARTMENT_SVG;
};
