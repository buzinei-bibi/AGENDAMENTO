import LogoWhatsapp from './logo-whatsapp.jsx'
import { whatsapp_consultório } from '../dados.js'
import { mensagem_contato } from '../mensagens.js'
import { link_whatsapp } from '../útil.js'

// bola verde fixa à direita, logo acima da bola de acessibilidade: falar com o consultório
export default function WhatsappFlutuante() {
  return (
    <a
      className="whatsapp-flutuante"
      href={link_whatsapp(whatsapp_consultório, mensagem_contato())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="falar com o consultório no whatsapp"
    >
      <LogoWhatsapp tamanho={21} />
    </a>
  )
}
