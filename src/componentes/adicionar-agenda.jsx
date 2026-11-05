import { CalendarPlus } from 'lucide-react'
import { arquivo_agenda, lembrete_horas_antes, link_google_agenda } from '../agenda.js'

// "compacto" é a versão pequena usada em cada consulta de agendamentos
export default function AdicionarAgenda({ agendamento, compacto = false }) {
  const arquivo = arquivo_agenda(agendamento)
  return (
    <div className={`adicionar-agenda ${compacto ? 'compacto' : ''}`}>
      <a className="botão evento" href={arquivo.endereço} download={arquivo.nome}>
        <CalendarPlus size={compacto ? 14 : 18} strokeWidth={2} aria-hidden="true" /> Adicionar à agenda
      </a>
      <a className="link-google" href={link_google_agenda(agendamento)} target="_blank" rel="noopener noreferrer">
        ou abrir no google agenda
      </a>
      {!compacto && <p className="agenda-dica">o celular avisa {lembrete_horas_antes}h antes, no dia da consulta.</p>}
    </div>
  )
}
