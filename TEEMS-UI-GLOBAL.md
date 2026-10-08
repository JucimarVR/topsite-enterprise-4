# TEEMS-UI-GLOBAL v1.1.7 – Manual Oficial da Interface do TopSite Enterprise

Este documento é a referência oficial permanente e guia de identidade visual de UI/UX do ecossistema **TopSite Enterprise**. Todas as futuras melhorias e desenvolvimentos devem seguir rigorosamente os padrões estabelecidos neste manual.

---

## CAPÍTULO 01 — Tipografia

- **Fonte Oficial**: **Lato** (`font-sans`) aplicada uniformemente em todo o ecossistema.
- **Títulos (Display / Main Headings)**: `32px` (`text-2xl sm:text-3xl font-bold`)
- **Subtítulos (Subheadings)**: `24px` (`text-xl font-bold`)
- **Cabeçalhos de Seção**: `20px` (`text-lg font-bold`)
- **Texto Principal (Desktop)**: `17px` (`text-base sm:text-[17px] leading-relaxed`)
- **Texto Principal (Mobile)**: `18px` (`text-[18px] leading-relaxed`)
- **Links Institucionais**: `17px` (`text-base sm:text-[17px] font-semibold`)
- **Botões e Ações**: `17px` (`text-base sm:text-[17px] font-bold`)
- **Rótulos de Formulários (Labels)**: `text-xs sm:text-sm font-mono uppercase tracking-wider font-bold`
- **Micro-labels e Timestamps**: `text-xs font-mono uppercase tracking-widest`

---

## CAPÍTULO 02 — Paleta de Cores

- **Background Canvas (Fundo Principal)**: `#020617` (Slate 950 / Dark Velvet Canvas)
- **Cabeçalhos de Janela / Headers**: `#0f172a` (Slate 900)
- **Títulos e Textos Principais**: `#ffffff` (Branco Puro / High Contrast)
- **Subtítulos e Textos Secundários**: `#cbd5e1` / `#e2e8f0` (Slate 200/300)
- **Acentuação Principal (Dourado Oficial)**: `#c5a880` / `#dfc198` (`brand-gold`)
- **Acentuação Secundária (Laranja Enterprise)**: `#ff7b00` / `#ff8c00`
- **Bordas e Divisores**: `#1e293b` (Slate 800) com realces em `brand-gold/40`
- **Mensagens de Sucesso / Destaques Positivos**: `#10b981` (Emerald 500)
- **Alertas / Avisos de Segurança**: `#f59e0b` (Amber 500)
- **Rodapés e Micro-textos**: `#94a3b8` / `#64748b` (Slate 400/500)

---

## CAPÍTULO 03 — Botões

Todos os botões do ecossistema seguem a escala tipográfica oficial e estados de interação táctil:
- **Botões de Ação Primária (e.g. Salvar, Autenticar, Enviar)**:
  - Estilo: `bg-brand-gold hover:bg-brand-gold-light text-slate-950 font-bold rounded-xl px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all cursor-pointer`
- **Botões de Canal de Feedback (Floating Action Pill)**:
  - Estilo Original Homologado: `bg-slate-900 hover:bg-slate-850 text-brand-gold px-3.5 py-2 sm:px-5 sm:py-3 rounded-full border border-brand-gold/40 hover:border-brand-gold shadow-[0_8px_24px_rgba(197,168,128,0.25)] text-[10px] sm:text-xs font-bold uppercase tracking-wider`
  - Posicionamento: `fixed bottom-3 right-3 sm:bottom-6 sm:right-6`
- **Botão Identity Manager (Assistant Trigger)**:
  - Estilo Original Homologado: `bg-slate-900/95 hover:bg-slate-900 text-white rounded-full border border-brand-gold/40 hover:border-brand-gold px-3 py-1.5 sm:px-4.5 sm:py-3 shadow-[0_10px_30px_rgba(0,0,0,0.85)]`
  - Posicionamento Mobile/Tablet: `fixed bottom-[78px] left-1/2 -translate-x-1/2`
  - Posicionamento Desktop: `sm:bottom-6 sm:left-6 sm:translate-x-0`
- **Botão Voltar ao Topo**:
  - Estilo Original Homologado: `w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors z-50`
  - Posicionamento Mobile/Tablet: `fixed bottom-[68px] right-3` (alinhado à direita, ~1,5 cm acima do Canal de Feedback)
  - Posicionamento Desktop: `sm:bottom-6 sm:right-6`
- **Botões de Convite e Suporte**:
  - Estilo: `bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl px-4 py-2.5 text-xs sm:text-sm border border-slate-700`
- **Botões Administrativos e Logout**:
  - Estilo: `text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 font-bold rounded-xl px-3.5 py-2 text-xs sm:text-sm transition-all`

---

## CAPÍTULO 04 — Janelas Suspensas (Popups & Modais)

Todas as janelas suspensas, modais e caixas flutuantes devem ser estruturadas da seguinte forma:
- **Fonte**: Lato (`font-sans`) em 100% dos textos.
- **Largura Média**: `w-[95vw] sm:w-[680px] md:w-[780px] max-w-[800px]`
- **Altura Média**: `h-[90vh] sm:h-[620px] max-h-[720px]` (no celular, altura responsiva com respiro para teclado).
- **Padding Interno**: `p-6 sm:p-8` (respiro visual abundante).
- **Margens Externas**: `m-3 sm:m-6`
- **Raio de Canto (Border Radius)**: `rounded-2xl` (16px)
- **Sombras**: `shadow-[0_25px_60px_rgba(0,0,0,0.95)]`
- **Responsividade Sem Cortes**: `overflow-y-auto overflow-x-hidden` sem barra horizontal e sem sobreposição de textos.

---

## CAPÍTULO 05 — Cards

Padrões de cards para os módulos corporativos (Mesa de Especialistas, Research, Mercado Live, Portal, etc.):
- **Mesa de Especialistas**: `bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-brand-gold/40 transition-all`
- **Research & Análises**: `bg-slate-950 border border-slate-800/90 rounded-2xl p-6 shadow-xl`
- **Mercado Live / Cotações**: `bg-slate-900/90 border border-brand-gold/30 rounded-xl p-4 font-mono`
- **Portal Admin & Módulos TEEMS**: `bg-slate-900 border border-slate-800 rounded-2xl p-6`

---

## CAPÍTULO 06 — Responsividade & Hotfix de Posicionamento (TEEMS-UI-GLOBAL v1.1.7)

Regra Oficial de Ajuste Responsivo dos Elementos Flutuantes e do Cabeçalho Mobile:

1. **Restauração do Canal de Feedback e Layout de Outros Elementos**:
   - **Canal de Feedback**: Mantém 100% da sua aparência e posicionamento original (`bottom-3 right-3 sm:bottom-6 sm:right-6`).
   - **Botão Voltar ao Topo**: Mantém 100% do design e posicionamento mobile/tablet (`bottom-[68px] right-3`).
2. **Ajuste Fino do Identity Manager em Mobile/Tablet**:
   - Mantém 100% do design, tamanho, fontes, cores e animações originais.
   - Posicionamento Mobile/Tablet (`< sm`): Elevado 5 mm (~20px) adicionais para `bottom-[78px]` e mantido centralizado horizontalmente (`left-1/2 -translate-x-1/2`).
3. **Smart Floating Header (Mobile Scroll Behavior - TEEMS-UI-GLOBAL v1.1.7)**:
   - **Página no topo (`scrollY <= 15`)**: Mantém alinhamento original intacto (`translate-y-0`).
   - **Página rolando (`scrollY > 15`)**:
     - **Logotipo "R"**: Desloca suavemente ~2,5 cm para baixo (`translate-y-[25px] md:translate-y-0`) com animação fluida de 300ms (`transition-transform duration-300 ease-in-out`), retornando automaticamente ao topo.
     - **Botão Entrar / Minha Conta**: Correção definitiva — deslocamento inicial + adicional de +60px (~1,5 cm), totalizando `translate-y-[88px] md:translate-y-0`, posicionando o botão 100% abaixo da barra rolante de ativos sem qualquer sobreposição.
4. **Preservação de Layout Desktop (`>= md`)**:
   - Inalterado: Todos os elementos mantêm suas posições desktop homologadas (`translate-y-0`).

---

## CAPÍTULO 07 — Ícones

- Biblioteca Oficial: **lucide-react** em 100% dos componentes.
- Proporção Padrão:
  - Ícones de Botões: `size={15}` ou `size={16}` (Mobile: `size={14}`)
  - Ícones de Cabeçalho: `size={20}` ou `size={24}`
  - Ícones de Destaque: `size={28}` ou `size={32}`

---

## CAPÍTULO 08 — Animações

- Biblioteca Oficial: **motion/react** (`framer-motion`).
- Padrões de Entrada de Janelas:
  - `initial={{ opacity: 0, scale: 0.95, y: 15 }}`
  - `animate={{ opacity: 1, scale: 1, y: 0 }}`
  - `exit={{ opacity: 0, scale: 0.95, y: 15 }}`
- Suavização: Transitions spring ou ease-out de 0.2s a 0.35s.

---

## CAPÍTULO 09 — Menus & Navegação

- **Barra Superior (Navbar)**:
  - `h-16 sm:h-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80`
- **Navegação do Usuário**:
  - Links com fonte Lato (`font-sans`), peso em negrito e destaque em `text-brand-gold` para item ativo.

---

## CAPÍTULO 10 — Rodapés (Global Footer)

- **Estrutura Unificada TEGFS**:
  - Cor de Fundo: `bg-slate-950 border-t border-slate-800`
  - Tipografia: Lato (`font-sans`), textos `text-xs sm:text-sm text-slate-300`, links `text-slate-300 hover:text-brand-gold`.
  - Preservação de Visibilidade: O rodapé permanece desimpedido no celular sem sobreposição dos botões flutuantes.

---

## HISTÓRICO DE REVISÕES

- **v1.0 (2026-07-24)**: Lançamento do Manual Oficial da Interface do TopSite Enterprise (Lato, paleta escura velvet, Janelas Suspensas, Cards, Tipografia).
- **v1.1 (2026-07-24)**: Ajuste Responsivo Oficial dos Botões Flutuantes do Rodapé para Mobile e Tablet.
- **v1.1.1 (2026-07-24)**: Hotfix de Layout: Restauração do Canal de Feedback ao design/posicionamento original (`bottom-3 right-3`) e reposicionamento isolado do Identity Manager em mobile (`bottom-[58px] left-1/2 -translate-x-1/2`).
- **v1.1.2 (2026-07-24)**: Hotfix de Posicionamento do Botão Voltar ao Topo em Mobile/Tablet (`bottom-[68px] right-3`), garantindo ~1,5 cm de elevação acima do Canal de Feedback sem alterações no layout desktop.
- **v1.1.3 (2026-07-24)**: Hotfix Final de Posicionamento do Identity Manager em Mobile/Tablet (`bottom-[78px] left-1/2 -translate-x-1/2`), elevando o botão ~5 mm para garantir respiro impecável em relação ao botão inferior.
- **v1.1.4 (2026-07-24)**: Hotfix Responsivo de Reposicionamento do Header Mobile: Deslocamento do botão "Entrar / Minha Conta" (~2 cm abaixo) e do Logotipo "R" (~1,5 cm abaixo) exclusivamente em dispositivos móveis, evitando sobreposição com a barra rolante de ativos.
- **v1.1.5 (2026-07-24)**: Smart Floating Header (Mobile Scroll Behavior): Animação fluida e inteligente para o Logotipo "R" e botão "Entrar / Minha Conta" baseada no estado de rolagem da página em dispositivos móveis.
- **v1.1.7 (2026-07-24)**: Correção Definitiva do Botão "Entrar / Minha Conta" (Mobile): Adição de +60px (~1,5 cm) ao deslocamento de rolagem existente, totalizando `translate-y-[88px]`, assegurando visibilidade 100% livre e desimpedida abaixo da barra rolante de ativos.

---

**Status Oficial: TEEMS-UI-GLOBAL v1.1.7 — APROVADO E HOMOLOGADO**
Referência oficial obrigatória para todas as futuras Ordens de Engenharia do TopSite Enterprise.
