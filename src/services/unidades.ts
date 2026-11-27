
import { supabase } from '@/lib/supabase'
import { UNIDADES_DEMO } from '@/data/unidades.mock'
import type { Unidade, TipoUnidade, Servico } from '@/types/unidade'
import type { ResultadoRede } from './erros'

const registro = new Map<string, Unidade>()

for (const unidade of UNIDADES_DEMO) {
  registro.set(unidade.id, unidade)
}

export function unidadePorId(id: string): Unidade | undefined {
  return registro.get(id)
}

export type ResultadoUnidades = {
  unidades: Unidade[]
  usouFallback: boolean
}

type UnidadeBanco = {
  id: string
  nome: string
  tipo: TipoUnidade
  servicos: Servico[] | null
  endereco: string | null
  bairro: string | null
  municipio: string
  uf: string
  telefone: string | null
  horario: string | null
  latitude: number | null
  longitude: number | null
  obtido_em: string
}

function mapearUnidade(dado: UnidadeBanco): Unidade {
  return {
    id: dado.id,
    nome: dado.nome,
    tipo: dado.tipo,
    servicos: dado.servicos ?? [],
    endereco: dado.endereco,
    bairro: dado.bairro,
    municipio: dado.municipio,
    uf: dado.uf,
    telefone: dado.telefone,
    horario: dado.horario,
    coordenadas:
      dado.latitude !== null && dado.longitude !== null
        ? {
            lat: dado.latitude,
            lon: dado.longitude,
          }
        : null,
    origem: 'cnes',
    obtidoEm: dado.obtido_em,
  }
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export async function buscarUnidades(
  termo: string,
): Promise<ResultadoRede<ResultadoUnidades>> {
  try {
    const registros: UnidadeBanco[] = []
    const tamanhoPagina = 500

    for (let inicio = 0; ; inicio += tamanhoPagina) {
      const { data, error } = await supabase
        .from('unidades_saude')
        .select('*')
        .order('id')
        .range(inicio, inicio + tamanhoPagina - 1)

      if (error) {
        console.error('Erro ao consultar unidades:', error)
        return { ok: false, erro: { tipo: 'indisponivel' } }
      }

      const pagina = (data ?? []) as UnidadeBanco[]
      registros.push(...pagina)

      if (pagina.length < tamanhoPagina) break
    }

    const palavras = normalizar(termo)
      .split(/[\s,]+/)
      .filter(
        (palavra) =>
          palavra &&
          palavra !== 'pe' &&
          palavra !== 'pernambuco' &&
          palavra !== 'brasil',
      )

    const unidades = registros
      .filter((dado) => {
        const texto = normalizar(
          [
            dado.nome,
            dado.municipio,
            dado.bairro,
            dado.endereco,
          ]
            .filter(Boolean)
            .join(' '),
        )

        return palavras.every((palavra) => texto.includes(palavra))
      })
      .map(mapearUnidade)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

    for (const unidade of unidades) {
      registro.set(unidade.id, unidade)
    }

    return {
      ok: true,
      dados: {
        unidades,
        usouFallback: false,
      },
    }
  } catch (erro) {
    console.error('Falha na pesquisa:', erro)
    return { ok: false, erro: { tipo: 'rede' } }
  }
}
