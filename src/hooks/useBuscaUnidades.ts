
import { useCallback, useState } from 'react'

import { buscarUnidades } from '@/services/unidades'
import type { ErroApp } from '@/services/erros'
import type { Unidade } from '@/types/unidade'

export type EstadoBusca =
  | { situacao: 'inicial' }
  | { situacao: 'carregando'; etapa: 'local' | 'unidades' }
  | { situacao: 'erro'; erro: ErroApp }
  | {
      situacao: 'pronto'
      unidades: Unidade[]
      local: string
      usouFallback: boolean
    }

export function useBuscaUnidades() {
  const [estado, setEstado] = useState<EstadoBusca>({
    situacao: 'inicial',
  })

  const buscar = useCallback(async (termo: string) => {
    const consulta = termo.trim()

    if (!consulta) return

    setEstado({
      situacao: 'carregando',
      etapa: 'unidades',
    })

    const resultado = await buscarUnidades(consulta)

    if (!resultado.ok) {
      setEstado({
        situacao: 'erro',
        erro: resultado.erro,
      })
      return
    }

    setEstado({
      situacao: 'pronto',
      unidades: resultado.dados.unidades,
      local: consulta,
      usouFallback: false,
    })
  }, [])

  const limpar = useCallback(
    () => setEstado({ situacao: 'inicial' }),
    [],
  )

  return { estado, buscar, limpar }
}
