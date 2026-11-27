
import { Suspense, lazy, useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'

import { Carregando } from '@/components/estados/Carregando'
import { Erro } from '@/components/estados/Erro'
import { SeloDadoDemo } from '@/components/estados/SeloDadoDemo'
import { Vazio } from '@/components/estados/Vazio'
import { BuscaUnidades } from '@/components/unidades/BuscaUnidades'
import { UnidadeCard } from '@/components/unidades/UnidadeCard'
import { UnidadeFiltros } from '@/components/unidades/UnidadeFiltros'
import {
  FILTROS_VAZIOS,
  temFiltroAtivo,
  type Filtros,
} from '@/components/unidades/filtros'

import { useBuscaUnidades } from '@/hooks/useBuscaUnidades'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { mensagemDoErro } from '@/services/erros'
import type { Unidade } from '@/types/unidade'

const MapaUnidades = lazy(() =>
  import('@/components/mapa/MapaUnidades').then((m) => ({
    default: m.MapaUnidades,
  })),
)

const BASE_VAZIA: Unidade[] = []

export function Unidades() {
  useTituloPagina('Unidades de saúde')

  const { estado, buscar } = useBuscaUnidades()
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS)
  const [ultimoTermo, setUltimoTermo] = useState('')

  const base =
    estado.situacao === 'pronto' ? estado.unidades : BASE_VAZIA

  const municipios = useMemo(
    () =>
      [...new Set(base.map((u) => u.municipio))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [base],
  )

  const unidades = useMemo(
    () =>
      base.filter(
        (u) =>
          (filtros.municipio === 'todos' ||
            u.municipio === filtros.municipio) &&
          (filtros.tipo === 'todos' ||
            u.tipo === filtros.tipo) &&
          (filtros.servico === 'todos' ||
            u.servicos.includes(filtros.servico)),
      ),
    [base, filtros],
  )

  function executarBusca(termo: string) {
    setUltimoTermo(termo)
    setFiltros(FILTROS_VAZIOS)
    void buscar(termo)
  }

  const carregando = estado.situacao === 'carregando'

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">
        Unidades de saúde
      </h1>

      <p className="mt-4 max-w-prose text-tinta-suave">
        Encontre hospitais, postos de saúde, UPAs e outras
        unidades de saúde cadastradas na região pesquisada.
      </p>

      <div className="mt-8">
        <BuscaUnidades
          aoBuscar={executarBusca}
          carregando={carregando}
        />
      </div>

      {estado.situacao === 'inicial' && (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <MapPin size={30} className="text-emerald-700" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-tinta">
            Encontre atendimento na sua região
          </h2>

          <p className="mx-auto mt-3 max-w-md text-tinta-suave">
            Digite uma cidade, bairro, endereço ou nome de
            estabelecimento para localizar unidades de saúde
            reais no mapa.
          </p>

          <p className="mt-4 text-sm text-tinta-suave">
            Exemplo: Paulista, Pernambuco
          </p>

          <p className="mt-2 text-sm text-tinta-suave">
            Cobertura atual: 14 municípios de Pernambuco.
          </p>

          <div className="mt-6 text-left">
            <SeloDadoDemo origem="cnes" />
          </div>
        </div>
      )}

      {carregando && (
        <div className="mt-10">
          <Carregando
            mensagem="Consultando unidades de saúde..."
          />

          <p className="mt-4 text-center text-sm text-tinta-suave">
            Buscando estabelecimentos na base do CNES/DATASUS.
          </p>
        </div>
      )}

      {estado.situacao === 'erro' && (
        <div className="mt-8">
          <Erro
            {...mensagemDoErro(estado.erro)}
            aoTentarNovamente={
              ultimoTermo
                ? () => executarBusca(ultimoTermo)
                : undefined
            }
          />
        </div>
      )}

      {estado.situacao === 'pronto' && (
        <>
          <div className="mt-8">
            <p className="font-medium text-tinta">
              Resultados para <strong>{estado.local}</strong>
            </p>

            <p className="mt-2 text-sm text-tinta-suave">
              {base.length} unidades encontradas.
            </p>

            <div className="mt-3">
              <SeloDadoDemo origem="cnes" />
            </div>

            <p className="mt-3 text-sm text-tinta-suave">
              As informações são provenientes do cadastro oficial
              do CNES/DATASUS e podem estar desatualizadas.
              Confirme os serviços e horários diretamente com a
              unidade. A cobertura atual contempla 14 municípios
              de Pernambuco.
            </p>
          </div>

          <div className="mt-10">
            <UnidadeFiltros
              filtros={filtros}
              municipios={municipios}
              aoMudar={setFiltros}
              aoLimpar={() => setFiltros(FILTROS_VAZIOS)}
              temFiltroAtivo={temFiltroAtivo(filtros)}
              totalResultados={unidades.length}
            />
          </div>

          {unidades.length > 0 && (
            <section
              aria-labelledby="titulo-mapa"
              className="mt-10"
            >
              <h2
                id="titulo-mapa"
                className="font-heading text-2xl font-bold text-tinta"
              >
                No mapa
              </h2>

              <p className="mt-2 text-tinta-suave">
                Explore as unidades encontradas, consulte sua
                localização e trace rotas até o estabelecimento.
              </p>

              <div className="mt-4">
                <Suspense
                  fallback={
                    <Carregando mensagem="Carregando o mapa..." />
                  }
                >
                  <MapaUnidades unidades={unidades} />
                </Suspense>
              </div>
            </section>
          )}

          <section
            aria-label="Lista de unidades"
            className="mt-8"
          >
            {unidades.length === 0 ? (
              <Vazio
                titulo="Nenhuma unidade encontrada"
                orientacao="Tente remover os filtros ou buscar outra localidade dentro da área de cobertura."
                acao={
                  temFiltroAtivo(filtros) ? (
                    <button
                      type="button"
                      onClick={() => setFiltros(FILTROS_VAZIOS)}
                      className="rounded-sm bg-verde-posto px-5 py-3 font-semibold text-papel"
                    >
                      Limpar filtros
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <ul className="grid gap-6 md:grid-cols-2">
                {unidades.map((unidade) => (
                  <li key={unidade.id}>
                    <UnidadeCard unidade={unidade} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
