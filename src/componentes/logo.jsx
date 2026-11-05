// marca: calendário com um check, só traço e sem fundo
// as cores vêm de --logo-1 e --logo-2 (hoje as duas iguais ou quase: azul pastel → azul médio)
export default function Logo({ tamanho = 30 }) {
  return (
    <svg viewBox="0 0 32 32" width={tamanho} height={tamanho} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logo-gradiente" x1="3" y1="4" x2="29" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--logo-1)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-2)' }} />
        </linearGradient>
      </defs>
      <g stroke="url(#logo-gradiente)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M27 14V10.5A4.5 4.5 0 0 0 22.5 6h-13A4.5 4.5 0 0 0 5 10.5v12A4.5 4.5 0 0 0 9.5 27H15" />
        <path d="M11 3.5v5M21 3.5v5M5 12.5h22" />
        <path d="M18.5 23l3 3 6-6.5" />
      </g>
    </svg>
  )
}
