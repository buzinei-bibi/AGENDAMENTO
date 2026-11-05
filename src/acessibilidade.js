// preferências de acessibilidade: ficam no localStorage e viram atributos no <html>.
// o css faz o resto (bloco "menu de acessibilidade" no fim do estilos.css)

const chave = 'acessibilidade'

export const padrão = {
  cores: 'padrão',
  texto: 1,
  espaçamento: false,
  máscara: false,
  cursor: false,
  destacar: false,
  parar_animações: false,
}

// o primeiro é o padrão. a amostra de cada um usa a mesma regra do css (classe amostra-<id>)
export const modos_cor = [
  { id: 'padrão', nome: 'padrão', descrição: 'azul pastel do site' },
  { id: 'contraste', nome: 'alto contraste', descrição: 'preto no branco, bordas fortes' },
  { id: 'vivo', nome: 'cores vivas', descrição: 'mais saturação' },
  { id: 'suave', nome: 'cores suaves', descrição: 'menos saturação, cansa menos' },
  { id: 'cinza', nome: 'tons de cinza', descrição: 'sem nenhuma cor' },
  { id: 'quente', nome: 'luz quente', descrição: 'menos luz azul' },
]

export const tamanhos_texto = [
  { valor: 1, nome: '100%' },
  { valor: 1.15, nome: '115%' },
  { valor: 1.3, nome: '130%' },
  { valor: 1.5, nome: '150%' },
]

export function ler_acessibilidade() {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave) || '{}')
    const preferências = { ...padrão, ...salvo }
    if (!modos_cor.some((m) => m.id === preferências.cores)) preferências.cores = padrão.cores
    if (!tamanhos_texto.some((t) => t.valor === preferências.texto)) preferências.texto = padrão.texto
    return preferências
  } catch {
    return { ...padrão }
  }
}

export function salvar_acessibilidade(preferências) {
  try {
    localStorage.setItem(chave, JSON.stringify(preferências))
  } catch {
    // sem armazenamento: vale só nesta visita
  }
}

export function é_padrão(preferências) {
  return Object.keys(padrão).every((campo) => preferências[campo] === padrão[campo])
}

function marcar(raiz, nome, ligado, valor = 'sim') {
  if (ligado) raiz.setAttribute(nome, valor)
  else raiz.removeAttribute(nome)
}

export function aplicar_acessibilidade(preferências) {
  const raiz = document.documentElement
  marcar(raiz, 'data-cores', preferências.cores !== 'padrão', preferências.cores)
  raiz.style.setProperty('--escala-texto', String(preferências.texto))
  marcar(raiz, 'data-espaçamento', preferências.espaçamento)
  marcar(raiz, 'data-cursor', preferências.cursor, 'grande')
  marcar(raiz, 'data-destacar', preferências.destacar)
  marcar(raiz, 'data-movimento', preferências.parar_animações, 'parado')
}

// aplica já na carga do módulo, antes do primeiro desenho da página
aplicar_acessibilidade(ler_acessibilidade())

// o tema escuro saiu: limpa a escolha antiga
try {
  localStorage.removeItem('tema')
} catch {
  // nada a limpar
}
