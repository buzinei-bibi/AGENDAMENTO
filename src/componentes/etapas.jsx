import { Check } from 'lucide-react'

export default function Etapas({ etapas, atual, ao_voltar_para }) {
  return (
    <ol className="etapas" aria-label="etapas do agendamento">
      {etapas.map((nome, i) => {
        const estado = i < atual ? 'feita' : i === atual ? 'atual' : 'futura'
        return (
          <li key={nome} className={`etapa ${estado}`} aria-current={i === atual ? 'step' : undefined}>
            <button disabled={i >= atual} onClick={() => ao_voltar_para(i)}>
              <span className="etapa-número">{i < atual ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : i + 1}</span>
              <span className="etapa-nome">{nome}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
