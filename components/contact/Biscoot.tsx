import styles from "./Biscoot.module.css";

const STRIPE = "#D98A24";
const CREAM = "#FBEBD5";
const MUZZLE = "#FFF5E4";

/** Biscoot, a golden ginger cat, napping on a cushion. Hand-drawn SVG with a CSS idle loop. */
export function Biscoot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 190" className={className} role="img" aria-label="Biscoot, a golden ginger cat with yellow eyes and a blue collar, napping on a cushion">
      <defs>
        <linearGradient id="biscoot-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC24D" />
          <stop offset=".6" stopColor="#F4AA35" />
          <stop offset="1" stopColor="#E4952A" />
        </linearGradient>
        <radialGradient id="biscoot-glow" cx=".4" cy=".2" r=".6">
          <stop offset="0" stopColor="#FFE9AE" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFE9AE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* cushion */}
      <ellipse cx="160" cy="175" rx="134" ry="13" fill="#3A2721" />
      <ellipse cx="160" cy="169" rx="128" ry="12" fill="#4A3129" />

      <g className={styles.breathe}>
        <path d="M100 108 C 126 88, 170 80, 208 86 C 248 92, 278 110, 276 136 C 274 157, 252 166, 224 166 L 128 166 C 108 166, 96 156, 98 140 Z" fill="url(#biscoot-fur)" />
        <path className={styles.sheen} d="M100 108 C 126 88, 170 80, 208 86 C 248 92, 278 110, 276 136 C 274 157, 252 166, 224 166 L 128 166 C 108 166, 96 156, 98 140 Z" fill="url(#biscoot-glow)" />
        <path d="M140 92 C 142 100, 142 108, 138 116 M162 87 C 165 96, 165 106, 161 115 M184 86 C 188 95, 188 105, 184 114 M206 88 C 211 97, 211 107, 207 115" stroke={STRIPE} strokeWidth="3.2" strokeLinecap="round" fill="none" opacity=".55" />
        <path d="M216 104 C 246 106, 264 124, 258 146 C 254 158, 240 164, 222 164" stroke={STRIPE} strokeWidth="2" fill="none" opacity=".5" />
        <path d="M232 116 C 240 120, 246 128, 247 136 M226 128 C 234 131, 238 138, 238 145" stroke={STRIPE} strokeWidth="2.8" strokeLinecap="round" fill="none" opacity=".5" />
        <path d="M104 140 C 110 156, 124 164, 140 165 L 128 166 C 112 166, 100 158, 100 146 Z" fill={CREAM} />
        <ellipse cx="250" cy="163" rx="14" ry="5.5" fill={CREAM} />
      </g>

      <g className={styles.tail}>
        <path d="M272 134 C 290 174, 224 183, 170 181 C 148 180, 134 176, 132 168 C 150 171, 204 171, 238 165 C 258 160, 266 150, 262 136 Z" fill="#F2A733" />
        <path d="M184 171 l0 9 M206 170.5 l1 9.5 M228 168 l2 10 M250 162 l4 10 M266 150 l7 5" stroke={STRIPE} strokeWidth="3.5" strokeLinecap="round" opacity=".55" />
        <path d="M156 180 C 144 179, 134 175.5, 132 168 C 140 170, 148 170.6, 156 170.8 Z" fill="#FFE3A8" />
      </g>

      {/* front paws */}
      <ellipse cx="112" cy="163" rx="13" ry="5.5" fill={CREAM} />
      <ellipse cx="132" cy="164.5" rx="12" ry="5" fill={CREAM} />

      <g className={styles.head}>
        <path className={styles.ear} d="M58 106 C 53 88, 53 70, 59 56 C 70 64, 80 76, 85 88 Z" fill="#F4AA35" />
        <path d="M63 98 C 60 85, 61 74, 64 66 C 70 72, 75 79, 79 88 Z" fill="#FBE3C4" />
        <path d="M65 94 C 64 86, 64 79, 66 73 C 69 78, 72 83, 74 88 Z" fill="#F2B9A4" opacity=".7" />
        <path d="M95 88 C 100 76, 110 64, 121 56 C 127 70, 127 88, 122 106 Z" fill="#F4AA35" />
        <path d="M101 88 C 105 80, 111 72, 117 66 C 120 74, 120 85, 117 98 Z" fill="#FBE3C4" />
        <path d="M106 88 C 109 83, 112 78, 115 74 C 116 80, 116 86, 114 92 Z" fill="#F2B9A4" opacity=".7" />
        <path d="M56 112 C 56 96, 70 86, 90 86 C 110 86, 124 96, 124 112 C 124 124, 116 134, 106 142 C 100 147, 95 150, 90 150 C 85 150, 80 147, 74 142 C 64 134, 56 124, 56 112 Z" fill="url(#biscoot-fur)" />
        <path className={styles.sheen} d="M56 112 C 56 96, 70 86, 90 86 C 110 86, 124 96, 124 112 C 124 124, 116 134, 106 142 C 100 147, 95 150, 90 150 C 85 150, 80 147, 74 142 C 64 134, 56 124, 56 112 Z" fill="url(#biscoot-glow)" />
        <ellipse cx="77" cy="108" rx="7" ry="4" fill="#FFE8BE" opacity=".6" />
        <ellipse cx="103" cy="108" rx="7" ry="4" fill="#FFE8BE" opacity=".6" />
        <path d="M90 87 L90 112 M84 88 L85.5 103 M96 88 L94.5 103 M79 90 L81 99 M101 90 L99 99" stroke={STRIPE} strokeWidth="2" strokeLinecap="round" opacity=".8" />
        <path d="M61 121 q-4 3 -4 8 M119 121 q4 3 4 8 M63 126 q-3 3 -3 7 M117 126 q3 3 3 7" stroke={STRIPE} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6" />

        {/* eyes: left stays shut, right occasionally peeks */}
        <path d="M65 116 q8 6.5 16 0" stroke="#6B3A1C" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path className={styles.lid} d="M99 116 q8 6.5 16 0" stroke="#6B3A1C" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <g className={styles.peek}>
          <circle cx="107" cy="116.5" r="7" fill="#F2C230" stroke="#7A4A1C" strokeWidth="1.3" />
          <ellipse cx="107" cy="117" rx="2.3" ry="5.2" fill="#1E140D" />
          <circle cx="109.3" cy="114" r="1.3" fill="#FFFFFF" />
          <path d="M99 115 Q107 106.5 115 115 Q107 111 99 115 Z" fill="#F4AA35" />
          <path d="M99.5 114.7 Q107 110.6 114.5 114.7" stroke="#6B3A1C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* muzzle, nose, whiskers */}
        <path d="M86 116 C 88 120, 88 124, 87 126 L 93 126 C 92 124, 92 120, 94 116 Z" fill="#FFE3B0" opacity=".6" />
        <ellipse cx="84" cy="134.5" rx="7.5" ry="5.8" fill={MUZZLE} />
        <ellipse cx="96" cy="134.5" rx="7.5" ry="5.8" fill={MUZZLE} />
        <ellipse cx="90" cy="142.5" rx="6.5" ry="4.5" fill={MUZZLE} />
        <path d="M86 127 Q90 125.5 94 127 L 91.2 131 Q90 132 88.8 131 Z" fill="#E8998A" />
        <path d="M90 131.5 L90 134.5 M90 134.5 q-2.5 3 -6 2 M90 134.5 q2.5 3 6 2" stroke="#8A4A2A" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M80 134 l-22 -4 M80 137 l-22 1 M80 140 l-19 5 M100 134 l22 -4 M100 137 l22 1 M100 140 l19 5" stroke="#FFF4E0" strokeWidth="1.1" strokeLinecap="round" opacity=".85" />

        {/* collar and bell */}
        <path d="M73 145 Q91 158 109 144" stroke="#3A7BD5" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <g className={styles.bell}>
          <circle cx="91" cy="152.5" r="1.8" fill="none" stroke="#B8900F" strokeWidth="1.3" />
          <rect x="85.5" y="154" width="11" height="11" rx="2" fill="#FFE14A" stroke="#B8900F" strokeWidth="1.4" />
          <path d="M88.5 162 h5" stroke="#8A6D10" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </g>

      <g fill="#F6D3A6" className="font-mono" fontWeight="700" aria-hidden="true">
        <text className={styles.z} x="128" y="76" fontSize="14">z</text>
        <text className={styles.z} x="140" y="62" fontSize="18">z</text>
        <text className={styles.z} x="154" y="46" fontSize="22">Z</text>
      </g>
    </svg>
  );
}
