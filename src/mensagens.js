// mensagens de whatsapp, no formato aprovado pelo gabriel:
// tudo em maiúsculo, saudação em negrito (*texto* = negrito no whatsapp)
import { nome_clínica } from './dados.js'

const clínica = nome_clínica.toLocaleUpperCase('pt-BR')

// botão do cabeçalho: o whatsapp abre com esse texto já escrito na caixa;
// a paciente pode apagar e escrever o que quiser antes de enviar.
// sem negrito e sem sorriso
export function mensagem_contato() {
  return `SEJA BEM-VINDO NA ${clínica}, COMO PODEMOS TE AJUDAR HOJE?`
}

// resposta automática de boas-vindas quando alguém manda mensagem pro consultório.
// o site não envia: copie este texto no whatsapp business, em
// ferramentas comerciais → mensagem de saudação (é grátis e sai sozinha)
export const mensagem_saudação = [
  `*OLÁ! BOAS-VINDAS À ${clínica}*`,
  '',
  'QUE BOM TER VOCÊ POR AQUI.',
  'SEU SORRISO É A PRIMEIRA COISA QUE AS PESSOAS PERCEBEM EM VOCÊ, E CUIDAR DELE É CUIDAR DE VOCÊ.',
  '',
  'CONTA PRA GENTE COMO PODEMOS AJUDAR QUE JÁ JÁ RESPONDEMOS.',
  '',
  `*${clínica}*`,
].join('\n')
