import React from 'react';

export type HeroVariant = 'login' | 'roster' | 'history' | 'stats' | 'settings' | 'superadmin' | 'class';

interface PageHeroProps {
  variant: HeroVariant;
  title: string;
  subtitle?: string;
  badge?: string;
  fullBleed?: boolean;
}

// ── Realistic School Building ─────────────────────────────────────────────────
const SchoolSilhouette = () => (
  <svg viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {/* Sky gradient */}
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#AF1E23" stopOpacity="0.04"/>
        <stop offset="100%" stopColor="#AF1E23" stopOpacity="0.01"/>
      </linearGradient>
    </defs>
    <rect width="900" height="220" fill="url(#sky)"/>
    {/* Ground line */}
    <line x1="0" y1="198" x2="900" y2="198" stroke="#AF1E23" strokeWidth="1.5" opacity="0.15"/>
    {/* Main building body */}
    <rect x="220" y="80" width="460" height="118" fill="#AF1E23" opacity="0.09"/>
    {/* Main roof - pitched */}
    <polygon points="200,80 450,22 700,80" fill="#AF1E23" opacity="0.13"/>
    {/* Roof ridge detail */}
    <line x1="200" y1="80" x2="700" y2="80" stroke="#AF1E23" strokeWidth="1.5" opacity="0.2"/>
    {/* Central entrance pediment */}
    <polygon points="370,80 450,50 530,80" fill="#AF1E23" opacity="0.18"/>
    <line x1="370" y1="80" x2="530" y2="80" stroke="#AF1E23" strokeWidth="1" opacity="0.25"/>
    {/* Flagpole */}
    <line x1="450" y1="22" x2="450" y2="2" stroke="#AF1E23" strokeWidth="2" opacity="0.3"/>
    {/* Flag */}
    <path d="M450,2 L478,8 L450,14 Z" fill="#AF1E23" opacity="0.4">
      <animateTransform attributeName="transform" type="skewX" values="0;-6;0;6;0" dur="3s" repeatCount="indefinite" additive="sum"/>
    </path>
    {/* Columns */}
    {[390,415,440,465,490,515].map((x,i) => (
      <rect key={i} x={x} y="80" width="8" height="118" fill="#AF1E23" opacity="0.1"/>
    ))}
    {/* Main entrance door - arched */}
    <rect x="425" y="138" width="50" height="60" rx="2" fill="#AF1E23" opacity="0.18"/>
    <path d="M425,138 Q450,118 475,138" fill="#AF1E23" opacity="0.18"/>
    {/* Door frame */}
    <rect x="423" y="136" width="54" height="62" rx="2" fill="none" stroke="#AF1E23" strokeWidth="1.5" opacity="0.2"/>
    {/* Door handle */}
    <circle cx="470" cy="170" r="2.5" fill="#AF1E23" opacity="0.3"/>
    {/* Windows row 1 - arched tops */}
    {[240,300,360,540,600,660].map((x,i) => (
      <g key={i}>
        <rect x={x} y="105" width="38" height="50" rx="1" fill="#AF1E23" opacity="0.12"/>
        <path d={`M${x},105 Q${x+19},90 ${x+38},105`} fill="#AF1E23" opacity="0.15"/>
        <line x1={x+19} y1="90" x2={x+19} y2="155" stroke="#AF1E23" strokeWidth="1" opacity="0.1"/>
        <line x1={x} y1="130" x2={x+38} y2="130" stroke="#AF1E23" strokeWidth="1" opacity="0.1"/>
        <animate attributeName="opacity" values="0.12;0.2;0.12" dur={`${3+i*0.4}s`} repeatCount="indefinite"/>
      </g>
    ))}
    {/* Side wings */}
    <rect x="100" y="110" width="120" height="88" fill="#AF1E23" opacity="0.07"/>
    <polygon points="90,110 160,78 230,110" fill="#AF1E23" opacity="0.1"/>
    <rect x="680" y="110" width="120" height="88" fill="#AF1E23" opacity="0.07"/>
    <polygon points="670,110 740,78 810,110" fill="#AF1E23" opacity="0.1"/>
    {/* Wing windows */}
    {[115,155].map((x,i) => (
      <rect key={i} x={x} y="128" width="28" height="36" rx="1" fill="#AF1E23" opacity="0.1"/>
    ))}
    {[695,735].map((x,i) => (
      <rect key={i} x={x} y="128" width="28" height="36" rx="1" fill="#AF1E23" opacity="0.1"/>
    ))}
    {/* Steps */}
    <rect x="400" y="196" width="100" height="4" rx="1" fill="#AF1E23" opacity="0.15"/>
    <rect x="410" y="192" width="80" height="4" rx="1" fill="#AF1E23" opacity="0.12"/>
    <rect x="420" y="188" width="60" height="4" rx="1" fill="#AF1E23" opacity="0.1"/>
    {/* Trees - detailed */}
    {/* Left tree */}
    <ellipse cx="60" cy="155" rx="28" ry="35" fill="#AF1E23" opacity="0.08"/>
    <ellipse cx="50" cy="165" rx="20" ry="28" fill="#AF1E23" opacity="0.06"/>
    <ellipse cx="72" cy="162" rx="18" ry="25" fill="#AF1E23" opacity="0.07"/>
    <rect x="56" y="185" width="8" height="14" rx="2" fill="#AF1E23" opacity="0.1"/>
    {/* Right tree */}
    <ellipse cx="840" cy="152" rx="26" ry="32" fill="#AF1E23" opacity="0.08"/>
    <ellipse cx="828" cy="162" rx="18" ry="24" fill="#AF1E23" opacity="0.06"/>
    <ellipse cx="852" cy="160" rx="16" ry="22" fill="#AF1E23" opacity="0.07"/>
    <rect x="836" y="182" width="8" height="14" rx="2" fill="#AF1E23" opacity="0.1"/>
    {/* Realistic walking student */}
    <g opacity="0.28">
      <animateTransform attributeName="transform" type="translate" values="-80,0;980,0" dur="18s" repeatCount="indefinite"/>
      {/* Head */}
      <circle cx="50" cy="168" r="7" fill="#AF1E23"/>
      {/* Neck */}
      <rect x="47" y="175" width="6" height="5" fill="#AF1E23"/>
      {/* Body */}
      <path d="M40,180 Q50,178 60,180 L58,198 L42,198 Z" fill="#AF1E23"/>
      {/* Backpack */}
      <rect x="55" y="181" width="10" height="14" rx="2" fill="#AF1E23" opacity="0.7"/>
      {/* Left leg */}
      <line x1="44" y1="198" x2="40" y2="215" stroke="#AF1E23" strokeWidth="4" strokeLinecap="round">
        <animate attributeName="x2" values="40;44;40" dur="0.7s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="215;213;215" dur="0.7s" repeatCount="indefinite"/>
      </line>
      {/* Right leg */}
      <line x1="56" y1="198" x2="60" y2="215" stroke="#AF1E23" strokeWidth="4" strokeLinecap="round">
        <animate attributeName="x2" values="60;56;60" dur="0.7s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="215;213;215" dur="0.7s" repeatCount="indefinite"/>
      </line>
      {/* Left arm */}
      <line x1="42" y1="183" x2="35" y2="196" stroke="#AF1E23" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="x2" values="35;38;35" dur="0.7s" repeatCount="indefinite"/>
      </line>
      {/* Right arm */}
      <line x1="58" y1="183" x2="65" y2="196" stroke="#AF1E23" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="x2" values="65;62;65" dur="0.7s" repeatCount="indefinite"/>
      </line>
    </g>
    {/* Second student further back, smaller */}
    <g opacity="0.18">
      <animateTransform attributeName="transform" type="translate" values="-200,0;980,0" dur="24s" repeatCount="indefinite"/>
      <circle cx="50" cy="172" r="5.5" fill="#AF1E23"/>
      <rect x="47" y="178" width="5" height="4" fill="#AF1E23"/>
      <path d="M42,182 Q50,180 58,182 L56,196 L44,196 Z" fill="#AF1E23"/>
      <line x1="46" y1="196" x2="42" y2="210" stroke="#AF1E23" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="x2" values="42;46;42" dur="0.65s" repeatCount="indefinite"/>
      </line>
      <line x1="54" y1="196" x2="58" y2="210" stroke="#AF1E23" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="x2" values="58;54;58" dur="0.65s" repeatCount="indefinite"/>
      </line>
    </g>
  </svg>
);

// ── Realistic Classroom ───────────────────────────────────────────────────────
const ClassroomSilhouette = ({ grade }: { grade?: string }) => (
  <svg viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {/* Floor line */}
    <line x1="0" y1="200" x2="900" y2="200" stroke="#AF1E23" strokeWidth="1" opacity="0.12"/>
    {/* Blackboard - realistic with frame */}
    <rect x="180" y="18" width="540" height="110" rx="3" fill="#AF1E23" opacity="0.07"/>
    <rect x="185" y="23" width="530" height="100" rx="2" fill="#AF1E23" opacity="0.05"/>
    {/* Board frame */}
    <rect x="180" y="18" width="540" height="110" rx="3" fill="none" stroke="#AF1E23" strokeWidth="2.5" opacity="0.15"/>
    {/* Board tray */}
    <rect x="180" y="128" width="540" height="8" rx="2" fill="#AF1E23" opacity="0.12"/>
    {/* Chalk on tray */}
    <rect x="200" y="129" width="18" height="5" rx="2" fill="#AF1E23" opacity="0.2"/>
    <rect x="225" y="129" width="12" height="5" rx="2" fill="#AF1E23" opacity="0.15"/>
    {/* Grade number on board */}
    {grade && (
      <text x="450" y="90" textAnchor="middle" fill="#AF1E23" fontSize="60" fontWeight="700" opacity="0.2" fontFamily="Georgia,serif">
        {grade}
        <animate attributeName="opacity" values="0.2;0.35;0.2" dur="3s" repeatCount="indefinite"/>
      </text>
    )}
    {/* Chalk writing lines */}
    {!grade && [
      {x1:210,y1:55,x2:380,y2:55}, {x1:210,y1:72,x2:320,y2:72},
      {x1:210,y1:89,x2:360,y2:89}, {x1:210,y1:106,x2:290,y2:106},
    ].map((l,i) => (
      <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#AF1E23" strokeWidth="2" opacity="0.15" strokeLinecap="round">
        <animate attributeName="x2" values={`${l.x1};${l.x2};${l.x1}`} dur={`${4+i*0.5}s`} repeatCount="indefinite"/>
      </line>
    ))}
    {/* Teacher - detailed silhouette */}
    <g opacity="0.3">
      {/* Head */}
      <circle cx="130" cy="80" r="12" fill="#AF1E23"/>
      {/* Hair */}
      <path d="M118,76 Q130,65 142,76" fill="#AF1E23" opacity="0.5"/>
      {/* Neck */}
      <rect x="126" y="92" width="8" height="8" fill="#AF1E23"/>
      {/* Body/jacket */}
      <path d="M110,100 Q130,96 150,100 L148,155 L112,155 Z" fill="#AF1E23"/>
      {/* Collar */}
      <path d="M126,100 L130,112 L134,100" fill="#AF1E23" opacity="0.6"/>
      {/* Left arm - pointing at board */}
      <line x1="112" y1="110" x2="178" y2="88" stroke="#AF1E23" strokeWidth="6" strokeLinecap="round">
        <animate attributeName="x2" values="178;170;178" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="88;95;88" dur="3s" repeatCount="indefinite"/>
      </line>
      {/* Pointer */}
      <line x1="178" y1="88" x2="185" y2="85" stroke="#AF1E23" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="x2" values="185;177;185" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="85;92;85" dur="3s" repeatCount="indefinite"/>
      </line>
      {/* Right arm down */}
      <line x1="148" y1="110" x2="155" y2="135" stroke="#AF1E23" strokeWidth="6" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="116" y="155" width="12" height="40" rx="3" fill="#AF1E23"/>
      <rect x="132" y="155" width="12" height="40" rx="3" fill="#AF1E23"/>
      {/* Shoes */}
      <ellipse cx="122" cy="196" rx="10" ry="5" fill="#AF1E23"/>
      <ellipse cx="138" cy="196" rx="10" ry="5" fill="#AF1E23"/>
    </g>
    {/* Student desks - 3 rows of 4 */}
    {[0,1,2].map(row => (
      [0,1,2,3].map(col => {
        const x = 280 + col * 155;
        const y = 148 + row * 0; // single row visible
        if (row > 0) return null;
        return (
          <g key={`${row}-${col}`}>
            {/* Desk surface */}
            <path d={`M${x},${y} L${x+80},${y} L${x+75},${y+18} L${x+5},${y+18} Z`} fill="#AF1E23" opacity="0.1"/>
            {/* Desk legs */}
            <line x1={x+10} y1={y+18} x2={x+8} y2={y+45} stroke="#AF1E23" strokeWidth="2.5" opacity="0.12" strokeLinecap="round"/>
            <line x1={x+70} y1={y+18} x2={x+72} y2={y+45} stroke="#AF1E23" strokeWidth="2.5" opacity="0.12" strokeLinecap="round"/>
            {/* Book on desk */}
            <rect x={x+20} y={y+4} width="22" height="12" rx="1" fill="#AF1E23" opacity="0.15"/>
            {/* Seated student */}
            <circle cx={x+40} cy={y-18} r="9" fill="#AF1E23" opacity="0.2">
              <animate attributeName="opacity" values="0.2;0.3;0.2" dur={`${2.5+col*0.4}s`} repeatCount="indefinite"/>
            </circle>
            {/* Body */}
            <path d={`M${x+30},${y-9} Q${x+40},${y-12} ${x+50},${y-9} L${x+48},${y+2} L${x+32},${y+2} Z`} fill="#AF1E23" opacity="0.18"/>
            {/* Arms on desk */}
            <line x1={x+32} y1={y-4} x2={x+25} y2={y+8} stroke="#AF1E23" strokeWidth="3.5" strokeLinecap="round" opacity="0.15"/>
            <line x1={x+48} y1={y-4} x2={x+55} y2={y+8} stroke="#AF1E23" strokeWidth="3.5" strokeLinecap="round" opacity="0.15"/>
          </g>
        );
      })
    ))}
    {/* Wall clock */}
    <circle cx="820" cy="45" r="22" stroke="#AF1E23" strokeWidth="2" opacity="0.2" fill="none"/>
    <circle cx="820" cy="45" r="20" fill="#AF1E23" opacity="0.04"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
      <line key={i}
        x1={820 + 16*Math.sin(a*Math.PI/180)} y1={45 - 16*Math.cos(a*Math.PI/180)}
        x2={820 + (i%3===0?13:15)*Math.sin(a*Math.PI/180)} y2={45 - (i%3===0?13:15)*Math.cos(a*Math.PI/180)}
        stroke="#AF1E23" strokeWidth={i%3===0?2:1} opacity="0.2"/>
    ))}
    <circle cx="820" cy="45" r="2.5" fill="#AF1E23" opacity="0.3"/>
    <line x1="820" y1="45" x2="820" y2="30" stroke="#AF1E23" strokeWidth="2.5" strokeLinecap="round" opacity="0.3">
      <animateTransform attributeName="transform" type="rotate" values="0,820,45;360,820,45" dur="10s" repeatCount="indefinite"/>
    </line>
    <line x1="820" y1="45" x2="833" y2="45" stroke="#AF1E23" strokeWidth="2" strokeLinecap="round" opacity="0.25">
      <animateTransform attributeName="transform" type="rotate" values="0,820,45;360,820,45" dur="120s" repeatCount="indefinite"/>
    </line>
  </svg>
);

// ── Realistic History / Document ──────────────────────────────────────────────
const HistorySilhouette = () => (
  <svg viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {/* Desk surface */}
    <rect x="0" y="185" width="900" height="35" fill="#AF1E23" opacity="0.05"/>
    <line x1="0" y1="185" x2="900" y2="185" stroke="#AF1E23" strokeWidth="1.5" opacity="0.1"/>
    {/* Main document / clipboard */}
    <rect x="270" y="15" width="220" height="175" rx="4" fill="#AF1E23" opacity="0.07"/>
    <rect x="270" y="15" width="220" height="175" rx="4" stroke="#AF1E23" strokeWidth="1.5" opacity="0.15"/>
    {/* Clipboard clip */}
    <rect x="340" y="8" width="80" height="18" rx="4" fill="#AF1E23" opacity="0.15"/>
    <rect x="355" y="4" width="50" height="12" rx="6" fill="#AF1E23" opacity="0.12"/>
    {/* Document lines */}
    {[45,62,79,96,113,130,147,164].map((y,i) => (
      <g key={i}>
        <circle cx="288" cy={y+3} r="3.5" fill="#AF1E23" opacity={i < 5 ? 0.3 : 0.15}>
          <animate attributeName="opacity" values={`${i<5?0.3:0.15};${i<5?0.55:0.3};${i<5?0.3:0.15}`} dur={`${2+i*0.35}s`} repeatCount="indefinite"/>
        </circle>
        <rect x="300" y={y} width={i%3===0?140:i%3===1?110:125} height="7" rx="3.5" fill="#AF1E23" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.2;0.12" dur={`${3+i*0.25}s`} repeatCount="indefinite"/>
        </rect>
      </g>
    ))}
    {/* Second document behind */}
    <rect x="420" y="25" width="200" height="165" rx="4" fill="#AF1E23" opacity="0.05"/>
    <rect x="420" y="25" width="200" height="165" rx="4" stroke="#AF1E23" strokeWidth="1" opacity="0.1"/>
    {/* Realistic pen */}
    <g opacity="0.35">
      <animateTransform attributeName="transform" type="translate" values="0,0;4,3;0,0" dur="2.5s" repeatCount="indefinite"/>
      {/* Pen body */}
      <rect x="148" y="95" width="10" height="65" rx="5" fill="#AF1E23" transform="rotate(-35,148,95)"/>
      {/* Pen tip */}
      <polygon points="148,95 152,95 150,88" fill="#AF1E23" transform="rotate(-35,150,92)"/>
      {/* Pen clip */}
      <rect x="150" y="100" width="3" height="40" rx="1.5" fill="#AF1E23" opacity="0.5" transform="rotate(-35,150,100)"/>
      {/* Writing mark */}
      <path d="M155,148 Q160,152 165,150" stroke="#AF1E23" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </g>
    {/* Realistic clock */}
    <circle cx="760" cy="90" r="48" fill="#AF1E23" opacity="0.04"/>
    <circle cx="760" cy="90" r="48" stroke="#AF1E23" strokeWidth="3" opacity="0.18"/>
    <circle cx="760" cy="90" r="44" stroke="#AF1E23" strokeWidth="1" opacity="0.08"/>
    {/* Hour markers */}
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
      <line key={i}
        x1={760+40*Math.sin(a*Math.PI/180)} y1={90-40*Math.cos(a*Math.PI/180)}
        x2={760+(i%3===0?33:37)*Math.sin(a*Math.PI/180)} y2={90-(i%3===0?33:37)*Math.cos(a*Math.PI/180)}
        stroke="#AF1E23" strokeWidth={i%3===0?2.5:1.5} opacity={i%3===0?0.3:0.18}/>
    ))}
    {/* Hour numbers */}
    {[12,3,6,9].map((n,i) => {
      const a = (i*90-90)*Math.PI/180;
      return <text key={n} x={760+28*Math.cos(a)} y={90+28*Math.sin(a)+4} textAnchor="middle" fill="#AF1E23" fontSize="11" fontWeight="600" opacity="0.25" fontFamily="Inter,sans-serif">{n}</text>;
    })}
    <circle cx="760" cy="90" r="4" fill="#AF1E23" opacity="0.4"/>
    {/* Hour hand */}
    <line x1="760" y1="90" x2="760" y2="62" stroke="#AF1E23" strokeWidth="4" strokeLinecap="round" opacity="0.3">
      <animateTransform attributeName="transform" type="rotate" values="0,760,90;360,760,90" dur="43200s" repeatCount="indefinite"/>
    </line>
    {/* Minute hand */}
    <line x1="760" y1="90" x2="760" y2="50" stroke="#AF1E23" strokeWidth="2.5" strokeLinecap="round" opacity="0.25">
      <animateTransform attributeName="transform" type="rotate" values="0,760,90;360,760,90" dur="60s" repeatCount="indefinite"/>
    </line>
    {/* Second hand */}
    <line x1="760" y1="100" x2="760" y2="48" stroke="#AF1E23" strokeWidth="1.5" strokeLinecap="round" opacity="0.35">
      <animateTransform attributeName="transform" type="rotate" values="0,760,90;360,760,90" dur="10s" repeatCount="indefinite"/>
    </line>
  </svg>
);

// ── Realistic Stats / Bar Chart ───────────────────────────────────────────────
const StatsSilhouette = () => (
  <svg viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {/* Chart area background */}
    <rect x="60" y="20" width="780" height="170" rx="4" fill="#AF1E23" opacity="0.02"/>
    {/* Horizontal grid lines */}
    {[20,55,90,125,160].map((y,i) => (
      <line key={i} x1="80" y1={y+10} x2="840" y2={y+10} stroke="#AF1E23" strokeWidth="1" opacity="0.08" strokeDasharray={i===4?"none":"4 4"}/>
    ))}
    {/* Y-axis */}
    <line x1="80" y1="20" x2="80" y2="195" stroke="#AF1E23" strokeWidth="2" opacity="0.18"/>
    {/* X-axis */}
    <line x1="80" y1="195" x2="860" y2="195" stroke="#AF1E23" strokeWidth="2" opacity="0.18"/>
    {/* Y-axis labels */}
    {['20','15','10','5','0'].map((n,i) => (
      <text key={n} x="70" y={30+i*35} textAnchor="end" fill="#AF1E23" fontSize="10" opacity="0.25" fontFamily="Inter,sans-serif">{n}</text>
    ))}
    {/* Bars with realistic proportions */}
    {[
      {x:110, h:140, label:'Hën', val:'18'},
      {x:210, h:95,  label:'Mar', val:'12'},
      {x:310, h:160, label:'Mër', val:'21'},
      {x:410, h:75,  label:'Enj', val:'9'},
      {x:510, h:130, label:'Pre', val:'17'},
      {x:610, h:50,  label:'Sht', val:'6'},
      {x:710, h:110, label:'Die', val:'14'},
    ].map((b,i) => (
      <g key={i}>
        {/* Bar shadow */}
        <rect x={b.x+4} y={199-b.h+4} width="68" height={b.h} rx="4" fill="#AF1E23" opacity="0.04"/>
        {/* Bar */}
        <rect x={b.x} y={195-b.h} width="68" height={b.h} rx="4 4 0 0" fill="#AF1E23" opacity="0.13">
          <animate attributeName="opacity" values="0.13;0.22;0.13" dur={`${3+i*0.35}s`} repeatCount="indefinite"/>
        </rect>
        {/* Bar top highlight */}
        <rect x={b.x} y={195-b.h} width="68" height="4" rx="4 4 0 0" fill="#AF1E23" opacity="0.08"/>
        {/* Value label */}
        <text x={b.x+34} y={190-b.h} textAnchor="middle" fill="#AF1E23" fontSize="11" fontWeight="700" opacity="0.3" fontFamily="Inter,sans-serif">
          {b.val}
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur={`${2.5+i*0.3}s`} repeatCount="indefinite"/>
        </text>
        {/* X label */}
        <text x={b.x+34} y="210" textAnchor="middle" fill="#AF1E23" fontSize="10" opacity="0.2" fontFamily="Inter,sans-serif">{b.label}</text>
      </g>
    ))}
    {/* Trend line overlay */}
    <polyline
      points="144,55 244,100 344,35 444,120 544,65 644,145 744,85"
      stroke="#AF1E23" strokeWidth="2.5" fill="none" opacity="0.2" strokeLinejoin="round">
      <animate attributeName="stroke-dashoffset" values="0;-30;0" dur="4s" repeatCount="indefinite"/>
    </polyline>
    {/* Trend line dots */}
    {[[144,55],[244,100],[344,35],[444,120],[544,65],[644,145],[744,85]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="5" fill="#AF1E23" opacity="0.25">
        <animate attributeName="r" values="5;7;5" dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
      </circle>
    ))}
  </svg>
);

// ── Realistic Settings / Gears + Person ──────────────────────────────────────
const SettingsSilhouette = () => (
  <svg viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {/* Large gear */}
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0,620,110;360,620,110" dur="25s" repeatCount="indefinite"/>
      <circle cx="620" cy="110" r="62" stroke="#AF1E23" strokeWidth="12" opacity="0.09" fill="none"/>
      <circle cx="620" cy="110" r="50" stroke="#AF1E23" strokeWidth="1" opacity="0.08" fill="none"/>
      <circle cx="620" cy="110" r="24" fill="#AF1E23" opacity="0.09"/>
      <circle cx="620" cy="110" r="14" fill="none" stroke="#AF1E23" strokeWidth="2" opacity="0.12"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
        const r1=62, r2=78, mid=(r1+r2)/2;
        const rad=a*Math.PI/180;
        const x1=620+r1*Math.sin(rad), y1=110-r1*Math.cos(rad);
        const x2=620+r2*Math.sin(rad), y2=110-r2*Math.cos(rad);
        return <rect key={i} x={620+mid*Math.sin(rad)-6} y={110-mid*Math.cos(rad)-9} width="12" height="18" rx="3" fill="#AF1E23" opacity="0.12" transform={`rotate(${a},${620+mid*Math.sin(rad)},${110-mid*Math.cos(rad)})`}/>;
      })}
    </g>
    {/* Medium gear */}
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0,790,55;-360,790,55" dur="15s" repeatCount="indefinite"/>
      <circle cx="790" cy="55" r="38" stroke="#AF1E23" strokeWidth="8" opacity="0.07" fill="none"/>
      <circle cx="790" cy="55" r="15" fill="#AF1E23" opacity="0.07"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const mid=46;
        const rad=a*Math.PI/180;
        return <rect key={i} x={790+mid*Math.sin(rad)-5} y={55-mid*Math.cos(rad)-7} width="10" height="14" rx="2" fill="#AF1E23" opacity="0.09" transform={`rotate(${a},${790+mid*Math.sin(rad)},${55-mid*Math.cos(rad)})`}/>;
      })}
    </g>
    {/* Small gear */}
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0,760,165;360,760,165" dur="10s" repeatCount="indefinite"/>
      <circle cx="760" cy="165" r="22" stroke="#AF1E23" strokeWidth="5" opacity="0.07" fill="none"/>
      <circle cx="760" cy="165" r="9" fill="#AF1E23" opacity="0.07"/>
      {[0,60,120,180,240,300].map((a,i) => {
        const mid=27;
        const rad=a*Math.PI/180;
        return <rect key={i} x={760+mid*Math.sin(rad)-4} y={165-mid*Math.cos(rad)-6} width="8" height="12" rx="2" fill="#AF1E23" opacity="0.09" transform={`rotate(${a},${760+mid*Math.sin(rad)},${165-mid*Math.cos(rad)})`}/>;
      })}
    </g>
    {/* Realistic person silhouette */}
    <g opacity="0.22">
      {/* Head */}
      <circle cx="200" cy="68" r="22" fill="#AF1E23"/>
      {/* Hair */}
      <path d="M178,65 Q200,48 222,65 Q218,52 200,48 Q182,52 178,65Z" fill="#AF1E23" opacity="0.6"/>
      {/* Neck */}
      <rect x="192" y="90" width="16" height="14" fill="#AF1E23"/>
      {/* Shoulders / body */}
      <path d="M155,104 Q200,96 245,104 L240,185 L160,185 Z" fill="#AF1E23"/>
      {/* Collar */}
      <path d="M192,104 L200,120 L208,104" fill="#AF1E23" opacity="0.5"/>
      {/* Left arm */}
      <path d="M158,108 Q140,130 135,160 L148,162 Q152,138 168,118 Z" fill="#AF1E23"/>
      {/* Right arm */}
      <path d="M242,108 Q260,130 265,160 L252,162 Q248,138 232,118 Z" fill="#AF1E23"/>
      {/* Legs */}
      <rect x="168" y="185" width="22" height="32" rx="4" fill="#AF1E23"/>
      <rect x="210" y="185" width="22" height="32" rx="4" fill="#AF1E23"/>
      {/* Shoes */}
      <ellipse cx="179" cy="218" rx="16" ry="6" fill="#AF1E23"/>
      <ellipse cx="221" cy="218" rx="16" ry="6" fill="#AF1E23"/>
    </g>
    {/* Key */}
    <g opacity="0.25">
      <circle cx="340" cy="155" r="18" stroke="#AF1E23" strokeWidth="4" fill="none"/>
      <circle cx="340" cy="155" r="8" stroke="#AF1E23" strokeWidth="3" fill="none"/>
      <line x1="358" y1="155" x2="400" y2="155" stroke="#AF1E23" strokeWidth="4" strokeLinecap="round"/>
      <line x1="392" y1="155" x2="392" y2="168" stroke="#AF1E23" strokeWidth="4" strokeLinecap="round"/>
      <line x1="380" y1="155" x2="380" y2="172" stroke="#AF1E23" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);

// ── Realistic Super Admin / Shield ────────────────────────────────────────────
const SuperAdminSilhouette = () => (
  <svg viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {/* Shield - detailed */}
    <path d="M450,12 L570,48 L570,118 Q570,182 450,205 Q330,182 330,118 L330,48 Z" fill="#AF1E23" opacity="0.08">
      <animate attributeName="opacity" values="0.08;0.14;0.08" dur="4s" repeatCount="indefinite"/>
    </path>
    {/* Shield outer border */}
    <path d="M450,12 L570,48 L570,118 Q570,182 450,205 Q330,182 330,118 L330,48 Z" stroke="#AF1E23" strokeWidth="3" fill="none" opacity="0.2"/>
    {/* Shield inner border */}
    <path d="M450,28 L555,60 L555,116 Q555,170 450,190 Q345,170 345,116 L345,60 Z" stroke="#AF1E23" strokeWidth="1.5" fill="none" opacity="0.12"/>
    {/* Shield emblem - checkmark */}
    <polyline points="408,108 435,135 492,82" stroke="#AF1E23" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.55;0.3" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" values="8;10;8" dur="2.5s" repeatCount="indefinite"/>
    </polyline>
    {/* Orbiting security dots */}
    {[0,72,144,216,288].map((deg,i) => (
      <g key={i}>
        <circle cx="450" cy="108" r="6" fill="#AF1E23" opacity="0.22">
          <animateTransform attributeName="transform" type="rotate"
            values={`${deg},450,108;${deg+360},450,108`} dur={`${8+i*0.5}s`} repeatCount="indefinite" additive="sum"/>
          <animateTransform attributeName="transform" type="translate" values="0,-105;0,-105" additive="sum"/>
          <animate attributeName="opacity" values="0.22;0.4;0.22" dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      </g>
    ))}
    {/* Stars scattered */}
    {[[100,30],[800,28],[80,160],[820,155],[180,55],[720,50],[150,130],[750,125]].map(([x,y],i) => (
      <g key={i}>
        <text x={x} y={y} fill="#AF1E23" fontSize="16" opacity="0.15" fontFamily="serif" textAnchor="middle">★
          <animate attributeName="opacity" values="0.15;0.38;0.15" dur={`${2.2+i*0.55}s`} repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="scale" values="1,1;1.2,1.2;1,1" dur={`${2.2+i*0.55}s`} repeatCount="indefinite" additive="sum"/>
        </text>
      </g>
    ))}
    {/* Lock icon below shield */}
    <rect x="424" y="210" width="52" height="38" rx="6" fill="#AF1E23" opacity="0.12"/>
    <path d="M432,210 Q432,192 450,192 Q468,192 468,210" stroke="#AF1E23" strokeWidth="4" fill="none" opacity="0.18"/>
    <circle cx="450" cy="228" r="6" fill="#AF1E23" opacity="0.2"/>
    <line x1="450" y1="228" x2="450" y2="238" stroke="#AF1E23" strokeWidth="3" opacity="0.2" strokeLinecap="round"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export const PageHero: React.FC<PageHeroProps> = ({ variant, title, subtitle, badge, fullBleed }) => {
  const silhouette = {
    login:      <SchoolSilhouette />,
    roster:     <ClassroomSilhouette />,
    class:      <ClassroomSilhouette grade={badge} />,
    history:    <HistorySilhouette />,
    stats:      <StatsSilhouette />,
    settings:   <SettingsSilhouette />,
    superadmin: <SuperAdminSilhouette />,
  }[variant];

  if (fullBleed) {
    return (
      <div className="relative w-full overflow-hidden bg-white border-b border-border print:hidden" style={{ height: '200px' }}>
        {silhouette}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none"/>
        <div className="relative z-10 h-full flex flex-col justify-center px-10">
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-light text-brand mb-3 tracking-[0.6px] uppercase w-fit">
              {badge}
            </span>
          )}
          <h2 className="font-serif text-[28px] font-bold text-text-primary leading-tight">{title}</h2>
          {subtitle && <p className="text-[13.5px] text-text-muted mt-2 max-w-lg">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-7 border border-border bg-white" style={{ height: '160px' }}>
      {silhouette}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"/>
      <div className="relative z-10 h-full flex flex-col justify-center px-8">
        {badge && (
          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-light text-brand mb-2.5 tracking-[0.5px] uppercase w-fit">
            {badge}
          </span>
        )}
        <h2 className="font-serif text-[22px] font-bold text-text-primary leading-tight">{title}</h2>
        {subtitle && <p className="text-[13px] text-text-muted mt-1.5 max-w-md">{subtitle}</p>}
      </div>
    </div>
  );
};
