
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { buscarUnidades, unidadePorId } from './unidades'

const { from, select, order, range } = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  order: vi.fn(),
  range: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { from },
}))

const UNIDADES_TESTE = [
  {
    id: 'cnes-001',
    nome: 'Hospital Exemplo',
    tipo: 'hospital',
    servicos: ['urgencia'],
    endereco: 'Rua A, 10',
    bairro: 'Centro',
    municipio: 'Recife',
    uf: 'PE',
    telefone: null,
    horario: null,
    latitude: -8.06,
    longitude: -34.89,
    obtido_em: '2026-11-26',
  },
  {
    id: 'cnes-002',
    nome: 'UBS Exemplo',
    tipo: 'ubs',
    servicos: ['vacinacao'],
    endereco: 'Rua B, 20',
    bairro: 'Jardim Paulista',
    municipio: 'Paulista',
    uf: 'PE',
    telefone: null,
    horario: null,
    latitude: -7.94,
    longitude: -34.87,
    obtido_em: '2026-11-26',
  },
  {
    id: 'cnes-003',
    nome: 'Unidade São José',
    tipo: 'ubs',
    servicos: null,
    endereco: null,
    bairro: 'Centro',
    municipio: 'Olinda',
    uf: 'PE',
    telefone: null,
    horario: null,
    latitude: null,
    longitude: null,
    obtido_em: '2026-11-26',
  },
]

beforeEach(() => {
  vi.resetAllMocks()

  from.mockReturnValue({ select })
  select.mockReturnValue({ order })
  order.mockReturnValue({ range })

  range.mockResolvedValue({
    data: UNIDADES_TESTE,
    error: null,
  })
})

describe('buscarUnidades - integração com CNES', () => {
  it('consulta a tabela correta no Supabase', async () => {
    await buscarUnidades('Recife')

    expect(from).toHaveBeenCalledWith('unidades_saude')
    expect(select).toHaveBeenCalledWith('*')
  })

  it('converte os registros do CNES em unidades do domínio', async () => {
    const r = await buscarUnidades('Recife')

    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.usouFallback).toBe(false)
    expect(r.dados.unidades).toHaveLength(1)

    const [unidade] = r.dados.unidades

    expect(unidade?.nome).toBe('Hospital Exemplo')
    expect(unidade?.tipo).toBe('hospital')
    expect(unidade?.endereco).toBe('Rua A, 10')
    expect(unidade?.origem).toBe('cnes')
    expect(unidade?.coordenadas).toEqual({
      lat: -8.06,
      lon: -34.89,
    })
  })

  it('pesquisa unidades pelo município', async () => {
    const r = await buscarUnidades('Paulista')

    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.unidades).toHaveLength(1)
    expect(r.dados.unidades[0]?.municipio).toBe('Paulista')
  })

  it('aceita município acompanhado do estado', async () => {
    const r = await buscarUnidades('Paulista, Pernambuco')

    expect(r.ok && r.dados.unidades).toHaveLength(1)
  })

  it('pesquisa pelo bairro', async () => {
    const r = await buscarUnidades('Jardim Paulista')

    expect(r.ok && r.dados.unidades).toHaveLength(1)
  })

  it('pesquisa pelo nome do estabelecimento', async () => {
    const r = await buscarUnidades('Hospital Exemplo')

    expect(r.ok && r.dados.unidades).toHaveLength(1)
  })

  it('ignora diferenças entre maiúsculas e minúsculas', async () => {
    const r = await buscarUnidades('RECIFE')

    expect(r.ok && r.dados.unidades).toHaveLength(1)
  })

  it('permite pesquisar sem acentos', async () => {
    const r = await buscarUnidades('Sao Jose')

    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.unidades[0]?.nome).toBe('Unidade São José')
  })

  it('trata unidades sem coordenadas e serviços informados', async () => {
    const r = await buscarUnidades('Olinda')

    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.unidades[0]?.coordenadas).toBeNull()
    expect(r.dados.unidades[0]?.servicos).toEqual([])
  })

  it('retorna uma lista vazia quando não encontra unidades', async () => {
    const r = await buscarUnidades('Cidade Inexistente')

    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.unidades).toEqual([])
  })

  it('mantém a origem CNES nos resultados', async () => {
    const r = await buscarUnidades('Centro')

    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.unidades).toHaveLength(2)
    expect(
      r.dados.unidades.every((u) => u.origem === 'cnes'),
    ).toBe(true)
  })

  it('consulta todas as páginas de registros', async () => {
    const primeiraPagina = Array.from(
      { length: 500 },
      (_, i) => ({
        ...UNIDADES_TESTE[0],
        id: `pagina-${i}`,
      }),
    )

    range
      .mockResolvedValueOnce({
        data: primeiraPagina,
        error: null,
      })
      .mockResolvedValueOnce({
        data: [UNIDADES_TESTE[1]],
        error: null,
      })

    const r = await buscarUnidades('Paulista')

    expect(range).toHaveBeenCalledWith(0, 499)
    expect(range).toHaveBeenCalledWith(500, 999)
    expect(r.ok && r.dados.unidades).toHaveLength(1)
  })
})

describe('buscarUnidades - tratamento de erros', () => {
  it('trata indisponibilidade do Supabase', async () => {
    range.mockResolvedValue({
      data: null,
      error: { message: 'Serviço indisponível' },
    })

    const r = await buscarUnidades('Recife')

    expect(r).toEqual({
      ok: false,
      erro: { tipo: 'indisponivel' },
    })
  })

  it('trata falhas de conexão sem lançar exceções', async () => {
    range.mockRejectedValue(new Error('Falha de conexão'))

    await expect(buscarUnidades('Recife')).resolves.toEqual({
      ok: false,
      erro: { tipo: 'rede' },
    })
  })
})

describe('unidadePorId', () => {
  it('encontra uma unidade após a pesquisa', async () => {
    await buscarUnidades('Recife')

    expect(unidadePorId('cnes-001')?.nome).toBe(
      'Hospital Exemplo',
    )
  })

  it('retorna undefined para um id inexistente', () => {
    expect(unidadePorId('nao-existe')).toBeUndefined()
  })
})
