import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, LayoutGrid, Search, SlidersHorizontal, X } from 'lucide-react'

// busca + filtro + ver todos, na mesma linha do título "qual tratamento?"
// (o css usa display: contents para os itens entrarem na grade da .título-linha)
export default function BarraTratamentos({ busca, ao_buscar, filtro, ao_filtrar, opções, total }) {
  const [aberto, mudar_aberto] = useState(false)
  const caixa = useRef(null)
  const campo = useRef(null)
  // no celular o texto de dica precisa ser curto para não ser cortado
  const [celular, mudar_celular] = useState(() => window.matchMedia('(max-width: 640px)').matches)

  useEffect(() => {
    const consulta = window.matchMedia('(max-width: 640px)')
    const ao_mudar = () => mudar_celular(consulta.matches)
    consulta.addEventListener('change', ao_mudar)
    return () => consulta.removeEventListener('change', ao_mudar)
  }, [])

  // fecha o menu do filtro ao clicar fora ou apertar esc
  useEffect(() => {
    if (!aberto) return
    function fora(e) {
      if (!caixa.current?.contains(e.target)) mudar_aberto(false)
    }
    function tecla(e) {
      if (e.key === 'Escape') mudar_aberto(false)
    }
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  const buscando = busca.trim().length > 0
  const atual = opções.find((o) => o.id === filtro)
  const filtrando = !buscando && atual && filtro !== 'mais pedidos'

  function escolher(id) {
    ao_filtrar(id)
    mudar_aberto(false)
  }

  return (
    <div className="barra-tratamentos">
      <div className="busca-tratamento">
        <input
          ref={campo}
          type="search"
          value={busca}
          onChange={(e) => ao_buscar(e.target.value)}
          placeholder={celular ? 'buscar' : 'buscar tratamento'}
          aria-label="buscar tratamento ou exame"
        />
        {buscando && (
          <button className="limpar-busca" onClick={() => ao_buscar('')} aria-label="limpar busca">
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
        <button className="botão-lupa" onClick={() => campo.current?.focus()} aria-label="buscar" tabIndex={-1}>
          <Search size={17} strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>

      <div className="filtro-caixa" ref={caixa}>
        <button
          className={`botão-barra ${filtrando ? 'ligado' : ''}`}
          aria-haspopup="true"
          aria-expanded={aberto}
          onClick={() => mudar_aberto((a) => !a)}
        >
          <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
          <span className="botão-barra-texto">{filtrando ? atual.nome : 'filtrar'}</span>
          <ChevronDown size={14} strokeWidth={2.25} aria-hidden="true" className="seta-filtro" />
        </button>

        {aberto && (
          <div className="menu-filtro" role="menu" aria-label="filtrar por tipo">
            {opções.map((o) => {
              const marcado = !buscando && filtro === o.id
              return (
                <button key={o.id} role="menuitemradio" aria-checked={marcado} className="opção-filtro" onClick={() => escolher(o.id)}>
                  <span>{o.nome}</span>
                  <span className="opção-quantidade">{o.quantidade}</span>
                  <span className="opção-check">{marcado && <Check size={14} strokeWidth={3} aria-hidden="true" />}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button
        className={`botão-barra ${!buscando && filtro === 'todos' ? 'ligado' : ''}`}
        aria-pressed={!buscando && filtro === 'todos'}
        onClick={() => ao_filtrar(filtro === 'todos' ? 'mais pedidos' : 'todos')}
      >
        <LayoutGrid size={16} strokeWidth={2} aria-hidden="true" />
        <span className="botão-barra-texto">ver todos</span>
        <span className="quantidade">{total}</span>
      </button>
    </div>
  )
}
