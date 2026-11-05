// catálogo fixo do consultório — trocar por fetch quando existir back-end

export const nome_clínica = 'Odonto Conecta'

// tipos (categorias) da página dentista, na ordem do caminho do paciente:
// prevenir → examinar → tratar → estética → crianças. é a ordem do filtro e das fileiras em "ver todos"
export const tipos = [
  { id: 'prevenção', nome: 'Prevenção' },
  { id: 'exame', nome: 'Exames' },
  { id: 'tratamento', nome: 'Tratamento' },
  { id: 'estética', nome: 'Estética' },
  { id: 'crianças', nome: 'Crianças' },
]

// mais_pedido: true = aparece de cara, no filtro "mais pedidos" (deixar 4)
export const procedimentos = [
  { id: 'avaliação', nome: 'Avaliação', tipo: 'prevenção', mais_pedido: true, descrição: 'primeira consulta e plano de tratamento', ícone: 'prancheta', duração: '30 min', valor: 150 },
  { id: 'limpeza', nome: 'Limpeza', tipo: 'prevenção', mais_pedido: true, descrição: 'remoção de tártaro e aplicação de flúor', ícone: 'gotas', duração: '40 min', valor: 220 },
  { id: 'clareamento', nome: 'Clareamento', tipo: 'estética', mais_pedido: true, descrição: 'clareamento a laser no consultório', ícone: 'brilho', duração: '60 min', valor: 690 },
  { id: 'faceta', nome: 'Faceta de resina', tipo: 'estética', descrição: 'corrige cor, forma e pequenos espaços', ícone: 'joia', duração: '60 min', valor: 480 },
  { id: 'ortodontia', nome: 'Ortodontia', tipo: 'estética', descrição: 'manutenção de aparelho ou alinhador', ícone: 'sorriso', duração: '30 min', valor: 180 },
  { id: 'restauração', nome: 'Restauração', tipo: 'tratamento', mais_pedido: true, descrição: 'tratamento de cáries com resina', ícone: 'escudo', duração: '45 min', valor: 260 },
  { id: 'canal', nome: 'Canal', tipo: 'tratamento', descrição: 'endodontia com anestesia', ícone: 'seringa', duração: '90 min', valor: 950 },
  { id: 'extração', nome: 'Extração', tipo: 'tratamento', descrição: 'retirada de dente, inclusive siso', ícone: 'dente', duração: '45 min', valor: 300 },
  { id: 'implante', nome: 'Implante', tipo: 'tratamento', descrição: 'avaliação e planejamento de implante', ícone: 'parafuso', duração: '45 min', valor: 250 },
  { id: 'prótese', nome: 'Prótese', tipo: 'tratamento', descrição: 'coroa, ponte ou dentadura sob medida', ícone: 'dente', duração: '45 min', valor: 350 },
  { id: 'panorâmica', nome: 'Radiografia panorâmica', tipo: 'exame', descrição: 'raio-x da boca inteira em uma imagem', ícone: 'raio-x', duração: '15 min', valor: 90 },
  { id: 'periapical', nome: 'Radiografia periapical', tipo: 'exame', descrição: 'raio-x detalhado de um ou dois dentes', ícone: 'raio-x', duração: '10 min', valor: 40 },
  { id: 'tomografia', nome: 'Tomografia', tipo: 'exame', descrição: 'imagem em 3d para implante e canal', ícone: 'tomografia', duração: '20 min', valor: 280 },
  { id: 'odontopediatria', nome: 'Odontopediatria', tipo: 'crianças', descrição: 'dentista para crianças de 0 a 12 anos', ícone: 'bebê', duração: '30 min', valor: 200 },
]

export const dentistas = [
  {
    id: 'd1',
    nome: 'Dr. André Lima',
    especialidade: 'clínico geral e implantes',
    atende: ['avaliação', 'limpeza', 'restauração', 'canal', 'implante', 'extração', 'prótese', 'panorâmica', 'periapical', 'tomografia'],
    registro: 'CRO-SP 23.456',
    nota: 4.8,
  },
  {
    id: 'd2',
    nome: 'Dra. Renata Okada',
    especialidade: 'estética e odontopediatria',
    atende: ['avaliação', 'limpeza', 'clareamento', 'faceta', 'restauração', 'odontopediatria', 'panorâmica', 'periapical'],
    registro: 'CRO-SP 31.208',
    nota: 4.9,
  },
  {
    id: 'd3',
    nome: 'Dr. Paulo Mendes',
    especialidade: 'ortodontia',
    atende: ['avaliação', 'ortodontia', 'odontopediatria', 'panorâmica'],
    registro: 'CRO-SP 27.645',
    nota: 4.7,
  },
  {
    id: 'd4',
    nome: 'Dra. Sofia Martins',
    especialidade: 'endodontia',
    atende: ['canal', 'restauração', 'clareamento', 'faceta', 'implante', 'periapical', 'tomografia'],
    registro: 'CRO-SP 35.991',
    nota: 5.0,
  },
  {
    id: 'd5',
    nome: 'Dra. Beatriz Nogueira',
    especialidade: 'periodontia e ortodontia',
    atende: ['avaliação', 'limpeza', 'ortodontia', 'panorâmica', 'periapical'],
    registro: 'CRO-SP 40.112',
    nota: 4.9,
  },
  {
    id: 'd6',
    nome: 'Dr. Lucas Ferreira',
    especialidade: 'implantodontia',
    atende: ['avaliação', 'implante', 'canal', 'extração', 'prótese', 'panorâmica', 'tomografia'],
    registro: 'CRO-SP 38.770',
    nota: 4.8,
  },
]

export const horários_do_dia = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

// whatsapp do consultório: só números, com 55 + ddd (ex.: '5512900000000').
// vazio: o whatsapp abre com a mensagem escrita e a pessoa escolhe o contato
export const whatsapp_consultório = ''

// até quantas horas antes da consulta dá pra cancelar pelo site (remarcar é sempre liberado)
export const prazo_cancelamento_horas = 48
