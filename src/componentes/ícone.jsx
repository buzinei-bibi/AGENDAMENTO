import { Baby, Bolt, ClipboardCheck, Droplets, Gem, Scan, ScanLine, ShieldPlus, Smile, Sparkles, Syringe } from 'lucide-react'

// o lucide não tem dente: desenhado no mesmo estilo de traço
export function Dente({ size = 24, strokeWidth = 2, ...resto }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...resto}
    >
      <path d="M7.5 3C5 3 3.5 5 3.5 7.3c0 2.2.9 3.5 1.5 5.2.6 1.8.7 3.6 1 5.4.3 1.9.9 3.1 2 3.1 1.2 0 1.6-1.3 1.9-2.9.3-1.6.6-3.1 2.1-3.1s1.8 1.5 2.1 3.1c.3 1.6.7 2.9 1.9 2.9 1.1 0 1.7-1.2 2-3.1.3-1.8.4-3.6 1-5.4.6-1.7 1.5-3 1.5-5.2C20.5 5 19 3 16.5 3 14.7 3 13.6 4 12 4S9.3 3 7.5 3z" />
    </svg>
  )
}

const mapa = {
  prancheta: ClipboardCheck,
  gotas: Droplets,
  brilho: Sparkles,
  escudo: ShieldPlus,
  seringa: Syringe,
  sorriso: Smile,
  parafuso: Bolt,
  bebê: Baby,
  dente: Dente,
  joia: Gem,
  'raio-x': ScanLine,
  tomografia: Scan,
}

export default function Ícone({ nome, tamanho = 20 }) {
  const Componente = mapa[nome]
  if (!Componente) return null
  return <Componente size={tamanho} strokeWidth={1.6} aria-hidden="true" />
}
