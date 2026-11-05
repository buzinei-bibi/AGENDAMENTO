import { email_válido, mascarar_telefone, telefone_válido } from '../útil.js'

export default function Contato({ valor, ao_mudar, tentou_enviar, rótulo_observações = 'observações' }) {
  const erros = {
    nome: valor.nome.trim().length < 3 ? 'digite seu nome completo' : '',
    telefone: !telefone_válido(valor.telefone) ? 'telefone com ddd, ex.: (12) 99876-5432' : '',
    email: !email_válido(valor.email) ? 'e-mail inválido' : '',
  }

  function campo(nome, v) {
    ao_mudar({ ...valor, [nome]: v })
  }

  return (
    <div className="formulário">
      <label className="campo">
        <span>nome completo</span>
        <input
          value={valor.nome}
          onChange={(e) => campo('nome', e.target.value)}
          autoComplete="name"
          aria-invalid={tentou_enviar && !!erros.nome}
        />
        {tentou_enviar && erros.nome && <small className="erro">{erros.nome}</small>}
      </label>

      <div className="campo-duplo">
        <label className="campo">
          <span>telefone</span>
          <input
            value={valor.telefone}
            onChange={(e) => campo('telefone', mascarar_telefone(e.target.value))}
            inputMode="tel"
            autoComplete="tel"
            placeholder="(12) 99876-5432"
            aria-invalid={tentou_enviar && !!erros.telefone}
          />
          {tentou_enviar && erros.telefone && <small className="erro">{erros.telefone}</small>}
        </label>

        <label className="campo">
          <span>e-mail</span>
          <input
            type="email"
            value={valor.email}
            onChange={(e) => campo('email', e.target.value)}
            autoComplete="email"
            placeholder="seu@email.com"
            aria-invalid={tentou_enviar && !!erros.email}
          />
          {tentou_enviar && erros.email && <small className="erro">{erros.email}</small>}
        </label>
      </div>

      <label className="campo">
        <span>
          {rótulo_observações} <i>(opcional)</i>
        </span>
        <textarea rows={3} value={valor.observações} onChange={(e) => campo('observações', e.target.value)} />
      </label>
    </div>
  )
}
