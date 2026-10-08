# Quantum Bit Core Engineering Rules (TEEMS-000)

This document constitutes the official engineering constitution for the Quantum Bit Core Ecosystem. These rules are mandatory for all development tasks and must be strictly followed.

## 1. Modo Oficial de Desenvolvimento
Todo desenvolvimento deverá ocorrer em: **PATCH MODE**. É proibido alterar funcionalidades existentes sem autorização explícita.

## 2. Regras Gerais (Proibições)
É terminantemente proibido:
- Recriar componentes existentes;
- Alterar layouts aprovados;
- Modificar arquitetura React;
- Alterar Tailwind CSS;
- Modificar responsividade aprovada;
- Remover funcionalidades existentes;
- Alterar rotas aprovadas;
- Modificar Firebase sem autorização;
- Alterar APIs existentes;
- Modificar componentes não autorizados pelo TEEMS correspondente.

**Toda implementação deverá ocorrer exclusivamente por acréscimo.**

## 3. Lista de Arquivos (Pré-aprovação)
Antes da geração de qualquer código, deve-se apresentar:
- Lista dos arquivos que serão criados;
- Lista dos arquivos que serão modificados;
- Justificativa técnica de cada alteração.
*Nenhum código poderá ser gerado antes da aprovação desta lista.*

## 4. Alterações Extras
Caso seja necessário alterar qualquer arquivo não autorizado, a implementação deve ser interrompida imediatamente e a autorização solicitada.

## 5. Enterprise Integrity Check
Toda implementação deve apresentar ao final:
- Arquivos criados/modificados;
- Componentes modificados;
- Compatibilidade com a arquitetura existente;
- Confirmação de implementação exclusivamente por acréscimo e sem remoção de funcionalidades.

## 6. Enterprise Architecture Protection
Elementos protegidos (não podem ser alterados sem autorização):
- Header, Footer, Menus, Navegação, Rotas;
- Componentes React, Estrutura Tailwind;
- Firebase, Banco de Dados, Arquitetura Enterprise;
- Responsividade, Dark Mode, Branding Oficial.

## 7. Enterprise Documentation
Cada novo módulo deve conter: objetivo, descrição, integração, dependências, arquivos envolvidos e versão.

## 8. Enterprise Version Control
Toda implementação deve ser validada localmente, passar por testes e ser registrada com histórico de versão.

## 9. Enterprise Multi-Environment
O desenvolvimento utiliza três ambientes sincronizados: A (Desenvolvimento), B (Homologação) e C (Espelho de Segurança).

## 10. Enterprise Synchronization
O projeto deve possuir manifestos oficiais com versão, último TEEMS, data, ambiente, estado do projeto, módulos instalados e status da engenharia.

## 11. Enterprise Validation
Implementações devem ser validadas por compilação, testes locais, verificação estrutural e revisão de arquitetura.

## 12. Enterprise Publication
Somente versões aprovadas seguem para Git Oficial, Firebase e Produção.

## 13. Enterprise Audit
O projeto está sujeito a auditorias completas (arquitetura, segurança, SEO, performance, IA, Firebase, integrações).

## 14. Enterprise Standards
Código deve seguir: React, TypeScript, Tailwind CSS, Firebase, Arquitetura Modular, Clean Code, Componentização e Escalabilidade.

## 15. Enterprise AI
A IA deve preservar a arquitetura, respeitar estas regras, implementar exclusivamente o solicitado e solicitar autorização para alterações extras.

## 16. Enterprise Security
Preservar sempre: autenticação, permissões, integridade dos dados e configurações de segurança.

## 17. Enterprise Change Control
Nenhuma alteração estrutural sem Ordem Oficial de Engenharia (TEEMS).

## 18. Enterprise Quality
Foco em desempenho, escalabilidade, organização, reutilização, manutenção simplificada e estabilidade.

## 19. Enterprise Roadmap & Index Mestre
Respeitar rigorosamente a ordem do Roadmap Oficial (`TEEMS-ROADMAP.md`) e consultar o Índice Mestre (`TEEMS-INDEX.md`). Nenhum módulo deverá ser implantado fora da sequência aprovada:
1. **TEEMS-SECURITY-002** (Enterprise Administration Center - Painel do CEO)
2. **TEEMS-SECURITY-003** (Enterprise Access Manager - Convites e Links Programáveis)
3. **TEEMS-UI-DOCK-001** (Enterprise Smart Dock)
4. **TEEMS-VOICE-001** (Quantum Bit Core Voice Engine)

## 20. Enterprise Engineering Commitment
Preservar a estabilidade, compatibilidade futura e integridade do Quantum Bit Core.

---
**Status Oficial: TEEMS-000 — APROVADO**
Referência oficial obrigatória para todas as futuras Ordens de Engenharia.

## 21. Manual de Engenharia (TEEMS-DEV-STD-001)

Este manual define o fluxo de trabalho e os padrões técnicos para o desenvolvimento do ecossistema.

### 21.1 Ciclo de Ambientes (Multi-Environment)
- **Ambiente A (Desenvolvimento):** Onde ocorrem as implementações iniciais e testes de novos TEEMS.
- **Ambiente B (Homologação):** Espelho fiel do Ambiente A para validação final e QA.
- **Ambiente C (Segurança/Produção):** Espelho estável destinado ao uso final, protegido por auditoria.

### 21.2 Fluxo de Trabalho
1. **VS Code (Local):** Desenvolvimento seguindo PATCH MODE.
2. **Git (Controle):** Registro obrigatório de versões e histórico de alterações.
3. **Firebase (Deploy):** Publicação oficial após validação EIC (Enterprise Integrity Check).

### 21.3 Sincronização e Validação
- Toda alteração deve ser refletida nos manifestos de estado.
- A validação de integridade deve ocorrer antes de qualquer transição entre ambientes.
- Recuperação (Rollback): O sistema deve permitir o retorno ao estado anterior registrado no `enterprise-manifest.json` em caso de falha crítica.

## 22. Manual Oficial da Interface (TEEMS-UI-GLOBAL v1.1.7)
Todas as janelas suspensas (popups), modais e botões flutuantes devem seguir as diretrizes do TEEMS-UI-GLOBAL v1.1.7:
- Fonte Oficial: Lato (`font-sans`) em todos os textos de popups.
- Escala Tipográfica ampliada para excelente leitura em smartphones.
- Responsividade dinâmica (`w-[95vw]`, `max-h-[88vh]`, sem cortes e sem barra horizontal).
- Espaçamento interno com respiro visual abundante (`p-6 sm:p-8`).
- Canal de Feedback mantido com seu design e posicionamento original (`bottom-3 right-3`).
- Botão Identity Manager centralizado no celular (`left-1/2 -translate-x-1/2 bottom-[78px]`) mantendo todo o seu design e animações originais.
- Botão Voltar ao Topo posicionando ~1,5 cm acima do Canal de Feedback em mobile (`right-3 bottom-[68px]`).
- Smart Floating Header (v1.1.7): Comportamento de rolagem inteligente com deslocamento expandido para o botão "Entrar / Minha Conta" (`translate-y-[88px]` em mobile ao rolar, +60px adicionais), garantindo visibilidade 100% desimpedida abaixo da barra de ativos.
- Posicionamento Desktop mantido intacto (Identity Manager na esquerda e Canal de Feedback / Voltar ao Topo na direita).

