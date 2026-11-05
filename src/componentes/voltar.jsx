import { ArrowLeft } from 'lucide-react'

// seta no topo das páginas internas
export default function Voltar({ ao_clicar, rótulo = 'voltar' }) {
  return (
    <button className="voltar" onClick={ao_clicar} aria-label={rótulo}>
      <span className="voltar-seta" aria-hidden="true">
        <ArrowLeft size={18} strokeWidth={2} />
      </span>
      <span className="voltar-texto">voltar</span>
    </button>
  )
}
