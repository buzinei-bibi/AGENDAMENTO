import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Accessibility, Check, RotateCcw, X } from 'lucide-react'
import {
  aplicar_acessibilidade,
  é_padrão,
  ler_acessibilidade,
  modos_cor,
  padrão,
  salvar_acessibilidade,
  tamanhos_texto,
} from '../acessibilidade.js'

const opções_leitura = [
  { campo: 'espaçamento', nome: 'espaçamento maior', descrição: 'mais ar entre letras, palavras e linhas' },
  { campo: 'máscara', nome: 'máscara de leitura', descrição: 'escurece tudo, menos a faixa onde está o mouse' },
  { campo: 'cursor', nome: 'cursor grande', descrição: 'seta maior e com contorno' },
  { campo: 'destacar', nome: 'destacar links e botões', descrição: 'sublinha links e reforça o foco do teclado' },
  { campo: 'parar_animações', nome: 'parar animações', descrição: 'tira movimentos e transições' },
]

// bola fixa à direita, no meio da altura da tela; o painel abre como uma coluna alta por cima dela
export default function MenuAcessibilidade() {
  const [aberto, mudar_aberto] = useState(false)
  const [preferências, mudar_preferências] = useState(ler_acessibilidade)
  const botão = useRef(null)
  const painel = useRef(null)
  const título_id = useId()

  useEffect(() => {
    aplicar_acessibilidade(preferências)
    salvar_acessibilidade(preferências)
  }, [preferências])

  useEffect(() => {
    if (!aberto) return
    painel.current?.querySelector('input:checked')?.focus()

    function tecla(evento) {
      if (evento.key === 'Escape') {
        mudar_aberto(false)
        botão.current?.focus()
      }
    }
    function clique(evento) {
      if (!painel.current?.contains(evento.target) && !botão.current?.contains(evento.target)) mudar_aberto(false)
    }
    document.addEventListener('keydown', tecla)
    document.addEventListener('pointerdown', clique)
    return () => {
      document.removeEventListener('keydown', tecla)
      document.removeEventListener('pointerdown', clique)
    }
  }, [aberto])

  function mudar(campo, valor) {
    mudar_preferências((atual) => ({ ...atual, [campo]: valor }))
  }

  const alterado = !é_padrão(preferências)

  return (
    <>
      <button
        ref={botão}
        className={`botão-acessibilidade ${aberto ? 'aberto' : ''}`}
        onClick={() => mudar_aberto((a) => !a)}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        aria-label="acessibilidade: cores, tamanho do texto e leitura"
      >
        <Accessibility size={20} strokeWidth={2} aria-hidden="true" />
        {alterado && <span className="acessibilidade-ponto" aria-hidden="true" />}
      </button>

      {aberto &&
        createPortal(
          <>
            <section
              ref={painel}
              className="acessibilidade-painel"
              role="dialog"
              aria-labelledby={título_id}
            >
              <header className="acessibilidade-topo">
                <h2 id={título_id}>acessibilidade</h2>
                <button
                  className="acessibilidade-fechar"
                  onClick={() => {
                    mudar_aberto(false)
                    botão.current?.focus()
                  }}
                  aria-label="fechar acessibilidade"
                >
                  <X size={15} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </header>

              <fieldset className="acessibilidade-grupo">
                <legend>cores</legend>
                <div className="opções-cor">
                  {modos_cor.map((modo) => (
                    <label key={modo.id} className="opção-cor" title={modo.descrição}>
                      <input
                        type="radio"
                        name="acessibilidade-cores"
                        value={modo.id}
                        checked={preferências.cores === modo.id}
                        onChange={() => mudar('cores', modo.id)}
                      />
                      <span className={`amostra amostra-${modo.id}`} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="opção-cor-texto">
                        <strong>{modo.nome}</strong>
                        <span className="só-leitor">: {modo.descrição}</span>
                      </span>
                      <Check className="opção-cor-marca" size={10} strokeWidth={3.5} aria-hidden="true" />
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="acessibilidade-grupo">
                <legend>tamanho do texto</legend>
                <div className="opções-texto">
                  {tamanhos_texto.map((tamanho, índice) => (
                    <label key={tamanho.valor} className="opção-texto">
                      <input
                        type="radio"
                        name="acessibilidade-texto"
                        value={tamanho.valor}
                        checked={preferências.texto === tamanho.valor}
                        onChange={() => mudar('texto', tamanho.valor)}
                      />
                      <span className="opção-texto-letra" style={{ fontSize: 11 + índice * 3 }} aria-hidden="true">
                        a
                      </span>
                      <span className="opção-texto-valor">{tamanho.nome}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="acessibilidade-grupo">
                <legend>leitura e navegação</legend>
                <div className="opções-leitura">
                  {opções_leitura.map((opção) => (
                    <label key={opção.campo} className="opção-leitura" title={opção.descrição}>
                      <span className="opção-leitura-texto">
                        <strong>{opção.nome}</strong>
                        <span className="só-leitor">: {opção.descrição}</span>
                      </span>
                      <input
                        type="checkbox"
                        role="switch"
                        checked={preferências[opção.campo]}
                        onChange={(evento) => mudar(opção.campo, evento.target.checked)}
                      />
                      <span className="chave" aria-hidden="true" />
                    </label>
                  ))}
                </div>
              </fieldset>

              <button className="acessibilidade-restaurar" onClick={() => mudar_preferências({ ...padrão })} disabled={!alterado}>
                <RotateCcw size={12} strokeWidth={2.4} aria-hidden="true" />
                restaurar padrão
              </button>
            </section>
          </>,
          document.body,
        )}

      {preferências.máscara && <MáscaraLeitura />}
    </>
  )
}

// faixa clara que segue o mouse (ou o foco do teclado); o resto da tela fica escurecido
function MáscaraLeitura() {
  const máscara = useRef(null)

  useEffect(() => {
    function posicionar(y) {
      máscara.current?.style.setProperty('--máscara-y', `${Math.round(y)}px`)
    }
    posicionar(window.innerHeight / 2)
    const mover = (evento) => posicionar(evento.clientY)
    const focar = (evento) => {
      const caixa = evento.target.getBoundingClientRect?.()
      if (caixa && caixa.height) posicionar(caixa.top + caixa.height / 2)
    }
    window.addEventListener('pointermove', mover, { passive: true })
    document.addEventListener('focusin', focar)
    return () => {
      window.removeEventListener('pointermove', mover)
      document.removeEventListener('focusin', focar)
    }
  }, [])

  return createPortal(
    <div ref={máscara} className="máscara-leitura" aria-hidden="true">
      <div className="máscara-cima" />
      <div className="máscara-baixo" />
    </div>,
    document.body,
  )
}
