import { useEffect, useState } from 'react'
import Cabeçalho from './componentes/cabeçalho.jsx'
import MenuAcessibilidade from './componentes/acessibilidade.jsx'
import WhatsappFlutuante from './componentes/whatsapp-flutuante.jsx'
import Início from './páginas/início.jsx'
import Dentista from './páginas/dentista.jsx'
import Agendamentos from './páginas/agendamentos.jsx'
import { ler_agendamentos, salvar_agendamentos } from './armazenamento.js'
import { hoje_iso } from './útil.js'

export default function App() {
  const [tela, mudar_tela] = useState('início')
  // escolha feita na home (procedimento ou horário livre): abre o agendamento já preenchido
  const [pré, mudar_pré] = useState(null)
  const [agendamentos, mudar_agendamentos] = useState(ler_agendamentos)

  useEffect(() => salvar_agendamentos(agendamentos), [agendamentos])

  function ir_para(destino, preenchido = null) {
    mudar_tela(destino)
    mudar_pré(preenchido)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function adicionar(agendamento) {
    mudar_agendamentos((lista) => [{ ...agendamento, criado_em: new Date().toISOString(), status: 'ativo' }, ...lista])
  }

  function cancelar(código) {
    mudar_agendamentos((lista) => lista.map((a) => (a.código === código ? { ...a, status: 'cancelado' } : a)))
  }

  // mesma consulta, mesmo código: só troca dia e hora
  function remarcar(código, data, hora) {
    mudar_agendamentos((lista) =>
      lista.map((a) => (a.código === código ? { ...a, data, hora, remarcado_em: new Date().toISOString() } : a)),
    )
  }

  // tira de vez do histórico (só consultas já canceladas)
  function apagar(códigos) {
    const lista_códigos = new Set(códigos)
    mudar_agendamentos((lista) => lista.filter((a) => !(lista_códigos.has(a.código) && a.status === 'cancelado')))
  }

  const hoje = hoje_iso()
  const próximos = agendamentos.filter((a) => a.status === 'ativo' && a.data >= hoje).length

  return (
    <>
      <a className="pular" href="#conteúdo">pular para o conteúdo</a>
      <Cabeçalho tela={tela} ir_para={ir_para} próximos={próximos} />
      <main id="conteúdo" tabIndex={-1}>
        {tela === 'início' && <Início ir_para={ir_para} próximos={próximos} agendamentos={agendamentos} />}
        {tela === 'dentista' && (
          <Dentista
            key={`${pré?.remarcar ?? ''}-${pré?.item_id ?? ''}-${pré?.profissional_id ?? ''}-${pré?.hora ?? ''}`}
            pré={pré}
            agendamentos={agendamentos}
            adicionar={adicionar}
            remarcar={remarcar}
            ir_para={ir_para}
          />
        )}
        {tela === 'agendamentos' && <Agendamentos agendamentos={agendamentos} cancelar={cancelar} apagar={apagar} ir_para={ir_para} />}
      </main>
      <WhatsappFlutuante />
      <MenuAcessibilidade />
    </>
  )
}
