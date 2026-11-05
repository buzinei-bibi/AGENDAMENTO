import { ArrowRight, ChevronDown } from 'lucide-react'
import Ícone from '../componentes/ícone.jsx'
import { dentistas, procedimentos } from '../dados.js'
import { dia_relativo, próximo_horário_livre } from '../útil.js'

// dentista + tratamento mostrados no painel de horários livres
const destaques = [
  { profissional_id: 'd2', item_id: 'limpeza' },
  { profissional_id: 'd1', item_id: 'avaliação' },
  { profissional_id: 'd5', item_id: 'ortodontia' },
  { profissional_id: 'd4', item_id: 'clareamento' },
]

const perguntas = [
  {
    p: 'Preciso levar alguma coisa?',
    r: 'leve um documento com foto e, se tiver, radiografias ou exames recentes. chegue uns 10 minutos antes.',
  },
  {
    p: 'Crianças podem ser atendidas?',
    r: 'sim. a odontopediatria atende de 0 a 12 anos, sempre com um responsável junto.',
  },
  {
    p: 'E se eu precisar desmarcar?',
    r: 'abra agendamentos, toque em cancelar e confirme. o horário volta a ficar livre na hora.',
  },
  {
    p: 'O que é o código do agendamento?',
    r: 'é a identificação do seu horário. informe na recepção quando chegar.',
  },
]

export default function Início({ ir_para, próximos, agendamentos }) {
  const livres = destaques
    .map((d) => {
      const dentista = dentistas.find((x) => x.id === d.profissional_id)
      const procedimento = procedimentos.find((p) => p.id === d.item_id)
      const vaga = próximo_horário_livre(d.profissional_id, agendamentos)
      return vaga && { ...d, ...vaga, dentista, procedimento }
    })
    .filter(Boolean)

  return (
    <div className="início">
      <section className="início-topo">
        <h1>
          Um minuto agora.
          <span className="destaque-texto">Um sorriso pra vida toda.</span>
        </h1>
        <p className="início-frase">escolha o tratamento, o horário livre e pronto.</p>
        <div className="início-ações">
          <button className="botão principal grande" onClick={() => ir_para('dentista')}>
            agendar consulta <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <button className="botão fantasma grande" onClick={() => ir_para('agendamentos')}>
            meus agendamentos
            {próximos > 0 && <span className="contador">{próximos}</span>}
          </button>
        </div>
      </section>

      <section className="painel-livres" aria-labelledby="título-livres">
        <div className="painel-topo">
          <h2 id="título-livres">Próximos horários livres</h2>
          <span className="ao-vivo">
            <span className="ponto" aria-hidden="true" /> agora
          </span>
        </div>
        <ul>
          {livres.map((l) => (
            <li key={l.profissional_id}>
              <button
                className="livre"
                onClick={() =>
                  ir_para('dentista', { item_id: l.item_id, profissional_id: l.profissional_id, data: l.data, hora: l.hora })
                }
                aria-label={`marcar ${l.procedimento.nome} com ${l.dentista.nome}, ${dia_relativo(l.data)} às ${l.hora}`}
              >
                <span className="livre-ícone" aria-hidden="true">
                  <Ícone nome={l.procedimento.ícone} tamanho={18} />
                </span>
                <span className="livre-info">
                  <strong>{l.dentista.nome}</strong>
                  <span>{l.procedimento.nome}</span>
                </span>
                <span className="livre-quando">
                  <small>{dia_relativo(l.data)}</small>
                  <strong>{l.hora}</strong>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="painel-rodapé">toque em um horário para marcar em um passo.</p>
      </section>

      <section className="perguntas" aria-labelledby="título-perguntas">
        <h2 id="título-perguntas">Perguntas frequentes</h2>
        {perguntas.map(({ p, r }) => (
          <details key={p}>
            <summary>
              {p}
              <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
            </summary>
            <p>{r}</p>
          </details>
        ))}
      </section>
    </div>
  )
}
