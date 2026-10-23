import { useTituloPagina } from '@/hooks/useTituloPagina'

export function Privacidade() {
  useTituloPagina('Privacidade')

  return (
    <article className="mx-auto max-w-prose px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">Privacidade</h1>

      <p className="mt-6 text-lg text-tinta-suave">
        Informação de saúde é dado pessoal sensível pela Lei Geral de Proteção de Dados. Este
        projeto foi construído para coletar o mínimo possível.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">
        Para onde vão os dados do formulário
      </h2>
      <p className="mt-3 text-tinta-suave">
        Para nenhum lugar. Não existe servidor neste projeto. O que você digita no formulário de
        agendamento fica apenas no seu navegador, enquanto a página estiver aberta, e serve só
        para demonstrar a interface.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">O que não é pedido</h2>
      <ul className="mt-3 space-y-2 text-tinta-suave">
        <li>Nenhuma informação clínica, sintoma, diagnóstico ou medicamento.</li>
        <li>Nenhum CPF, cartão SUS ou documento de identificação.</li>
        <li>Nenhuma senha, já que não há conta de usuário.</li>
      </ul>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">
        Serviços externos que o site consulta
      </h2>
      <p className="mt-3 text-tinta-suave">
        Para mostrar o mapa e procurar unidades, o site faz requisições a serviços públicos do
        OpenStreetMap. Esses serviços recebem o endereço IP do seu navegador e o termo buscado,
        como acontece em qualquer requisição na web. O site não envia a eles nenhum dado seu
        além disso.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">
        Armazenamento no navegador
      </h2>
      <p className="mt-3 text-tinta-suave">
        O armazenamento local do navegador não é um lugar seguro: outra pessoa com acesso ao
        mesmo dispositivo pode ler o que está guardado ali. Por isso ele não é usado para
        nenhuma informação sensível.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">
        Limitação de um projeto acadêmico
      </h2>
      <p className="mt-3 text-tinta-suave">
        Este site não tem política de privacidade institucional, encarregado de dados, nem
        canal formal de requisição de titular. É um exercício de disciplina, e não deve ser
        usado como serviço real de saúde.
      </p>
    </article>
  )
}
