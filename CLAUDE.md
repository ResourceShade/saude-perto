# CLAUDE.md — Saúde Perto

Instruções permanentes para sessões do Claude Code neste repositório.
Mantenha este arquivo **conciso e operacional**. Detalhes extensos ficam em `docs/`.

---

## 1. Projeto

**Saúde Perto** — aplicação web responsiva de saúde preventiva e bem-estar comunitário.

- **Contexto:** trabalho acadêmico da disciplina *Front-End Frameworks* (UNINASSAU).
- **Objetivo:** MVP de frontend organizado, acessível, responsivo, testável e publicável no GitHub.
- **Natureza:** aplicação web (experiência tipo app). **Não** é app nativo Android/iOS nem sistema hospitalar.

## 2. Escopo e limitações

**Está no escopo:** frontend React; busca/listagem de unidades de saúde; mapa interativo; campanhas preventivas; conteúdo educativo (primeiros socorros, saúde mental); formulário de agendamento **demonstrativo**; validação; estados de carregamento/erro/vazio; navegação; testes; documentação.

**Está fora do escopo:** backend próprio; autenticação real; persistência compartilhada; agendamento oficial em rede pública; notificações efetivas; prontuário; telemedicina.

**Regra dura:** nunca afirmar que um agendamento foi confirmado, que há integração oficial, ou que uma funcionalidade está pronta sem evidência verificada. Dados demonstrativos devem ser **visivelmente** rotulados na interface.

## 3. Stack tecnológica

Versões **reais instaladas**, confirmadas por `npm ls --depth=0` em 2026-10-23.

| Camada | Pacote | Versão instalada |
|---|---|---|
| Build | `vite` | 8.3.5 |
| UI | `react` / `react-dom` | 19.3.1 |
| Linguagem | `typescript` | 6.0.3 |
| Plugin React | `@vitejs/plugin-react` | 6.1.2 |
| Estilo | `tailwindcss` / `@tailwindcss/vite` | 4.3.3 |
| Componentes | `radix-ui` | 1.8.1 |
| CLI de componentes | `shadcn` | 4.22.1 |
| Ícones | `lucide-react` | 1.61.0 |
| Variantes | `class-variance-authority` | 0.7.1 |
| Utilitário `cn` | `cn` | 0.5.0 |
| Animação de classe | `tw-animate-css` | 1.4.0 |
| Tipografia | `@fontsource-variable/archivo` | 5.3.0 |
| Rotas | `react-router-dom` | 7.18.4 |
| Lint | `oxlint` | 1.89.0 |
| Tipos Node | `@types/node` | 24.19.2 |

**Ainda não instalado** (fases futuras): `react-hook-form`, `zod`, `leaflet`, `react-leaflet`, `vitest`, `@testing-library/react`.

`@fontsource-variable/geist` foi **desinstalado** na Fase 3: era herança do preset do shadcn, substituída por Archivo (ver `docs/arquitetura.md` §10).

> ⚠️ **O linter é `oxlint`, não ESLint.** O template oficial do Vite passou a usar oxlint. Decisão registrada em `docs/PROJECT_MEMORY.md` §C (D10). O plugin `jsx-a11y` está habilitado em `.oxlintrc.json` e verificado funcionando.
>
> ⚠️ **Tailwind 4 não usa `tailwind.config.js`.** O tema vive em `src/index.css` via `@theme`.
>
> ⚠️ **TypeScript 6 deprecou `baseUrl`.** O alias `@/*` usa apenas `paths`. Não reintroduzir `baseUrl` — quebra o build.

## 4. Estrutura de pastas

> ⚠️ Existem: `components/layout/`, `components/estados/`, `components/ui/`, `layouts/`, `pages/`, `hooks/`, `types/`, `data/`, `lib/`. **Ainda não existem:** `services/`, `schemas/`, `test/`. Estado real confirmado: `docs/PROJECT_MEMORY.md` §D.

```
/                      CLAUDE.md, README.md, (futuro) package.json, vite.config.ts, .env.example, .gitignore
/docs                  documentação e memória do projeto
/src                   (planejado)
  /components          componentes reutilizáveis
    /ui                primitivos shadcn/ui
  /pages               uma pasta/arquivo por rota
  /layouts             casca da aplicação (header, nav, footer)
  /services            acesso a APIs — única camada que faz rede
  /hooks               hooks de dados e UI
  /types               tipos e interfaces TypeScript
  /schemas             esquemas Zod de validação
  /data                dados demonstrativos (mock), sempre marcados
  /lib                 utilitários puros
  /test                setup e utilitários de teste
```

## 5. Comandos

Todos **executados e confirmados** em 2026-10-23.

| Finalidade | Comando | Resultado verificado |
|---|---|---|
| Instalar | `npm install` | ✅ 45 pacotes, 0 vulnerabilidades |
| Desenvolver | `npm run dev` | ✅ Vite pronto em 163 ms, `http://localhost:5173/` |
| Build | `npm run build` | ✅ `tsc -b && vite build`, exit 0 |
| Lint | `npm run lint` | ✅ `oxlint`, exit 0, zero avisos |
| Preview | `npm run preview` | ✅ verificado (ver aviso abaixo) |
| Testes | `npm run test` | ✅ **89 testes**, exit 0, ~6 s |
| Testes | — | ❌ **não existe.** Vitest não instalado (Fase 7) |

> ⚠️ **Publicação em subcaminho:** `VITE_BASE` precisa estar presente no **build e no preview**. O `vite preview` relê a configuração e, sem a variável, serve os ativos no caminho errado — produzindo uma **página em branco sem erro no console**. Ver `docs/deploy.md` §4.
>
> ⚠️ **Ao verificar um servidor com `curl`, conferir o tamanho da resposta, não só o status.** Um HTML de fallback também devolve HTTP 200.

## 6. Documentos e finalidade

| Arquivo | Finalidade |
|---|---|
| `CLAUDE.md` | Este índice operacional e as regras permanentes |
| `README.md` | Documentação pública para GitHub e banca acadêmica |
| `docs/PROJECT_MEMORY.md` | **Memória principal.** Estado real, decisões, pendências, próxima sessão |
| `docs/CHANGELOG.md` | Histórico cronológico de mudanças relevantes |
| `docs/requisitos.md` | Requisitos funcionais e não funcionais com critérios verificáveis |
| `docs/arquitetura.md` | Camadas, padrões de código, fluxo de dados, convenções |
| `docs/apis.md` | APIs investigadas, resultado real dos testes, fallbacks |
| `docs/testes.md` | Estratégia, ferramentas e resultados reais de teste |
| `docs/deploy.md` | Build e publicação (GitHub Pages) |

## 7. Regras de arquitetura e código

1. **Rede só em `src/services/`.** Componentes e páginas nunca chamam `fetch` diretamente.
2. **TypeScript estrito.** `any` apenas com comentário justificando; prefira `unknown` + validação.
3. **Dados externos são validados** com Zod na fronteira do serviço antes de entrar no app.
4. **Dado real vs. demonstrativo:** todo dado mock vem de `src/data/`, carrega um campo de origem e é rotulado na UI. Nunca misturar silenciosamente com dado de API.
5. **Componentes pequenos e reutilizáveis.** Lógica de estado em hooks, não em JSX.
6. **Toda tela assíncrona implementa três estados:** carregando, erro, vazio.
7. **Simplicidade acadêmica.** Sem gerenciador de estado global, monorepo ou abstração que o MVP não exija.
8. **Não recriar arquivos existentes** nem reescrever áreas grandes para corrigir um problema local.
9. **Avaliar antes de adicionar dependência:** necessidade real, compatibilidade e registro da decisão.
10. **Nenhuma `box-shadow` e nenhum gradiente.** A separação entre seções vem de cor e borda. Raio (`--radius`) só em elementos clicáveis — faixas e seções ficam retas. Ver `docs/arquitetura.md` §10.
11. **Alterar a paleta exige remedir o contraste** antes de a mudança entrar. O par amarelo-sobre-verde está em 4,30:1 e **não pode** receber texto corrido.

## 8. Segurança e privacidade

- **LGPD:** dados de saúde são dados pessoais sensíveis. Coletar o mínimo.
- **Nunca** usar dados reais de pacientes em exemplos, mocks ou testes. Use dados fictícios óbvios.
- **Nunca** versionar `.env` nem colocar credenciais, tokens ou segredos no código.
- O frontend é público: **não pode conter segredos**. Se uma API exige chave, ela não é viável aqui — registre a limitação.
- `localStorage` **não é banco de dados seguro.** Usar apenas para preferências não sensíveis, documentando o fato.
- Documentar explicitamente que agendamento oficial, persistência compartilhada, autenticação segura e notificações exigiriam backend e integrações autorizadas.

## 9. APIs e dados simulados

Antes de implementar qualquer integração: consultar `docs/apis.md`, verificar a documentação oficial, testar disponibilidade, parâmetros, formato, autenticação, **CORS** e limites de uso. Registrar o resultado real e a data.

**Nunca inventar** endpoints, campanhas vigentes, estatísticas ou dados institucionais.

Se a integração não estiver disponível: usar dado demonstrativo rotulado e registrar a limitação em `docs/apis.md` e `docs/PROJECT_MEMORY.md`.

## 10. Protocolo de início de sessão (obrigatório)

1. Ler `CLAUDE.md` (este arquivo).
2. Ler `docs/PROJECT_MEMORY.md` — especialmente §B, §G e §I.
3. Consultar `README.md`.
4. Ler os documentos de `docs/` pertinentes à tarefa.
5. Inspecionar o repositório real (`ls`, `git status`, `cat package.json`).
6. Conferir alterações locais não commitadas **antes** de modificar qualquer coisa.
7. Comparar o código real com a memória registrada.
8. Apontar inconsistências entre documentação, implementação e testes.
9. Identificar a tarefa prioritária em §I "Próxima sessão".

Em seguida, apresentar um resumo curto: **estado atual, última etapa concluída, próxima tarefa, riscos/bloqueios.**

Se a memória estiver desatualizada, **corrigi-la com base nas evidências do repositório antes de prosseguir** — sem sobrescrever alterações feitas pelo usuário.

## 11. Protocolo de encerramento de sessão (obrigatório)

Atualizar a memória **antes** de encerrar. Registrar em `docs/PROJECT_MEMORY.md` §H:

- O que foi realizado e quais arquivos foram criados/modificados.
- Decisões tomadas (espelhar em §C).
- Comandos executados e sua **saída real**.
- Testes que passaram ou falharam.
- O que **não** pôde ser verificado e por quê.
- Pendências restantes (§G) e a próxima tarefa (§I).
- Quais documentos foram atualizados.

Atualizar `docs/CHANGELOG.md` para mudanças relevantes. Verificar se `CLAUDE.md` e `README.md` seguem coerentes com o código.

**Não declarar a sessão concluída** se a documentação essencial ficou incompatível com o código.
**Se um teste não pôde ser executado, registrar o motivo — nunca afirmar que passou.**

## 12. Autorização necessária

Requerem autorização explícita do usuário a cada vez:

- `git commit`, `git push`, criação de repositório remoto, publicação ou deploy.
- Instalar dependências novas não previstas em §3.
- Alterar configurações globais da máquina ou do Claude Code.
- Executar scripts remotos (`curl | bash`) — e sempre inspecionar o conteúdo antes.

## 13. Memória detalhada e próximo passo

Memória completa: **`docs/PROJECT_MEMORY.md`**

➡️ **Próximo passo registrado:** ver `docs/PROJECT_MEMORY.md` §I — *Próxima sessão*.
