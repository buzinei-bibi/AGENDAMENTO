import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { de_iso, hoje_iso, para_iso } from '../útil.js'

const dias_da_semana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

// modo "dia": escolhe uma data (selecionado / ao_escolher)
// modo "período": escolhe entrada e saída (início / fim / ao_escolher_período)
export default function Calendário({
  modo = 'dia',
  selecionado,
  ao_escolher,
  início,
  fim,
  ao_escolher_período,
  desabilitar = () => false,
  limite_dias = 120,
}) {
  const hoje = hoje_iso()
  const base = de_iso(selecionado || início || hoje)
  const [mês, mudar_mês] = useState(new Date(base.getFullYear(), base.getMonth(), 1))
  const limite = para_iso(new Date(Date.now() + limite_dias * 86400000))

  const primeiro_dia = mês.getDay()
  const dias_no_mês = new Date(mês.getFullYear(), mês.getMonth() + 1, 0).getDate()
  const células = []
  for (let i = 0; i < primeiro_dia; i++) células.push(null)
  for (let d = 1; d <= dias_no_mês; d++) células.push(para_iso(new Date(mês.getFullYear(), mês.getMonth(), d)))

  const mês_atual = new Date(de_iso(hoje).getFullYear(), de_iso(hoje).getMonth(), 1)
  const pode_voltar = mês > mês_atual
  const pode_avançar = para_iso(new Date(mês.getFullYear(), mês.getMonth() + 1, 1)) <= limite

  function clicar(iso) {
    if (modo === 'dia') return ao_escolher(iso)
    if (!início || (início && fim) || iso <= início) return ao_escolher_período(iso, null)
    ao_escolher_período(início, iso)
  }

  return (
    <div className="calendário">
      <div className="calendário-topo">
        <button
          className="seta"
          onClick={() => mudar_mês(new Date(mês.getFullYear(), mês.getMonth() - 1, 1))}
          disabled={!pode_voltar}
          aria-label="mês anterior"
        >
          <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <strong aria-live="polite">
          {mês.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </strong>
        <button
          className="seta"
          onClick={() => mudar_mês(new Date(mês.getFullYear(), mês.getMonth() + 1, 1))}
          disabled={!pode_avançar}
          aria-label="próximo mês"
        >
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <div className="calendário-grade" role="grid">
        {dias_da_semana.map((d) => (
          <span key={d} className="calendário-semana" role="columnheader">
            {d}
          </span>
        ))}
        {células.map((iso, i) => {
          if (!iso) return <span key={`v${i}`} />
          const bloqueado = iso < hoje || iso > limite || desabilitar(iso)
          const escolhido = modo === 'dia' ? iso === selecionado : iso === início || iso === fim
          const no_meio = modo === 'período' && início && fim && iso > início && iso < fim
          const classes = ['dia']
          if (escolhido) classes.push('escolhido')
          if (no_meio) classes.push('no-meio')
          if (iso === hoje) classes.push('hoje')
          return (
            <button
              key={iso}
              className={classes.join(' ')}
              disabled={bloqueado}
              aria-pressed={escolhido}
              aria-label={de_iso(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              onClick={() => clicar(iso)}
            >
              {Number(iso.slice(8))}
            </button>
          )
        })}
      </div>
    </div>
  )
}
