import { useState } from 'react'
import { CalendarClock, Clock3, LockKeyhole, Trash2, UserRound } from 'lucide-react'
import Voltar from '../componentes/voltar.jsx'
import AdicionarAgenda from '../componentes/adicionar-agenda.jsx'
import { prazo_cancelamento_horas } from '../dados.js'
import {
  data_hora_curta, data_por_extenso, de_iso, hoje_iso, limite_cancelamento, moeda, pode_cancelar,
} from '../útil.js'

const filtros = [
  { id: 'próximos', rótulo: 'Próximos' },
  { id: 'passados', rótulo: 'Passados' },
  { id: 'cancelados', rótulo: 'Cancelados' },
]

const mensagens_vazio = {
  próximos: 'Nenhuma consulta marcada por enquanto.',
  passados: 'Nenhuma consulta passada.',
  cancelados: 'Nenhuma consulta cancelada.',
}

// tudo nesta página aparece em maiúsculo (classe .página-agendamentos no css)
export default function Agendamentos({ agendamentos, cancelar, apagar, ir_para }) {
  const [filtro, mudar_filtro] = useState('próximos')
  const [confirmando, mudar_confirmando] = useState(null)
  // histórico de cancelados: o que está marcado para apagar e qual confirmação está aberta
  const [selecionados, mudar_selecionados] = useState([])
  const [confirmando_apagar, mudar_confirmando_apagar] = useState(null)
  const hoje = hoje_iso()

  function trocar_filtro(id) {
    mudar_filtro(id)
    mudar_selecionados([])
    mudar_confirmando_apagar(null)
  }

  function alternar_seleção(código) {
    mudar_selecionados((lista) => (lista.includes(código) ? lista.filter((c) => c !== código) : [...lista, código]))
  }

  function apagar_e_limpar(códigos) {
    apagar(códigos)
    mudar_selecionados((lista) => lista.filter((c) => !códigos.includes(c)))
    mudar_confirmando_apagar(null)
  }

  function categoria(a) {
    if (a.status === 'cancelado') return 'cancelados'
    return a.data >= hoje ? 'próximos' : 'passados'
  }

  const contagem = Object.fromEntries(filtros.map((f) => [f.id, agendamentos.filter((a) => categoria(a) === f.id).length]))
  const lista = agendamentos
    .filter((a) => categoria(a) === filtro)
    .sort((x, y) => {
      const ordem = `${x.data}${x.hora}`.localeCompare(`${y.data}${y.hora}`)
      return filtro === 'próximos' ? ordem : -ordem
    })

  return (
    <div className="página página-agendamentos">
      <header className="página-topo">
        <Voltar ao_clicar={() => ir_para('início')} rótulo="voltar ao início" />
        <p className="sobretítulo">sua agenda</p>
        <h1>Agendamentos</h1>
      </header>

      <div className="abas" role="tablist">
        {filtros.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filtro === f.id}
            className={`aba ${filtro === f.id ? 'ativa' : ''}`}
            onClick={() => trocar_filtro(f.id)}
          >
            {f.rótulo} <span>{contagem[f.id]}</span>
          </button>
        ))}
      </div>

      {lista.length === 0 && (
        <div className="lista-vazia">
          <p>{mensagens_vazio[filtro]}</p>
          {filtro === 'próximos' && (
            <button className="botão principal" onClick={() => ir_para('dentista')}>
              Agendar consulta
            </button>
          )}
        </div>
      )}

      {filtro === 'cancelados' && lista.length > 0 && (
        <div className="barra-histórico">
          <label className="selecionar-todos">
            <input
              type="checkbox"
              checked={selecionados.length === lista.length}
              ref={(el) => {
                if (el) el.indeterminate = selecionados.length > 0 && selecionados.length < lista.length
              }}
              onChange={() =>
                mudar_selecionados(selecionados.length === lista.length ? [] : lista.map((a) => a.código))
              }
            />
            Selecionar todos
          </label>

          {confirmando_apagar === 'selecionados' ? (
            <div className="confirmar-cancelamento" role="alert">
              <span>
                Apagar {selecionados.length} do histórico? Não dá pra desfazer.
              </span>
              <button className="botão perigo" onClick={() => apagar_e_limpar(selecionados)}>
                Sim, apagar
              </button>
              <button className="botão fantasma" onClick={() => mudar_confirmando_apagar(null)}>
                Não
              </button>
            </div>
          ) : (
            <button
              className="botão fantasma apagar-selecionados"
              disabled={selecionados.length === 0}
              onClick={() => mudar_confirmando_apagar('selecionados')}
            >
              <Trash2 size={14} strokeWidth={2} aria-hidden="true" /> Apagar selecionados
              {selecionados.length > 0 && ` (${selecionados.length})`}
            </button>
          )}
        </div>
      )}

      <ul className="agenda">
        {lista.map((a) => {
          const dia = de_iso(a.data)
          const cancelado = a.status === 'cancelado'
          return (
            <li
              key={a.código}
              className={`item ${cancelado ? 'cancelado com-seleção' : ''} ${selecionados.includes(a.código) ? 'marcado' : ''}`}
            >
              {cancelado && (
                <input
                  type="checkbox"
                  className="item-seleção"
                  checked={selecionados.includes(a.código)}
                  onChange={() => alternar_seleção(a.código)}
                  aria-label={`selecionar ${a.procedimento} de ${data_por_extenso(a.data)}`}
                />
              )}
              <div className="item-data" aria-hidden="true">
                <span>{dia.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                <strong>{dia.getDate()}</strong>
                <span>{dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
              </div>

              <div className="item-info">
                <h3>{a.procedimento}</h3>
                <p className="item-linha">
                  <UserRound size={14} strokeWidth={1.75} aria-hidden="true" /> {a.dentista}
                </p>
                <p className="item-linha item-quando">
                  <Clock3 size={14} strokeWidth={1.75} aria-hidden="true" /> {data_por_extenso(a.data)}, às {a.hora}
                </p>
                <p className="item-código">
                  Código <strong>{a.código}</strong> · {moeda(a.valor)}
                </p>
              </div>

              {categoria(a) === 'próximos' && (
                <div className="item-ações">
                  {pode_cancelar(a, prazo_cancelamento_horas) ? (
                    <p className="prazo">
                      <CalendarClock size={14} strokeWidth={1.75} aria-hidden="true" />
                      Cancele até {data_hora_curta(limite_cancelamento(a, prazo_cancelamento_horas))}
                    </p>
                  ) : (
                    <p className="prazo">
                      <LockKeyhole size={14} strokeWidth={1.75} aria-hidden="true" />
                      Cancelamento só até {prazo_cancelamento_horas}h antes. Remarcar continua liberado.
                    </p>
                  )}
                  {confirmando === a.código ? (
                    <div className="confirmar-cancelamento" role="alert">
                      <span>Cancelar mesmo?</span>
                      <button
                        className="botão perigo"
                        onClick={() => {
                          cancelar(a.código)
                          mudar_confirmando(null)
                        }}
                      >
                        Sim, cancelar
                      </button>
                      <button className="botão fantasma" onClick={() => mudar_confirmando(null)}>
                        Não
                      </button>
                    </div>
                  ) : (
                    <div className="item-botões">
                      <button className="botão principal" onClick={() => ir_para('dentista', { remarcar: a.código })}>
                        Remarcar
                      </button>
                      {pode_cancelar(a, prazo_cancelamento_horas) && (
                        <button className="botão fantasma" onClick={() => mudar_confirmando(a.código)}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  )}
                  {/* depois de remarcar, dá pra pôr a data nova na agenda */}
                  <AdicionarAgenda agendamento={a} compacto />
                </div>
              )}
              {cancelado && (
                <div className="item-ações">
                  {confirmando_apagar === a.código ? (
                    <div className="confirmar-cancelamento" role="alert">
                      <span>Apagar do histórico?</span>
                      <button className="botão perigo" onClick={() => apagar_e_limpar([a.código])}>
                        Sim, apagar
                      </button>
                      <button className="botão fantasma" onClick={() => mudar_confirmando_apagar(null)}>
                        Não
                      </button>
                    </div>
                  ) : (
                    <button className="botão fantasma apagar-um" onClick={() => mudar_confirmando_apagar(a.código)}>
                      <Trash2 size={14} strokeWidth={2} aria-hidden="true" /> Apagar
                    </button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
