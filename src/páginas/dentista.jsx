import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Star, UserRound, X } from 'lucide-react'
import Etapas from '../componentes/etapas.jsx'
import BarraTratamentos from '../componentes/barra-tratamentos.jsx'
import Calendário from '../componentes/calendário.jsx'
import Contato from '../componentes/contato.jsx'
import Confirmado from '../componentes/confirmado.jsx'
import Ícone from '../componentes/ícone.jsx'
import Voltar from '../componentes/voltar.jsx'
import { dentistas, procedimentos, tipos } from '../dados.js'
import { gerar_código } from '../armazenamento.js'
import { contato_válido, data_por_extenso, horário_livre, horários_para, moeda, plural } from '../útil.js'

const nomes_etapas = ['tratamento', 'dentista', 'data e hora', 'seus dados']
// dentista e data/hora não têm título: a etapa já diz o que é
const títulos_etapas = ['Qual tratamento?', null, null, 'Seus dados']
const contato_vazio = { nome: '', telefone: '', email: '', observações: '' }

// filtros do passo "tratamento" (barra no header): abre nos 3 mais pedidos
const filtros = [
  { id: 'mais pedidos', nome: 'Mais pedidos', quantidade: procedimentos.filter((p) => p.mais_pedido).length },
  ...tipos.map((t) => ({ ...t, quantidade: procedimentos.filter((p) => p.tipo === t.id).length })),
]

const cores_avatar = ['prevenção', 'tratamento', 'estética', 'exame', 'crianças']

function título_da_lista(filtro) {
  if (filtro === 'todos') return 'todos os tratamentos e exames'
  return filtros.find((f) => f.id === filtro)?.nome ?? ''
}

// busca sem ligar para acento nem maiúscula ("protese" acha "Prótese")
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim()
}

function minutos(duração) {
  return parseInt(duração, 10) || 0
}

// ids dos tratamentos de um agendamento antigo (antes era um só, por nome ou id)
function ids_do_agendamento(a) {
  if (a.procedimento_ids?.length) return a.procedimento_ids
  const id = a.procedimento_id ?? procedimentos.find((p) => p.nome === a.procedimento)?.id
  return id ? [id] : []
}

// "pré" chega da home (só o tratamento, ou um horário inteiro)
// ou de agendamentos ("remarcar": abre direto na escolha de data e hora)
function etapa_inicial(pré) {
  if (pré?.remarcar) return 2
  if (pré?.hora) return 3
  if (pré?.item_id) return 1
  return 0
}

export default function Dentista({ pré, agendamentos, adicionar, remarcar, ir_para }) {
  const original = pré?.remarcar ? agendamentos.find((a) => a.código === pré.remarcar) : null
  const remarcando = !!original

  const [etapa, mudar_etapa] = useState(etapa_inicial(pré))
  const [itens_ids, mudar_itens_ids] = useState(pré?.item_id ? [pré.item_id] : original ? ids_do_agendamento(original) : [])
  const [filtro, mudar_filtro] = useState('mais pedidos')
  const [busca, mudar_busca] = useState('')
  const [profissional_id, mudar_profissional_id] = useState(pré?.profissional_id ?? original?.profissional_id ?? null)
  const [data, mudar_data] = useState(pré?.data ?? null)
  const [hora, mudar_hora] = useState(pré?.hora ?? null)
  const [contato, mudar_contato] = useState(contato_vazio)
  const [tentou, mudar_tentou] = useState(false)
  const [confirmado, mudar_confirmado] = useState(null)
  // tocou num horário livre na home: tudo já vem escolhido, então a consulta aparece em cima dos dados

  // na ordem do catálogo, não na ordem em que a pessoa tocou
  const escolhidos = procedimentos.filter((p) => itens_ids.includes(p.id))
  const nomes_escolhidos = escolhidos.map((p) => p.nome).join(' + ')
  const duração_total = `${escolhidos.reduce((t, p) => t + minutos(p.duração), 0)} min`
  const valor_total = escolhidos.reduce((t, p) => t + p.valor, 0)
  const dentista = dentistas.find((d) => d.id === profissional_id)
  const disponíveis = dentistas.filter((d) => itens_ids.every((id) => d.atende.includes(id)))

  const termo = normalizar(busca)
  const visíveis = procedimentos.filter((p) => {
    if (termo) return [p.nome, p.descrição, tipos.find((t) => t.id === p.tipo)?.nome ?? ''].some((t) => normalizar(t).includes(termo))
    if (filtro === 'mais pedidos') return p.mais_pedido
    if (filtro === 'todos') return true
    return p.tipo === filtro
  })

  // em "ver todos" e na busca, os blocos vêm agrupados por categoria (uma cor por fileira),
  // na ordem de tipos: prevenção, exames, tratamento, estética, crianças
  const agrupar = termo || filtro === 'todos'
  const grupos = agrupar
    ? tipos
        .map((t) => ({ id: t.id, nome: t.nome, itens: visíveis.filter((p) => p.tipo === t.id) }))
        .filter((g) => g.itens.length)
    : visíveis.length
      ? [{ id: 'único', nome: null, itens: visíveis }]
      : []

  function ocupado(iso, h) {
    return !horário_livre(profissional_id, iso, h, agendamentos)
  }

  function dia_sem_vaga(iso) {
    return horários_para(iso).every((h) => ocupado(iso, h))
  }

  // marca ou desmarca: dá pra levar mais de um tratamento na mesma consulta
  function alternar_procedimento(id) {
    mudar_itens_ids((atuais) => {
      const novos = atuais.includes(id) ? atuais.filter((i) => i !== id) : [...atuais, id]
      if (dentista && !novos.every((i) => dentista.atende.includes(i))) mudar_profissional_id(null)
      return novos
    })
    mudar_data(null)
    mudar_hora(null)
  }

  function escolher_filtro(id) {
    mudar_filtro(id)
    mudar_busca('')
  }

  function escolher_dentista(id) {
    mudar_profissional_id(id)
    mudar_data(null)
    mudar_hora(null)
  }

  function confirmar() {
    mudar_tentou(true)
    if (!contato_válido(contato)) return
    const novo = {
      código: gerar_código('DEN'),
      procedimento_id: escolhidos[0].id,
      procedimento_ids: escolhidos.map((p) => p.id),
      procedimento: nomes_escolhidos,
      profissional_id,
      dentista: dentista.nome,
      data,
      hora,
      valor: valor_total,
      duração: duração_total,
      contato,
    }
    adicionar(novo)
    mudar_confirmado(novo)
  }

  function confirmar_remarcação() {
    remarcar(original.código, data, hora)
    mudar_confirmado({ ...original, data, hora })
  }

  function recomeçar() {
    mudar_etapa(0)
    mudar_itens_ids([])
    mudar_filtro('mais pedidos')
    mudar_busca('')
    mudar_profissional_id(null)
    mudar_data(null)
    mudar_hora(null)
    mudar_contato(contato_vazio)
    mudar_tentou(false)
    mudar_confirmado(null)
  }

  // cartão "sua consulta": pequeno, ao lado da etapa no computador e em cima dela no celular
  const resumo = (
    <aside className="resumo-consulta" aria-label="resumo da consulta">
      <p className="sobretítulo">sua consulta</p>
      <dl>
        <div>
          <dt>{escolhidos.length > 1 ? 'tratamentos' : 'tratamento'}</dt>
          <dd>{nomes_escolhidos || '—'}</dd>
        </div>
        <div>
          <dt>dentista</dt>
          <dd>{dentista?.nome || '—'}</dd>
        </div>
        <div>
          <dt>data</dt>
          <dd>{data ? data_por_extenso(data) : '—'}</dd>
        </div>
        <div>
          <dt>horário</dt>
          <dd>{hora ? `${hora} · ${duração_total}` : '—'}</dd>
        </div>
      </dl>
      <div className="total">
        <span>valor</span>
        <strong>{escolhidos.length ? moeda(valor_total) : '—'}</strong>
      </div>
    </aside>
  )

  if (confirmado) {
    return (
      <div className="página">
        <Voltar
          ao_clicar={() => ir_para(remarcando ? 'agendamentos' : 'início')}
          rótulo={remarcando ? 'voltar para agendamentos' : 'voltar ao início'}
        />
        <Confirmado
          título={remarcando ? 'Consulta remarcada' : 'Consulta marcada'}
          texto={
            remarcando
              ? `tudo certo, ${confirmado.contato.nome.trim().split(/\s+/)[0]}. o novo horário já está reservado só pra você e a gente continua te esperando com o mesmo cuidado.`
              : `que bom ter você com a gente, ${confirmado.contato.nome.trim().split(/\s+/)[0]}. vamos te receber com calma e sem pressa: chegue uns 10 minutos antes e venha com tranquilidade. e lembre: um sorriso bem cuidado volta aqui a cada 6 meses.`
          }
          código={confirmado.código}
          agendamento={confirmado}
          ir_para={ir_para}
          novo={recomeçar}
          linhas={[
            [confirmado.procedimento.includes(' + ') ? 'tratamentos' : 'tratamento', confirmado.procedimento],
            ['dentista', confirmado.dentista],
            ['quando', `${data_por_extenso(confirmado.data)}, às ${confirmado.hora}`],
            ['duração', confirmado.duração],
            ['valor', moeda(confirmado.valor)],
          ]}
        />
      </div>
    )
  }

  return (
    <div className="página">
      <header className="página-topo">
        {remarcando ? (
          <Voltar ao_clicar={() => ir_para('agendamentos')} rótulo="voltar para agendamentos" />
        ) : (
          <Voltar
            ao_clicar={() => (etapa > 0 ? mudar_etapa(etapa - 1) : ir_para('início'))}
            rótulo={etapa > 0 ? 'voltar para a etapa anterior' : 'voltar ao início'}
          />
        )}
        <p className="sobretítulo">{remarcando ? `código ${original.código}` : 'dentista'}</p>
        <h1>{remarcando ? 'Remarcar consulta' : 'Agendar consulta'}</h1>
      </header>

      {!remarcando && <Etapas etapas={nomes_etapas} atual={etapa} ao_voltar_para={mudar_etapa} />}

      <div className="página-corpo">
        {resumo}

        <div className="página-principal">
          {etapa === 0 && !remarcando ? (
            <div className="título-linha">
              <h2 className="título-etapa">{títulos_etapas[0]}</h2>
              <BarraTratamentos
                busca={busca}
                ao_buscar={mudar_busca}
                filtro={filtro}
                ao_filtrar={escolher_filtro}
                opções={filtros}
                total={procedimentos.length}
              />
            </div>
          ) : (
            (remarcando || títulos_etapas[etapa]) && (
              <h2 className="título-etapa">{remarcando ? 'Escolha o novo horário' : títulos_etapas[etapa]}</h2>
            )
          )}
          {remarcando && (
            <p className="aviso-remarcar">
              horário atual: {data_por_extenso(original.data)}, às {original.hora}. o tratamento e o dentista continuam os mesmos.
            </p>
          )}

          {etapa === 0 && (
            <section className="escolha-tratamento">
              <div className="painel-tratamentos">
                <div className="cabeça-lista">
                  <span>{termo ? `busca: ${busca.trim()}` : título_da_lista(filtro)}</span>
                  <span>{visíveis.length}</span>
                </div>

                {grupos.map((g) => (
                  <section key={g.id} className={`grupo-tratamentos cor-${g.id}`} aria-label={g.nome ?? undefined}>
                    {g.nome && (
                      <div className="grupo-título">
                        <span className="grupo-ponto" aria-hidden="true" />
                        {g.nome}
                        <span className="grupo-quantidade">{g.itens.length}</span>
                      </div>
                    )}
                    <ul className="blocos-tratamentos">
                      {g.itens.map((p) => {
                        const marcado = itens_ids.includes(p.id)
                        return (
                          <li key={p.id}>
                            <button
                              className={`bloco cor-${p.tipo} ${marcado ? 'selecionado' : ''}`}
                              role="checkbox"
                              aria-checked={marcado}
                              onClick={() => alternar_procedimento(p.id)}
                            >
                              <span className="bloco-check" aria-hidden="true">
                                {marcado && <Check size={13} strokeWidth={3} />}
                              </span>
                              <span className="bloco-ícone">
                                <Ícone nome={p.ícone} tamanho={32} />
                              </span>
                              <strong>{p.nome}</strong>
                              <span className="bloco-preço">
                                {p.duração} · {moeda(p.valor)}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))}

                {!visíveis.length && (
                  <p className="vazio-tratamentos">
                    nada encontrado. tente outra palavra ou{' '}
                    <button className="link" onClick={() => escolher_filtro('todos')}>
                      veja todos
                    </button>
                  </p>
                )}
              </div>

              {visíveis.length > 0 && !termo && filtro !== 'todos' && (
                <button className="ver-todos" onClick={() => escolher_filtro('todos')}>
                  ver todos os tratamentos e exames ({procedimentos.length})
                </button>
              )}

              <div className="barra-escolhidos">
                {escolhidos.length ? (
                  <ul className="escolhidos" aria-label="tratamentos escolhidos">
                    {escolhidos.map((p) => (
                      <li key={p.id}>
                        {p.nome}
                        <button onClick={() => alternar_procedimento(p.id)} aria-label={`tirar ${p.nome}`}>
                          <X size={12} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="nada-escolhido">nenhum tratamento escolhido</span>
                )}
                {escolhidos.length > 0 && (
                  <span className="total-escolhidos">
                    <span>
                      {plural(escolhidos.length, 'tratamento', 'tratamentos')} · {duração_total}
                    </span>
                    <strong>{moeda(valor_total)}</strong>
                  </span>
                )}
                <button className="botão principal" disabled={!escolhidos.length} onClick={() => mudar_etapa(1)}>
                  <span className="só-computador">escolher dentista</span>
                  <span className="só-celular">continuar</span> <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {etapa === 1 && (
            <section>
              {!disponíveis.length && (
                <p className="vazio-tratamentos">
                  nenhum dentista faz todos esses tratamentos na mesma consulta. volte e tire um deles, ou marque em
                  consultas separadas.
                </p>
              )}
              <div className="lista-profissionais">
                {disponíveis.map((d) => (
                  <button
                    key={d.id}
                    className={`profissional ${profissional_id === d.id ? 'selecionado' : ''}`}
                    aria-pressed={profissional_id === d.id}
                    onClick={() => escolher_dentista(d.id)}
                  >
                    <span className={`avatar cor-${cores_avatar[dentistas.indexOf(d) % cores_avatar.length]}`} aria-hidden="true">
                      <UserRound size={24} strokeWidth={1.9} />
                    </span>
                    <span className="profissional-info">
                      <strong>{d.nome}</strong>
                      <span>{d.especialidade}</span>
                      <span className="registro">{d.registro}</span>
                    </span>
                    <span className="nota">
                      <Star size={14} strokeWidth={1.75} aria-hidden="true" /> {d.nota.toFixed(1).replace('.', ',')}
                    </span>
                    <span className="bloco-check profissional-check" aria-hidden="true">
                      {profissional_id === d.id && <Check size={13} strokeWidth={3} />}
                    </span>
                  </button>
                ))}
              </div>

              <div className="navegação">
                <button className="botão fantasma" onClick={() => mudar_etapa(0)}>
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> <span className="texto-voltar">voltar</span>
                </button>
                <button className="botão principal" disabled={!dentista} onClick={() => mudar_etapa(2)}>
                  <span className="só-computador">escolher data</span>
                  <span className="só-celular">continuar</span> <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {etapa === 2 && (
            <section>
              <div className="data-hora">
                <Calendário
                  selecionado={data}
                  ao_escolher={(iso) => {
                    mudar_data(iso)
                    mudar_hora(null)
                    // no celular os horários ficam embaixo do calendário: leva a pessoa até eles
                    if (window.matchMedia('(max-width: 900px)').matches) {
                      requestAnimationFrame(() =>
                        document.querySelector('.horários')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                      )
                    }
                  }}
                  desabilitar={dia_sem_vaga}
                  limite_dias={60}
                />
                <div className="horários">
                  {!data && <p className="vazio">escolha um dia no calendário para ver os horários livres.</p>}
                  {data && (
                    <>
                      <div className="hora-escolhida">
                        <p className="horários-dia">{data_por_extenso(data)}</p>
                        <div className="caixas-hora" aria-label={hora ? `horário escolhido: ${hora}` : 'nenhum horário escolhido'}>
                          <span className={hora ? 'cheia' : ''}>{hora ? hora.slice(0, 2) : '--'}</span>
                          <span className={hora ? 'cheia' : ''}>{hora ? hora.slice(3) : '--'}</span>
                        </div>
                      </div>
                      {['manhã', 'tarde'].map((turno) => {
                        const lista = horários_para(data).filter((h) => (turno === 'manhã' ? h < '12:00' : h >= '12:00'))
                        if (!lista.length) return null
                        return (
                          <div key={turno} className="turno">
                            <span className="turno-nome">{turno}</span>
                            <div className="grade-horários">
                              {lista.map((h) => {
                                const indisponível = ocupado(data, h)
                                return (
                                  <button
                                    key={h}
                                    className={`horário ${hora === h ? 'selecionado' : ''}`}
                                    disabled={indisponível}
                                    aria-pressed={hora === h}
                                    aria-label={indisponível ? `${h}, ocupado` : h}
                                    onClick={() => mudar_hora(h)}
                                  >
                                    {h}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                      <p className="legenda">horários riscados já estão ocupados. domingo fechado, sábado só de manhã.</p>
                    </>
                  )}
                </div>
              </div>
              <div className="navegação">
                <button className="botão fantasma" onClick={() => (remarcando ? ir_para('agendamentos') : mudar_etapa(1))}>
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> <span className="texto-voltar">voltar</span>
                </button>
                {remarcando ? (
                  <button className="botão principal" disabled={!data || !hora} onClick={confirmar_remarcação}>
                    <span className="só-computador">confirmar novo horário</span>
                    <span className="só-celular">confirmar</span>
                  </button>
                ) : (
                  <button className="botão principal" disabled={!data || !hora} onClick={() => mudar_etapa(3)}>
                    continuar <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                )}
              </div>
            </section>
          )}

          {etapa === 3 && (
            <section>
              <Contato
                valor={contato}
                ao_mudar={mudar_contato}
                tentou_enviar={tentou}
                rótulo_observações="sente alguma dor ou sensibilidade?"
              />

              <div className="navegação">
                <button className="botão fantasma" onClick={() => mudar_etapa(2)}>
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> <span className="texto-voltar">voltar</span>
                </button>
                <button className="botão principal" onClick={confirmar}>
                  <span className="só-computador">confirmar consulta</span>
                  <span className="só-celular">confirmar</span>
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
