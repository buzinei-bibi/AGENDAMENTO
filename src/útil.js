import { horários_do_dia } from './dados.js'

// datas são guardadas como texto 'aaaa-mm-dd' para não sofrer com fuso horário

export function hoje_iso() {
  return para_iso(new Date())
}

export function para_iso(data) {
  const a = data.getFullYear()
  const m = String(data.getMonth() + 1).padStart(2, '0')
  const d = String(data.getDate()).padStart(2, '0')
  return `${a}-${m}-${d}`
}

export function de_iso(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export function diferença_dias(início, fim) {
  return Math.round((de_iso(fim) - de_iso(início)) / 86400000)
}

export function data_por_extenso(iso) {
  return de_iso(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function data_curta(iso) {
  return de_iso(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

export function moeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function plural(n, um, vários) {
  return `${n} ${n === 1 ? um : vários}`
}

// "ocupação" determinística para simular uma agenda real: mesmo dia + profissional + horário sempre dá o mesmo resultado
export function horário_ocupado_pela_clínica(profissional_id, iso, hora) {
  const texto = `${profissional_id}|${iso}|${hora}`
  // fnv-1a + embaralhamento final: espalha os ocupados pelo dia em vez de agrupar
  let h = 2166136261
  for (const c of texto) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) % 100 < 28
}

export function telefone_válido(tel) {
  return tel.replace(/\D/g, '').length >= 10
}

export function email_válido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function contato_válido(c) {
  return c.nome.trim().length >= 3 && telefone_válido(c.telefone) && email_válido(c.email)
}

export function mascarar_telefone(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 11)
  if (n.length <= 2) return n
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
}

// horários do dia: domingo fechado, sábado só de manhã
export function horários_para(iso) {
  const dia = de_iso(iso).getDay()
  if (dia === 0) return []
  return dia === 6 ? horários_do_dia.filter((h) => h < '12:00') : horários_do_dia
}

// livre = não ocupado pela clínica, não passou (com 1h de folga) e ninguém marcou aqui
export function horário_livre(profissional_id, iso, hora, agendamentos) {
  if (horário_ocupado_pela_clínica(profissional_id, iso, hora)) return false
  if (iso === hoje_iso()) {
    const agora = new Date()
    const [hh, mm] = hora.split(':').map(Number)
    if (hh * 60 + mm <= agora.getHours() * 60 + agora.getMinutes() + 60) return false
  }
  return !agendamentos.some(
    (a) => a.status === 'ativo' && a.profissional_id === profissional_id && a.data === iso && a.hora === hora,
  )
}

export function próximo_horário_livre(profissional_id, agendamentos, dias = 14) {
  let iso = hoje_iso()
  for (let i = 0; i < dias; i++) {
    const hora = horários_para(iso).find((h) => horário_livre(profissional_id, iso, h, agendamentos))
    if (hora) return { data: iso, hora }
    const d = de_iso(iso)
    d.setDate(d.getDate() + 1)
    iso = para_iso(d)
  }
  return null
}

// "hoje", "amanhã" ou "sex, 7 nov"
export function dia_relativo(iso) {
  const hoje = hoje_iso()
  const amanhã = de_iso(hoje)
  amanhã.setDate(amanhã.getDate() + 1)
  if (iso === hoje) return 'hoje'
  if (iso === para_iso(amanhã)) return 'amanhã'
  return de_iso(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '')
}

// link que abre o whatsapp com a mensagem já escrita (wa.me é o endereço oficial do whatsapp)
export function link_whatsapp(número, mensagem) {
  const destino = número.replace(/\D/g, '')
  return `https://wa.me/${destino}?text=${encodeURIComponent(mensagem)}`
}

// data ('aaaa-mm-dd') + hora ('hh:mm') viram um Date
export function data_hora(iso, hora) {
  const d = de_iso(iso)
  const [hh, mm] = hora.split(':').map(Number)
  d.setHours(hh, mm, 0, 0)
  return d
}

// último momento em que a consulta ainda pode ser cancelada
export function limite_cancelamento(agendamento, horas) {
  return new Date(data_hora(agendamento.data, agendamento.hora).getTime() - horas * 3600000)
}

export function pode_cancelar(agendamento, horas) {
  return new Date() <= limite_cancelamento(agendamento, horas)
}

// "sex, 6 nov, 08:00"
export function data_hora_curta(data) {
  const dia = data.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '')
  const hora = `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`
  return `${dia}, ${hora}`
}
