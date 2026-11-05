import { createPortal } from 'react-dom'
import { CalendarDays, House } from 'lucide-react'
import Logo from './logo.jsx'
import { Dente } from './ícone.jsx'

const itens = [
  { id: 'início', rótulo: 'Início', Ícone: House },
  { id: 'dentista', rótulo: 'Dentista', Ícone: Dente },
  { id: 'agendamentos', rótulo: 'Agendamentos', Ícone: CalendarDays },
]

export default function Cabeçalho({ tela, ir_para, próximos }) {
  return (
    <>
    <header className="cabeçalho">
      <div className="cabeçalho-interno">
        <button className="marca" onClick={() => ir_para('início')} aria-label="ir para o início">
          <Logo />
        </button>

        <nav aria-label="principal" className="navegação-principal">
          <ul className="menu">
            {itens.map((item) => (
              <li key={item.id}>
                <button
                  className={`menu-item ${tela === item.id ? 'ativo' : ''}`}
                  aria-current={tela === item.id ? 'page' : undefined}
                  onClick={() => ir_para(item.id)}
                >
                  {item.rótulo}
                  {item.id === 'agendamentos' && próximos > 0 && (
                    <span className="contador" aria-label={`${próximos} próximos`}>
                      {próximos}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </header>

    {/* no celular o menu vira abas fixas embaixo, como num app.
        fica fora do header porque o blur do header quebra position: fixed */}
    {createPortal(
      <nav aria-label="principal no celular" className="abas-celular">
        {itens.map(({ id, rótulo, Ícone }) => (
          <button
            key={id}
            className={`aba-celular ${tela === id ? 'ativa' : ''}`}
            aria-current={tela === id ? 'page' : undefined}
            onClick={() => ir_para(id)}
          >
            <span className="aba-celular-ícone">
              <Ícone size={21} strokeWidth={tela === id ? 2.2 : 1.8} aria-hidden="true" />
              {id === 'agendamentos' && próximos > 0 && <span className="aba-contador">{próximos}</span>}
            </span>
            {rótulo}
          </button>
        ))}
      </nav>,
      document.body,
    )}
    </>
  )
}
