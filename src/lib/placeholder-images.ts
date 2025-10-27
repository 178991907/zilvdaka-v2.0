
export type AvatarInfo = {
  id: string;
  name: string;
  svg: string;
};

export const Avatars: AvatarInfo[] = [
  {
    id: 'avatar1',
    name: 'Rocket',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rocket-grad" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#FF6B6B" /><stop offset="100%" stop-color="#FF8E8E" /></linearGradient><linearGradient id="window-grad" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#A2D2FF" /><stop offset="100%" stop-color="#BDE0FE" /></linearGradient></defs><path fill="#4A4A4A" d="M78 111.5c0 4.1-6.3 7.5-14 7.5s-14-3.4-14-7.5c0-4.1 6.3-9.5 14-9.5s14 5.4 14 9.5z" /><path fill="#FFD166" d="M64 122c-12.7 0-23-4-23-9s10.3-9 23-9 23 4 23 9-10.3 9-23 9z" /><path fill="#E0E0E0" d="M96 90c-17.7 0-32-14.3-32-32V30h64v28c0 17.7-14.3 32-32 32z" /><path fill="#F5F5F5" d="M91 85c-14.9 0-27-12.1-27-27V35h54v23c0 14.9-12.1 27-27 27z" /><path fill="url(#rocket-grad)" d="M78 35H50l-8-14h44l-8 14z" /><path fill="#4A4A4A" d="M64 9c0 5-6.3 9-14 9s-14-4-14-9c0-5 6.3-9 14-9s14 4 14 9z" /><path fill="url(#window-grad)" d="M64 58c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z" /><path fill="#FFFFFF" d="M64 45c-7.2 0-13-5.8-13-13s5.8-13 13-13 13 5.8 13 13-5.8 13-13 13z" opacity="0.3" /></svg>`
  },
  {
    id: 'avatar2',
    name: 'Car',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="car-grad" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#4ECDC4" /><stop offset="100%" stop-color="#58D6C9" /></linearGradient></defs><path fill="#333" d="M110.5 108a12 12 0 1 1-24 0 12 12 0 0 1 24 0zM41.5 108a12 12 0 1 1-24 0 12 12 0 0 1 24 0z" /><path fill="url(#car-grad)" d="M118 70v20H10v-20c0-11 9-20 20-20h68c11 0 20 9 20 20z" /><path fill="#FFF" d="M88 50H40c-2.2 0-4 1.8-4 4v16h56V54c0-2.2-1.8-4-4-4z" opacity="0.8" /><ellipse fill="#FFD166" cx="22" cy="70" rx="6" ry="6" /><ellipse fill="#FFD166" cx="106" cy="70" rx="6" ry="6" /></svg>`
  },
  {
    id: 'avatar3',
    name: 'Plane',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="plane-grad" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#A2D2FF" /><stop offset="100%" stop-color="#BDE0FE" /></linearGradient></defs><path fill="#FF6B6B" d="M118 64L32 12 10 32l88 52z" /><path fill="url(#plane-grad)" d="M108 54L22 2 2 22l86 52z" /><path fill="#F5F5F5" d="M98 74a60.1 60.1 0 0 1-34-10L2 22 22 2l42 42c15.2-3.1 31.1 2.6 42 14 13.6 14.1 14.7 35.6 2 50-12.2 13.9-32.3 17.5-48 8z" /><circle fill="#333" cx="64" cy="64" r="8" /></svg>`
  },
  {
    id: 'avatar4',
    name: 'Planet',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="planet-grad" cx="0.3" cy="0.3" r="0.7"><stop offset="0%" stop-color="#FFD166" /><stop offset="100%" stop-color="#F9A825" /></radialGradient></defs><circle fill="url(#planet-grad)" cx="64" cy="64" r="54" /><ellipse transform="rotate(-30 64 64)" cx="64" cy="64" rx="70" ry="20" stroke="#FF6B6B" stroke-width="8" fill="none" /></svg>`
  },
  {
    id: 'avatar5',
    name: 'Mario Mushroom',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mush-top" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#ff4d4d"/><stop offset="100%" stop-color="#ff1a1a"/></linearGradient><linearGradient id="mush-stem" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#fff0e6"/><stop offset="100%" stop-color="#ffe0cc"/></linearGradient></defs><path fill="url(#mush-top)" d="M112 64c0-26.5-21.5-48-48-48S16 37.5 16 64h96z"/><circle fill="#FFF" cx="40" cy="48" r="10"/><circle fill="#FFF" cx="88" cy="48" r="10"/><circle fill="#FFF" cx="64" cy="28" r="8"/><path fill="url(#mush-stem)" d="M88 64H40v48h48V64z"/><circle fill="#000" cx="52" cy="80" r="6"/><circle fill="#000" cx="76" cy="80" r="6"/></svg>`
  },
  {
    id: 'avatar6',
    name: 'Minecraft Block',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path fill="#A0744D" d="M16 36l48-24 48 24-48 24-48-24z"/><path fill="#7A5A3D" d="M64 12v96l48-24V36L64 12z"/><path fill="#C49A6C" d="M16 36v72l48 24V12L16 36z"/></svg>`
  },
  {
    id: 'avatar7',
    name: 'Astronaut',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="helmet-grad" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#E0E0E0" /><stop offset="100%" stop-color="#BDBDBD" /></linearGradient></defs><circle fill="url(#helmet-grad)" cx="64" cy="64" r="50" /><rect x="24" y="94" width="80" height="20" rx="10" fill="#42A5F5" /><circle fill="#1E88E5" cx="64" cy="64" r="38" /><path fill="#0D47A1" d="M88 50c0 13.3-10.7 24-24 24s-24-10.7-24-24 10.7-24 24-24 24 10.7 24 24z" /><circle fill="#FFF" cx="54" cy="50" r="5" /></svg>`
  },
  {
    id: 'avatar8',
    name: 'Friendly Monster',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="monster-grad" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#80E2FF" /><stop offset="100%" stop-color="#55C0E0" /></radialGradient></defs><circle cx="64" cy="64" r="54" fill="url(#monster-grad)" /><circle cx="64" cy="54" r="24" fill="#fff" /><circle cx="64" cy="54" r="12" fill="#333" /><path d="M44,84 C54,100 74,100 84,84" fill="none" stroke="#333" stroke-width="6" stroke-linecap="round" /></svg>`
  },
  {
    id: 'avatar9',
    name: 'Dinosaur',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dino-grad" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#9AEEA2"/><stop offset="100%" stop-color="#65D46E"/></linearGradient></defs><path fill="url(#dino-grad)" d="M102,52c-4,0-6,4-12,6-10,3-18-3-24-10-6-7-10-15-18-16-8-1-14,5-20,10-10,8-22,8-30,0-2-2-2-5-1-7,4-8,14-12,22-10,10,2,18,12,28,14,10,2,20-4,28-12,8-8,14-19,26-20,12-1,22,8,22,20,0,12-10,22-22,23-11,1-19-6-27-12-3-2-6-4-8-4z" transform="translate(0, 10)"/><path fill="#43A047" d="M30 98c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-7.5 5.2-13.8 12-15.5V40h8v42.5c6.8 1.7 12 8 12 15.5z"/><path fill="#43A047" d="M114 98c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-7.5 5.2-13.8 12-15.5V60h8v22.5c6.8 1.7 12 8 12 15.5z"/><circle fill="#FFF" cx="88" cy="50" r="10"/><circle fill="#000" cx="88" cy="50" r="5"/></svg>`
  },
  {
    id: 'avatar10',
    name: 'Unicorn',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="uni-mane" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#ffafcc"/><stop offset="50%" stop-color="#bde0fe"/><stop offset="100%" stop-color="#a2d2ff"/></linearGradient><linearGradient id="uni-horn" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#FFD166"/><stop offset="100%" stop-color="#F9A825"/></linearGradient></defs><path fill="url(#uni-mane)" d="M84,18c-6-6-14-9-22-9-10,0-20,6-26,16-4,7-5,16-2,24,10,24,32,42,60,44,8,0,14-8,12-16-2-8-10-14-18-18C80,50,88,30,84,18z"/><path fill="#F5F5F5" d="M88,112c-4,0-8-1-11-3-16-12-22-32-20-50,1-10,10-18,20-18,12,0,20,12,20,26,0,18-6,34-18,44-3,2-6,3-9,3z"/><path fill="url(#uni-horn)" d="M92,36 L84,12 L76,36z"/><circle fill="#000" cx="100" cy="70" r="6"/></svg>`
  },
  {
    id: 'avatar11',
    name: 'Teddy Bear',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="bear-grad" cx=".5" cy=".5" r=".5"><stop offset="0%" stop-color="#D4A373"/><stop offset="100%" stop-color="#A97C50"/></radialGradient><radialGradient id="bear-ear" cx=".5" cy=".5" r=".5"><stop offset="0%" stop-color="#EFE2D3"/><stop offset="100%" stop-color="#D4A373"/></radialGradient></defs><circle fill="url(#bear-grad)" cx="64" cy="64" r="54"/><circle fill="url(#bear-ear)" cx="32" cy="32" r="20"/><circle fill="url(#bear-ear)" cx="96" cy="32" r="20"/><circle fill="#FFF" cx="50" cy="60" r="8"/><circle fill="#FFF" cx="78" cy="60" r="8"/><circle fill="#000" cx="50" cy="60" r="4"/><circle fill="#000" cx="78" cy="60" r="4"/><path d="M54,80 a10,8 0 0,0 20,0" fill="#333"/><path d="M64,82 a6,6 0 0,1 0,12 a6,6 0 0,1 0,-12" fill="#000"/></svg>`
  },
  {
    id: 'avatar12',
    name: 'Game Controller',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path d="M108,40H20C13.4,40,8,45.4,8,52v40c0,6.6,5.4,12,12,12h88c6.6,0,12-5.4,12-12V52C120,45.4,114.6,40,108,40z" fill="#4A4A4A"/><rect x="28" y="60" width="24" height="8" fill="#FF6B6B"/><rect x="36" y="52" width="8" height="24" fill="#FF6B6B"/><circle cx="80" cy="72" r="8" fill="#4ECDC4"/><circle cx="96" cy="56" r="8" fill="#FFD166"/></svg>`
  },
  {
    id: 'avatar13',
    name: 'Magic Hat',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path d="M112,98H16c-4.4,0-8-3.6-8-8v0c0-4.4,3.6-8,8-8h96c4.4,0,8,3.6,8,8v0C120,94.4,116.4,98,112,98z" fill="#3D3D3D"/><path d="M96,82H32c-4.4,0-8-3.6-8-8V32c0-8.8,7.2-16,16-16h48c8.8,0,16,7.2,16,16v42C104,78.4,100.4,82,96,82z" fill="#5E5E5E"/><rect x="24" y="60" width="80" height="12" fill="#FF6B6B"/><path fill="#FFD166" d="M64 48l-6 12h12z"/><path fill="#FFD166" d="M52 38l-6 12h12z"/><path fill="#FFD166" d="M76 38l-6 12h12z"/></svg>`
  },
  {
    id: 'avatar14',
    name: 'Pirate Ship',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path d="M118,100c-10,12-30,16-54,16s-44-4-54-16c-6-7.2,4.2-16.8,12-12c8,5,22,8,42,8s34-3,42-8C113.8,83.2,124,92.8,118,100z" fill="#A97C50"/><path d="M24,90V40c0-13.2,10.8-24,24-24h32c13.2,0,24,10.8,24,24v50" fill="#D4A373"/><rect x="60" y="10" width="8" height="60" fill="#8C5B38"/><path d="M68,20v20h30c-10-6.7-20-13.3-30-20z" fill="#FFF"/><circle cx="88" cy="30" r="4" fill="#000"/></svg>`
  },
  {
    id: 'avatar15',
    name: 'Castle',
    svg: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="50" width="96" height="62" fill="#C5C5C5"/><rect x="24" y="58" width="80" height="54" fill="#E0E0E0"/><path d="M40,50V30l12-14l12,14V50H40z" fill="#FF6B6B"/><path d="M76,50V30l12-14l12,14V50H76z" fill="#4ECDC4"/><rect x="56" y="80" width="16" height="32" fill="#A97C50"/><rect x="32" y="12" width="8" height="8" fill="#FFD166"/><rect x="88" y="12" width="8" height="8" fill="#FFD166"/></svg>`
  }
];
