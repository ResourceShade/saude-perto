// Manifesto de rotas: define componentes preguiçosos ao lado da configuração.
// A regra react/only-export-components está desligada para este arquivo em
// .oxlintrc.json — ele não é um módulo de componentes.
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { ErroDeRota } from '@/components/estados/ErroDeRota'
import { LayoutPrincipal } from '@/layouts/LayoutPrincipal'
import { Inicio } from '@/pages/Inicio'

/**
 * A página inicial entra no pacote principal, porque é a primeira coisa que a
 * pessoa vê. As demais são carregadas sob demanda, para conter o tamanho do
 * pacote inicial (pendência P6).
 */
const Unidades = lazy(() => import('@/pages/Unidades').then((m) => ({ default: m.Unidades })))
const UnidadeDetalhe = lazy(() =>
  import('@/pages/UnidadeDetalhe').then((m) => ({ default: m.UnidadeDetalhe })),
)
const Campanhas = lazy(() => import('@/pages/Campanhas').then((m) => ({ default: m.Campanhas })))
const PrimeirosSocorros = lazy(() =>
  import('@/pages/PrimeirosSocorros').then((m) => ({ default: m.PrimeirosSocorros })),
)
const SaudeMental = lazy(() =>
  import('@/pages/SaudeMental').then((m) => ({ default: m.SaudeMental })),
)
const Agendamento = lazy(() =>
  import('@/pages/Agendamento').then((m) => ({ default: m.Agendamento })),
)
const MinhasSolicitacoes = lazy(() =>
  import('@/pages/MinhasSolicitacoes').then((m) => ({ default: m.MinhasSolicitacoes })),
)
const Sobre = lazy(() => import('@/pages/Sobre').then((m) => ({ default: m.Sobre })))
const Privacidade = lazy(() =>
  import('@/pages/Privacidade').then((m) => ({ default: m.Privacidade })),
)
const Acessibilidade = lazy(() =>
  import('@/pages/Acessibilidade').then((m) => ({ default: m.Acessibilidade })),
)
const NaoEncontrado = lazy(() =>
  import('@/pages/NaoEncontrado').then((m) => ({ default: m.NaoEncontrado })),
)

export const rotas: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPrincipal />,
    children: [
      /*
       * Rota sem caminho e sem elemento próprio: ela apenas renderiza os
       * filhos. Existe para carregar o `errorElement` um nível abaixo do
       * `LayoutPrincipal` — assim um erro em qualquer página aparece dentro
       * do <main>, com cabeçalho e rodapé no lugar, em vez de substituir a
       * casca inteira da aplicação.
       */
      {
        errorElement: <ErroDeRota />,
        children: [
          { index: true, element: <Inicio /> },
          { path: 'unidades', element: <Unidades /> },
          { path: 'unidades/:id', element: <UnidadeDetalhe /> },
          { path: 'campanhas', element: <Campanhas /> },
          { path: 'primeiros-socorros', element: <PrimeirosSocorros /> },
          { path: 'saude-mental', element: <SaudeMental /> },
          { path: 'agendamento', element: <Agendamento /> },
          { path: 'minhas-solicitacoes', element: <MinhasSolicitacoes /> },
          { path: 'sobre', element: <Sobre /> },
          { path: 'privacidade', element: <Privacidade /> },
          { path: 'acessibilidade', element: <Acessibilidade /> },
          { path: '*', element: <NaoEncontrado /> },
        ],
      },
    ],
  },
]
