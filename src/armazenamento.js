// guarda os agendamentos no localStorage do navegador

const chave = 'agendamentos'

export function ler_agendamentos() {
  try {
    const bruto = localStorage.getItem(chave)
    return bruto ? JSON.parse(bruto) : []
  } catch {
    return []
  }
}

export function salvar_agendamentos(lista) {
  try {
    localStorage.setItem(chave, JSON.stringify(lista))
  } catch {
    // navegador sem armazenamento: segue só em memória
  }
}

export function gerar_código(prefixo) {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let código = ''
  for (let i = 0; i < 6; i++) código += letras[Math.floor(Math.random() * letras.length)]
  return `${prefixo}-${código}`
}
