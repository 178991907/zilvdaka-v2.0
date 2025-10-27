
export type PetInfo = {
  id: string;
  name: string;
  unlockLevel: number;
  getSvg: (blinkDuration?: number, eyeAnimation?: object) => string;
};

export const Pets: PetInfo[] = [
  {
    id: 'pet1',
    name: 'Blobby',
    unlockLevel: 1,
    getSvg: (blinkDuration = 4) => `
<svg viewBox="0 0 200 200" class="w-full h-full">
  <defs>
    <radialGradient id="bodyGradient1" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="hsl(var(--primary))" />
      <stop offset="100%" stop-color="hsl(var(--primary) / 0.7)" />
    </radialGradient>
  </defs>
  <style>
    .eye-left-auto { animation: blink ${blinkDuration}s infinite; }
    .eye-right-auto { animation: blink ${blinkDuration}s infinite 0.1s; }
    @keyframes sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(3deg); } }
    @keyframes blink { 0%, 95%, 100% { transform: scaleY(1); } 97.5% { transform: scaleY(0.1); } }
  </style>
  <ellipse cx="100" cy="180" rx="60" ry="10" fill="black" opacity="0.1" />
  <g id="body" style="transform-origin: bottom center; animation: sway 8s ease-in-out infinite;">
    <path d="M 50,170 C 20,130 20,70 50,40 C 80,10 120,10 150,40 C 180,70 180,130 150,170 Z" fill="url(#bodyGradient1)" />
  </g>
  <g id="eyes">
    <circle id="eye-left-bg" cx="80" cy="90" r="15" fill="white" />
    <circle id="eye-right-bg" cx="120" cy="90" r="15" fill="white" />
    <circle id="eye-left" cx="83" cy="90" r="7" fill="black" class="eye-left-auto" />
    <circle id="eye-right" cx="117" cy="90" r="7" fill="black" class="eye-right-auto" />
  </g>
  <path id="mouth" d="M 90,130 Q 100,145 110,130" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" />
</svg>
    `,
  },
  {
    id: 'pet2',
    name: 'Spiky',
    unlockLevel: 2,
    getSvg: (blinkDuration = 3) => `
<svg viewBox="0 0 200 200" class="w-full h-full">
  <defs>
    <radialGradient id="bodyGradient2" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="hsl(var(--chart-2))" />
      <stop offset="100%" stop-color="hsl(var(--chart-2) / 0.7)" />
    </radialGradient>
  </defs>
  <style>
    .eye-auto { animation: blink ${blinkDuration}s infinite; }
    @keyframes sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-2deg); } }
    @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
  </style>
  <ellipse cx="100" cy="180" rx="50" ry="8" fill="black" opacity="0.1" />
  <g id="body" style="transform-origin: bottom center; animation: sway 7s ease-in-out infinite;">
    <path d="M 60,170 C 40,140 50,90 60,60 C 70,30 130,30 140,60 C 150,90 160,140 140,170 Z" fill="url(#bodyGradient2)" />
    <path d="M100,25 L110,50 L90,50 Z" fill="hsl(var(--chart-2) / 0.9)" />
    <path d="M70,40 L80,60 L60,60 Z" transform="rotate(-30 70 40)" fill="hsl(var(--chart-2) / 0.9)" />
    <path d="M130,40 L140,60 L120,60 Z" transform="rotate(30 130 40)" fill="hsl(var(--chart-2) / 0.9)" />
  </g>
  <g id="eyes">
    <circle id="eye-bg" cx="100" cy="100" r="18" fill="white" />
    <circle id="eye-left" cx="100" cy="100" r="8" fill="black" class="eye-auto" />
  </g>
  <path id="mouth" d="M 90,140 C 100,130 110,130 120,140" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" />
</svg>
    `,
  },
  {
    id: 'pet3',
    name: 'Cacto',
    unlockLevel: 5,
    getSvg: (blinkDuration = 5) => `
<svg viewBox="0 0 200 200" class="w-full h-full">
  <defs>
    <radialGradient id="bodyGradient3" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="#84cc16" />
      <stop offset="100%" stop-color="#4d7c0f" />
    </radialGradient>
  </defs>
  <style>
    .eye-left-auto { animation: blink ${blinkDuration}s infinite; }
    .eye-right-auto { animation: blink ${blinkDuration}s infinite 0.2s; }
    @keyframes sway { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(3px); } }
    @keyframes blink { 0%, 97%, 100% { transform: scaleY(1); } 98.5% { transform: scaleY(0.1); } }
  </style>
  <ellipse cx="100" cy="180" rx="55" ry="10" fill="black" opacity="0.1" />
  <g id="body" style="transform-origin: bottom center; animation: sway 5s ease-in-out infinite;">
    <path d="M 70,175 C 70,140 60,80 100,50 C 140,80 130,140 130,175 Z" fill="url(#bodyGradient3)" />
    <path d="M 60,120 C 40,110 40,80 60,70" stroke="url(#bodyGradient3)" stroke-width="8" fill="none" stroke-linecap="round" />
     <path d="M 140,120 C 160,110 160,80 140,70" stroke="url(#bodyGradient3)" stroke-width="8" fill="none" stroke-linecap="round" />
  </g>
  <g id="eyes">
    <circle id="eye-left-bg" cx="85" cy="110" r="10" fill="white" />
    <circle id="eye-right-bg" cx="115" cy="110" r="10" fill="white" />
    <circle id="eye-left" cx="85" cy="110" r="5" fill="black" class="eye-left-auto" />
    <circle id="eye-right" cx="115" cy="110" r="5" fill="black" class="eye-right-auto" />
  </g>
  <path id="mouth" d="M 95,140 C 100,150 105,150 110,140" stroke="black" stroke-width="3" fill="none" stroke-linecap="round" />
</svg>
    `,
  },
  {
    id: 'pet4',
    name: 'Boxy',
    unlockLevel: 10,
    getSvg: (blinkDuration = 3.5) => `
<svg viewBox="0 0 200 200" class="w-full h-full">
  <defs>
    <linearGradient id="bodyGradient4" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <style>
    .eye-left-auto { animation: blink ${blinkDuration}s infinite; }
    .eye-right-auto { animation: blink ${blinkDuration}s infinite 0.15s; }
    @keyframes jump { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-8px) rotate(-5deg); } }
    @keyframes blink { 0%, 92%, 100% { clip-path: inset(0 0 0 0); } 96% { clip-path: inset(0 0 100% 0); } }
  </style>
  <ellipse cx="100" cy="180" rx="60" ry="10" fill="black" opacity="0.1" />
  <g id="body" style="transform-origin: bottom center; animation: jump 2s ease-in-out infinite;">
    <rect x="50" y="50" width="100" height="100" rx="20" fill="url(#bodyGradient4)" />
  </g>
  <g id="eyes">
    <rect id="eye-left" x="75" y="85" width="20" height="30" rx="5" fill="white" class="eye-left-auto" />
    <rect id="eye-right" x="105" y="85" width="20" height="30" rx="5" fill="white" class="eye-right-auto" />
    <circle id="pupil-left" cx="85" cy="100" r="5" fill="black" />
    <circle id="pupil-right" cx="115" cy="100" r="5" fill="black" />
  </g>
  <rect id="mouth" x="90" y="125" width="20" height="5" rx="2" fill="white" />
</svg>
    `,
  },
  {
    id: 'pet5',
    name: 'Cloudy',
    unlockLevel: 15,
    getSvg: (blinkDuration = 6) => `
<svg viewBox="0 0 200 200" class="w-full h-full">
  <defs>
    <radialGradient id="bodyGradient5" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </radialGradient>
  </defs>
  <style>
    .eye-left-auto, .eye-right-auto { animation: blink ${blinkDuration}s infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes blink { 0%, 98%, 100% { opacity: 1; } 99% { opacity: 0; } }
  </style>
  <ellipse cx="100" cy="180" rx="70" ry="10" fill="black" opacity="0.05" style="animation: float 20s ease-in-out infinite;" />
  <g id="body" style="transform-origin: bottom center; animation: float 10s ease-in-out infinite;">
    <path d="M 60,160 C 20,160 20,110 50,90 C 70,70 130,70 150,90 C 180,110 180,160 140,160 Z" fill="url(#bodyGradient5)" />
    <circle cx="60" cy="130" r="30" fill="url(#bodyGradient5)" />
    <circle cx="140" cy="130" r="30" fill="url(#bodyGradient5)" />
  </g>
  <g id="eyes">
    <path id="eye-left" d="M75 105 l 5 5 l 5 -5" stroke-width="3" stroke-linecap="round" stroke="#334155" fill="none" class="eye-left-auto" />
    <path id="eye-right" d="M105 105 l 5 5 l 5 -5" stroke-width="3" stroke-linecap="round" stroke="#334155" fill="none" class="eye-right-auto" />
  </g>
  <path id="mouth" d="M 85,130 Q 100,140 115,130" stroke="#94a3b8" stroke-width="3" fill="none" stroke-linecap="round" />
</svg>
    `,
  },
];

    