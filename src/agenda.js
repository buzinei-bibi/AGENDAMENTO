// coloca a consulta na agenda do celular/computador
// .ics funciona no google agenda, iphone e outlook; o link do google abre direto no navegador
import { nome_clínica } from './dados.js'
import { data_hora } from './útil.js'

// quanto tempo antes o celular avisa (no próprio dia da consulta)
export const lembrete_horas_antes = 2

function minutos(duração) {
  return parseInt(duração, 10) || 30
}

// 20261107T090000 (hora local, sem fuso: o calendário usa o fuso do aparelho)
function formato_agenda(data) {
  const p = (n) => String(n).padStart(2, '0')
  return `${data.getFullYear()}${p(data.getMonth() + 1)}${p(data.getDate())}T${p(data.getHours())}${p(data.getMinutes())}00`
}

function início_e_fim(a) {
  const início = data_hora(a.data, a.hora)
  const fim = new Date(início.getTime() + minutos(a.duração) * 60000)
  return { início, fim }
}

function título(a) {
  return `${nome_clínica}: ${a.procedimento} com ${a.dentista}`.toLocaleUpperCase('pt-BR')
}

function descrição(a) {
  return [`código ${a.código}`, `duração ${a.duração}`, 'chegue uns 10 minutos antes.'].join('\n')
}

// texto do .ics precisa escapar vírgula, ponto e vírgula e quebra de linha
function escapar(texto) {
  return texto.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function arquivo_agenda(a) {
  const { início, fim } = início_e_fim(a)
  const agora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${nome_clínica}//agendamento//pt-BR`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${a.código}@agendamento-dentista`,
    `DTSTAMP:${agora}`,
    `DTSTART:${formato_agenda(início)}`,
    `DTEND:${formato_agenda(fim)}`,
    `SUMMARY:${escapar(título(a))}`,
    `DESCRIPTION:${escapar(descrição(a))}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapar(`hoje tem consulta na ${nome_clínica.toLowerCase()} às ${a.hora}`)}`,
    `TRIGGER:-PT${lembrete_horas_antes}H`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return {
    endereço: `data:text/calendar;charset=utf-8,${encodeURIComponent(linhas.join('\r\n'))}`,
    nome: `consulta-${a.código}.ics`,
  }
}

export function link_google_agenda(a) {
  const { início, fim } = início_e_fim(a)
  const parâmetros = new URLSearchParams({
    action: 'TEMPLATE',
    text: título(a),
    dates: `${formato_agenda(início)}/${formato_agenda(fim)}`,
    details: descrição(a),
    ctz: 'America/Sao_Paulo',
  })
  return `https://calendar.google.com/calendar/render?${parâmetros}`
}
