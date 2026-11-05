import { Check } from 'lucide-react'
import AdicionarAgenda from './adicionar-agenda.jsx'

export default function Confirmado({ título, texto, código, linhas, agendamento, ir_para, novo }) {
  return (
    <section className="confirmado" aria-live="polite">
      <div className="confirmado-selo" aria-hidden="true">
        <Check size={30} strokeWidth={2} />
      </div>
      <h2>{título}</h2>
      {texto && <p className="confirmado-boas-vindas">{texto}</p>}
      <p className="confirmado-texto">guarde o código abaixo. você também pode ver tudo em agendamentos.</p>
      <p className="código">{código}</p>
      <dl className="resumo">
        {linhas.map(([rótulo, valor]) => (
          <div key={rótulo}>
            <dt>{rótulo}</dt>
            <dd>{valor}</dd>
          </div>
        ))}
      </dl>
      {agendamento && <AdicionarAgenda agendamento={agendamento} />}
      <div className="ações">
        <button className="botão principal" onClick={() => ir_para('agendamentos')}>
          ver meus agendamentos
        </button>
        <button className="botão fantasma" onClick={novo}>
          fazer outro
        </button>
      </div>
    </section>
  )
}
