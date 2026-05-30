import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe, ExternalLink,
  Layers, Server, Database, Shield, Smartphone, Zap
} from 'lucide-react';
import SEO from '../components/SEO';

/* ─── Developer Info ─────────────────────────────────── */
const GITHUB_USERNAME = 'salahuddingfx';
const AVATAR_URL      = `https://github.com/${GITHUB_USERNAME}.png`;
const PORTFOLIO_URL   = 'https://salahuddin.codes';
const GITHUB_URL      = `https://github.com/${GITHUB_USERNAME}`;
const TWITTER_URL     = `https://x.com/${GITHUB_USERNAME}`;
const LINKEDIN_URL    = `https://linkedin.com/in/${GITHUB_USERNAME}`;
const EMAIL           = 'info.salahuddinkader@gmail.com';

/* ─── Real SVG Tech Icons ────────────────────────────── */
const TechIcons = {
  React: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="11.999" r="2.139" fill="#61DAFB"/>
      <g stroke="#61DAFB" strokeWidth="1.1" fill="none">
        <ellipse rx="7.463" ry="2.863" transform="matrix(.866 .5 -.5 .866 12 12)"/>
        <ellipse rx="7.463" ry="2.863" transform="matrix(.866 -.5 .5 .866 12 12)"/>
        <ellipse cx="12" cy="12" rx="7.463" ry="2.863"/>
      </g>
    </svg>
  ),
  Vite: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M21 3L12.5 19.5L9 12.5L21 3Z" fill="#BD34FE"/>
      <path d="M3 3L9.5 12.5L12 7.5L3 3Z" fill="#FF914D"/>
    </svg>
  ),
  NodeJS: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 1.85c-.27 0-.55.07-.76.22L3.36 6.5A1.52 1.52 0 0 0 2.6 7.8v8.42c0 .52.28 1 .76 1.29l7.88 4.44c.46.26 1.07.26 1.52 0l7.88-4.44c.48-.29.76-.77.76-1.29V7.8a1.5 1.5 0 0 0-.76-1.3L12.76 2.07c-.21-.15-.49-.22-.76-.22Z" fill="#83CD29"/>
      <path d="M12 1.85v20.3l7.88-4.44c.48-.29.76-.77.76-1.29V7.8a1.5 1.5 0 0 0-.76-1.3L12 1.85Z" fill="#67A821"/>
      <path d="M12 7.5v2.5l2.17 1.25v2.5L12 15l-2.17-1.25v-2.5L12 10V7.5l-4.33 2.5v5L12 17.5l4.33-2.5v-5L12 7.5Z" fill="white"/>
    </svg>
  ),
  Express: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M24 18.588a1.5 1.5 0 0 1-1.715 1.48 1.5 1.5 0 0 1-1.285-1.48V9.047l-8.188 11.19a1.5 1.5 0 0 1-2.397 0L2.226 9.047v9.54a1.5 1.5 0 0 1-1.5 1.5A1.5 1.5 0 0 1-.274 18.588V5.412a1.5 1.5 0 0 1 1.5-1.5h.075a1.5 1.5 0 0 1 1.2.6L12 16.463l9.5-11.951a1.5 1.5 0 0 1 1.2-.6H24v14.676Z" fill="#353535"/>
    </svg>
  ),
  MongoDB: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.287-2.056.51-2.87.943-.342 5.077-1.785 5.28-9.275-.073-.4-.167-.789-.287-1.1.116.31.21.699.286 1.1Z" fill="#47A248"/>
      <path d="M12.54 23.594s0-7.627.28-7.627c.202 0 .463 9.834.463 9.834-.143-.02-.28-.204-.743-2.207Z" fill="#47A248"/>
    </svg>
  ),
  SocketIO: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 7.322l-6.71 7.73a.5.5 0 0 1-.86-.29L9.03 9.97l-3.598 6.707a.5.5 0 0 1-.882-.473l4.14-7.714a.5.5 0 0 1 .875.028l.972 4.823 6.138-7.073a.5.5 0 0 1 .893.054z" fill="#25c2a0"/>
    </svg>
  ),
  TailwindCSS: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#38BDF8"/>
    </svg>
  ),
  JWT: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M10.2 0v6.456L12 8.928l1.8-2.472V0zm3.6 0v4.68l3.816-2.256L20.064 0zM3.936 0l2.448 2.424L10.2 4.68V0zM20.064 0l-2.448 5.04 1.488 2.016L24 5.04zM0 5.04l4.896 2.016 1.488-2.016L3.936 0zM13.8 9.552l-1.8 2.04 1.8 2.04 5.46-1.278.816-3.6zm-3.6 0L4.74 8.754l.816 3.6 5.46 1.278zm1.8 4.536l-1.8 2.472v6.456h3.6v-6.456zm0 0" fill="#d63aff"/>
    </svg>
  ),
  Cloudinary: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 0C8.8 0 6 1.8 4.6 4.5 2 4.8 0 7.1 0 10c0 3.3 2.7 6 6 6h12c3.3 0 6-2.7 6-6 0-2.6-1.7-4.9-4.1-5.7C18.8 1.8 15.5 0 12 0zm3.5 11.5l-4 4-1.5-1.5 2.5-2.5H7v-2h5.5L10 7l1.5-1.5z" fill="#3448C5"/>
    </svg>
  ),
  Nodemailer: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#22c55e"/>
    </svg>
  ),
  Zod: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
      <text x="12" y="16" textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="bold">Z</text>
    </svg>
  ),
  Recharts: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="14" width="4" height="8" rx="1" fill="#8B5CF6"/>
      <rect x="8" y="8" width="4" height="14" rx="1" fill="#A78BFA"/>
      <rect x="14" y="4" width="4" height="18" rx="1" fill="#7C3AED"/>
      <rect x="20" y="10" width="2" height="12" rx="1" fill="#C4B5FD"/>
    </svg>
  ),
  i18next: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="#26c2e3"/>
    </svg>
  ),
  Swiper: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="10" fill="#0080ff" opacity=".15"/>
      <path d="M7 12l5-5 5 5M7 12l5 5 5-5" stroke="#0080ff" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  Helmet: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#EF4444"/>
    </svg>
  ),
  Multer: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-7-6l-3 3h2v3h2v-3h2l-3-3z" fill="#F97316"/>
    </svg>
  ),
  Bcrypt: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#F59E0B"/>
    </svg>
  ),
  Dotenv: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="4" cy="12" r="2.5" fill="#ECD53F"/>
      <circle cx="12" cy="12" r="2.5" fill="#ECD53F"/>
      <circle cx="20" cy="12" r="2.5" fill="#ECD53F"/>
    </svg>
  ),
  Lucide: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#f97316" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  CORS: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="1.5" fill="none"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#6366F1" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Python: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.959 3.403 5.959h2.03v-2.867s-.109-3.402 3.345-3.402h5.766s3.236.052 3.236-3.128V3.128S18.28 0 11.914 0zm-3.2 1.809a1.044 1.044 0 1 1 0 2.088 1.044 1.044 0 0 1 0-2.088z" fill="#387EB8"/>
      <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.959-3.403-5.959h-2.03v2.867s.109 3.402-3.345 3.402H9.456s-3.236-.052-3.236 3.128v5.403S5.72 24 12.086 24zm3.2-1.809a1.044 1.044 0 1 1 0-2.088 1.044 1.044 0 0 1 0 2.088z" fill="#FFE052"/>
    </svg>
  ),
  Django: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 0 0-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102zM21.314 6.06v11.49c0 3.97-.293 5.88-1.147 7.53-.802 1.6-1.86 2.61-4.036 3.72l-3.644-1.73c2.176-1.02 3.234-1.942 3.92-3.34.713-1.422.942-3.056.942-7.35V6.06z" fill="#092E20"/>
    </svg>
  ),
  MySQL: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.15zM5.77 18.695h-.927a50.854 50.854 0 0 0-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 0 0-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135c-.652 0-1.235-.177-1.75-.532l.228-.414c.A44.714 0 0 0 18.485 18c.503.005.9-.075 1.19-.24.342-.195.513-.465.513-.81 0-.248-.08-.455-.24-.623-.16-.168-.508-.346-1.044-.534-.728-.253-1.232-.507-1.512-.764-.28-.257-.42-.583-.42-.98 0-.45.176-.82.528-1.113.353-.293.8-.44 1.342-.44.552 0 1.055.14 1.508.42l-.2.477c-.43-.268-.878-.402-1.346-.402-.397 0-.71.086-.942.26-.233.172-.35.4-.35.682 0 .15.032.28.097.396.065.115.18.22.343.314.163.094.457.208.88.34.5.162.867.324 1.1.485.23.162.4.345.508.55.108.205.163.446.163.72 0 .513-.194.924-.58 1.232-.387.308-.9.462-1.54.462zm-3.13-.135h-.862v-2.52c0-.66-.233-.99-.7-.99-.463 0-.694.33-.694.99v2.52h-.862v-2.52c0-.66-.232-.99-.698-.99-.463 0-.695.33-.695.99v2.52h-.862v-5.53h.735v.527c.245-.395.59-.593 1.038-.593.486 0 .83.215 1.03.645.258-.43.625-.645 1.1-.645.383 0 .687.13.914.39.227.26.34.625.34 1.093v4.113z" fill="#00758F"/>
    </svg>
  ),
  PHP: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <ellipse cx="12" cy="12" rx="12" ry="6.75" fill="#8993be" opacity=".3"/>
      <ellipse cx="12" cy="12" rx="12" ry="6.75" fill="none" stroke="#8993be" strokeWidth=".8"/>
      <path d="M5.91 9.5h1.39l-.27 1.38h1.1c.7 0 1.17.14 1.44.42.27.28.33.7.19 1.28l-.42 2.12H7.95l.4-2.01c.07-.34.05-.58-.06-.7-.11-.13-.33-.19-.65-.19H6.6l-.52 2.9H4.74zm7.2 0h2.73c.78 0 1.33.2 1.64.6.31.4.38.95.2 1.65-.18.72-.53 1.27-1.04 1.66-.51.38-1.14.57-1.88.57h-1.1l-.3 1.52h-1.33zm.93 1.16l-.43 2.2h.87c.37 0 .67-.1.9-.3.23-.2.4-.52.49-.96.08-.4.05-.7-.09-.89-.14-.18-.41-.27-.8-.27z" fill="#8993be"/>
    </svg>
  ),
  Laravel: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027.298.298 0 0 1-.042.013.38.38 0 0 1-.183 0 .31.31 0 0 1-.064-.015c-.022-.008-.043-.017-.063-.028L.493 18.755a.376.376 0 0 1-.189-.326V3.376c0-.035.005-.07.014-.104a.378.378 0 0 1 .028-.084c.012-.025.026-.05.044-.072a.327.327 0 0 1 .054-.059.38.38 0 0 1 .067-.047c.023-.012.046-.022.07-.03L5.43.079a.378.378 0 0 1 .378 0l4.95 2.855A.378.378 0 0 1 10.946 3.376v9.563l3.76-2.174V5.43c0-.035.005-.07.014-.104a.378.378 0 0 1 .028-.084.513.513 0 0 1 .044-.072.327.327 0 0 1 .054-.059.38.38 0 0 1 .067-.047c.023-.012.046-.022.07-.03L19.27.079a.378.378 0 0 1 .378 0l3.946 2.279.039.025c.02.014.038.03.055.047a.37.37 0 0 1 .093.16c.007.026.012.052.014.079l-.153.002z" fill="#FF2D20"/>
    </svg>
  ),
  GraphQL: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 0l10.392 6v12L12 24 1.608 18V6zm0 2.17L3.393 7.085v9.83L12 21.83l8.607-4.915v-9.83zm0 2.31l6.928 4v8L12 20.52l-6.928-3.04v-8zM7.5 7.794l4.5 2.598 4.5-2.598L12 5.196zm-1 1.732v5.196l4.5 2.598V12zm10 0l-4.5 2.598v5.196l4.5-2.598z" fill="#E10098"/>
    </svg>
  ),
};

/* ─── Skill data with real icons ─────────────────────── */
const skills = [
  { label: 'React 18 / Vite 5',    level: 95, color: '#61DAFB', Icon: TechIcons.React },
  { label: 'Node.js / Express',    level: 92, color: '#68A063', Icon: TechIcons.NodeJS },
  { label: 'MongoDB / Mongoose',   level: 88, color: '#47A248', Icon: TechIcons.MongoDB },
  { label: 'Socket.io',            level: 85, color: '#25c2a0', Icon: TechIcons.SocketIO },
  { label: 'Tailwind CSS',         level: 96, color: '#38BDF8', Icon: TechIcons.TailwindCSS },
  { label: 'REST API / GraphQL',   level: 90, color: '#E10098', Icon: TechIcons.GraphQL },
  { label: 'Python / Django',      level: 78, color: '#FFE052', Icon: TechIcons.Python },
  { label: 'PHP / Laravel',        level: 75, color: '#FF2D20', Icon: TechIcons.Laravel },
  { label: 'MySQL',                level: 80, color: '#00758F', Icon: TechIcons.MySQL },
];

/* ─── Animated progress bar item ────────────────────── */
const SkillBar = ({ skill, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const [count, setCount] = useState(0);
  const barRef = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    const node = barRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observed.current) {
          observed.current = true;
          const duration = 1200;
          const startTime = performance.now();
          const tick = (now) => {
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setWidth(Math.floor(eased * skill.level));
            setCount(Math.floor(eased * skill.level));
            if (p < 1) requestAnimationFrame(tick);
            else { setWidth(skill.level); setCount(skill.level); }
          };
          setTimeout(() => requestAnimationFrame(tick), delay);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [skill.level, delay]);

  return (
    <div ref={barRef}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 shrink-0">
            <skill.Icon />
          </div>
          <span className="text-sm font-semibold text-gray-700">{skill.label}</span>
        </div>
        <span
          className="text-xs font-bold tabular-nums transition-all"
          style={{ color: skill.color }}
        >
          {count}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})`,
            boxShadow: `0 0 8px ${skill.color}55`,
          }}
        />
      </div>
    </div>
  );
};

/* ─── Tech badge grid ────────────────────────────────── */
const techStack = [
  { label: 'React 18',    Icon: TechIcons.React },
  { label: 'Vite 5',     Icon: TechIcons.Vite },
  { label: 'Node.js',    Icon: TechIcons.NodeJS },
  { label: 'Express.js', Icon: TechIcons.Express },
  { label: 'MongoDB',    Icon: TechIcons.MongoDB },
  { label: 'Socket.io',  Icon: TechIcons.SocketIO },
  { label: 'Tailwind',   Icon: TechIcons.TailwindCSS },
  { label: 'JWT Auth',   Icon: TechIcons.JWT },
  { label: 'Cloudinary', Icon: TechIcons.Cloudinary },
  { label: 'Nodemailer', Icon: TechIcons.Nodemailer },
  { label: 'Zod',        Icon: TechIcons.Zod },
  { label: 'Recharts',   Icon: TechIcons.Recharts },
  { label: 'i18next',    Icon: TechIcons.i18next },
  { label: 'Swiper.js',  Icon: TechIcons.Swiper },
  { label: 'Helmet.js',  Icon: TechIcons.Helmet },
  { label: 'Multer',     Icon: TechIcons.Multer },
  { label: 'bcryptjs',   Icon: TechIcons.Bcrypt },
  { label: 'dotenv',     Icon: TechIcons.Dotenv },
  { label: 'Lucide',     Icon: TechIcons.Lucide },
  { label: 'CORS',       Icon: TechIcons.CORS },
];

/* ─── Contribution cards ─────────────────────────────── */
const contributions = [
  {
    icon: <Layers size={20} />,
    title: 'Platform Architecture', titleBn: 'প্ল্যাটফর্ম আর্কিটেকচার',
    desc: 'Secured MERN stack with role-based auth, JWT rotation, Socket.io real-time pipelines & Cloudinary CDN.',
    descBn: 'রোল-ভিত্তিক অথ, JWT রোটেশন, Socket.io পাইপলাইন ও Cloudinary CDN সহ সুরক্ষিত MERN স্ট্যাক।',
    color: '#003B73', bg: 'rgba(0,59,115,0.08)',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11h2v6h-2zm0 8h2v2h-2z"/></svg>,
    title: 'UI / UX Design', titleBn: 'ইউআই / ইউএক্স ডিজাইন',
    desc: 'Glassmorphism, wave animations, dark mode, bilingual BN/EN layout & premium micro-interaction system.',
    descBn: 'গ্লাসমরফিজম, ওয়েভ অ্যানিমেশন, ডার্ক মোড, দ্বিভাষিক BN/EN লেআউট ও মাইক্রো-ইন্টারঅ্যাকশন।',
    color: '#F9A826', bg: 'rgba(249,168,38,0.08)',
  },
  {
    icon: <Database size={20} />,
    title: 'Database & API', titleBn: 'ডেটাবেজ ও API',
    desc: 'Mongoose schema, aggregation pipelines, Zod validation, audit logging & multi-role admin REST API.',
    descBn: 'Mongoose স্কিমা, অ্যাগ্রিগেশন পাইপলাইন, Zod ভ্যালিডেশন, অডিট লগ ও মাল্টি-রোল REST API।',
    color: '#47A248', bg: 'rgba(71,162,72,0.08)',
  },
  {
    icon: <Shield size={20} />,
    title: 'Security & Auth', titleBn: 'নিরাপত্তা ও অথ',
    desc: 'Helmet HTTP headers, bcrypt hashing, HttpOnly JWT cookies, rate-limiting, CORS whitelist & RBAC.',
    descBn: 'Helmet হেডার, bcrypt হ্যাশিং, HttpOnly JWT, রেট-লিমিটিং, CORS হোয়াইটলিস্ট ও RBAC।',
    color: '#EF4444', bg: 'rgba(239,68,68,0.08)',
  },
  {
    icon: <Smartphone size={20} />,
    title: 'Bilingual System', titleBn: 'দ্বিভাষিক সিস্টেম',
    desc: 'Full Bengali + English i18next integration with persistent language switching & Hind Siliguri fonts.',
    descBn: 'স্থায়ী ভাষা পরিবর্তন ও Hind Siliguri ফন্ট সহ সম্পূর্ণ বাংলা + ইংরেজি i18next ইন্টিগ্রেশন।',
    color: '#10B981', bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: <Zap size={20} />,
    title: 'Real-time Features', titleBn: 'রিয়েল-টাইম ফিচার',
    desc: 'Socket.io live notice broadcast, admin room events, real-time counters & registration push notifications.',
    descBn: 'Socket.io লাইভ নোটিশ, অ্যাডমিন রুম ইভেন্ট, রিয়েল-টাইম কাউন্টার ও রেজিস্ট্রেশন পুশ নোটিফিকেশন।',
    color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',
  },
];

/* ─── Social links ───────────────────────────────────── */
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const socialLinks = [
  { Icon: Globe,        label: 'Portfolio',   href: PORTFOLIO_URL,          display: 'salahuddin.codes',                  hoverCls: 'hover:bg-primary hover:text-white hover:border-primary' },
  { Icon: GithubIcon,   label: 'GitHub',      href: GITHUB_URL,             display: `@${GITHUB_USERNAME}`,               hoverCls: 'hover:bg-gray-900 hover:text-white hover:border-gray-900' },
  { Icon: TwitterIcon,  label: 'X / Twitter', href: TWITTER_URL,            display: `@${GITHUB_USERNAME}`,               hoverCls: 'hover:bg-black hover:text-white hover:border-black' },
  { Icon: LinkedinIcon, label: 'LinkedIn',    href: LINKEDIN_URL,           display: `@${GITHUB_USERNAME}`,               hoverCls: 'hover:bg-blue-600 hover:text-white hover:border-blue-600' },
  { Icon: MailIcon,     label: 'Email',       href: `mailto:${EMAIL}`,      display: EMAIL,                               hoverCls: 'hover:bg-secondary hover:text-primary hover:border-secondary' },
];

/* ══════════════════════════════════════════════════════════ */
const Developer = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <SEO
        title="Developer — Practon Alumni"
        description="Meet Salah Uddin Kader (@salahuddingfx), the full-stack developer behind the Practon Alumni Association platform."
      />

      <div className="min-h-screen py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* ══ Hero Profile Card ══ */}
          <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">

            {/* Gradient banner */}
            <div className="h-48 w-full relative" style={{ background: 'linear-gradient(135deg,#003B73 0%,#0a5fa8 55%,#1a7fd4 100%)' }}>
              <div className="absolute top-4 right-8 w-28 h-28 rounded-full bg-white/5 border border-white/10" />
              <div className="absolute top-12 right-24 w-14 h-14 rounded-full bg-white/5 border border-white/10" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl" />

              {/* Available badge */}
              <span className="absolute top-5 left-6 flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Available for Projects
              </span>

              {/* GitHub stats badge */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="absolute top-5 right-6 flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/20 transition"
              >
                <GithubIcon />
                @{GITHUB_USERNAME}
              </a>
            </div>

            <div className="px-6 sm:px-10 pb-10 -mt-16 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-6">

                {/* Avatar */}
                <div className="shrink-0 relative">
                  <img
                    src={imgError ? `https://ui-avatars.com/api/?name=Salah+Uddin&background=003B73&color=fff&size=160` : AVATAR_URL}
                    alt="Salah Uddin Kader"
                    onError={() => setImgError(true)}
                    className="w-36 h-36 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-secondary/30"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-secondary text-primary text-[10px] font-extrabold px-2 py-1 rounded-lg shadow-lg uppercase tracking-wide">
                    Dev
                  </span>
                </div>

                {/* Bio */}
                <div className="flex-grow space-y-2 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-secondary/15 text-secondary text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">Lead Developer</span>
                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">MERN Stack</span>
                    <span className="bg-green-50 text-green-600 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Open Source</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight leading-tight font-bn">
                    Salah Uddin Kader
                  </h1>
                  <p className="text-gray-500 text-sm font-semibold">
                    Software Architect · MERN Stack · UI/UX Engineer
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xl font-bn pt-1">
                    {isBn
                      ? 'সালাহ উদ্দিন কাদের একজন দক্ষ ফুল-স্ট্যাক ওয়েব ডেভেলপার যিনি প্রাক্তন শিক্ষার্থী পরিষদ ডিজিটাল প্ল্যাটফর্মের সম্পূর্ণ আর্কিটেকচার, ডিজাইন এবং ডেভেলপমেন্ট পরিচালনা করেছেন।'
                      : 'Sole architect & developer of the Practon Alumni Association platform — from the Socket.io real-time backend to the bilingual Bengali/English UI design system.'}
                  </p>
                </div>

                {/* Portfolio CTA */}
                <div className="shrink-0 pb-1 flex flex-col gap-2">
                  <a
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl transition-all text-sm"
                  >
                    <Globe size={15} />
                    View Portfolio
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-5 py-2.5 rounded-xl shadow hover:bg-gray-800 transition-all text-sm"
                  >
                    <GithubIcon />
                    GitHub Profile
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-8 border-t border-gray-100" />

              {/* Social links */}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.label !== 'Email' ? '_blank' : '_self'}
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${s.hoverCls}`}
                  >
                    <s.Icon />
                    <span>{s.display}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ══ Skill Bars with real icons + scroll animation ══ */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <TechIcons.React />
              </div>
              <h2 className="text-xl font-extrabold text-primary">
                {isBn ? 'প্রযুক্তিগত দক্ষতা' : 'Technical Skills'}
              </h2>
            </div>

            <div className="space-y-5">
              {skills.map((skill, i) => (
                <SkillBar key={skill.label} skill={skill} delay={i * 80} />
              ))}
            </div>
          </div>

          {/* ══ Contribution Cards ══ */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                <Server size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-primary">
                {isBn ? 'অবদান ও দায়িত্বসমূহ' : 'Contributions & Responsibilities'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {contributions.map((c) => (
                <div
                  key={c.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-3"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
                    style={{ background: c.bg, color: c.color }}
                  >
                    {c.icon}
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-base">
                    {isBn ? c.titleBn : c.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-bn">
                    {isBn ? c.descBn : c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Tech Stack with real icons ══ */}
          <div className="bg-gradient-to-br from-primary to-[#0a5fa8] rounded-3xl p-8 shadow-xl">
            <h2 className="text-white font-extrabold text-xl mb-6">
              {isBn ? '⚙️ টেকনোলজি স্ট্যাক' : '⚙️ Technology Stack'}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {techStack.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 bg-white/10 border border-white/15 rounded-xl p-3 hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-default group"
                >
                  <div className="w-8 h-8">
                    <Icon />
                  </div>
                  <span className="text-white text-[10px] font-bold text-center leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Footer CTA ══ */}
          <div className="text-center py-6 space-y-4">
            <p className="text-gray-500 text-sm font-bn">
              {isBn
                ? 'এই প্ল্যাটফর্মটি সম্পূর্ণ ভালোবাসা দিয়ে তৈরি করা হয়েছে।'
                : 'This platform was built with passion for the alumni community.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition shadow-lg text-sm">
                <Globe size={15} /> salahuddin.codes
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-lg text-sm">
                <GithubIcon /> GitHub
              </a>
              <a href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition shadow-lg text-sm">
                <MailIcon /> {isBn ? 'ইমেইল করুন' : 'Send Email'}
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Developer;
