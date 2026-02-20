# Guia de Rastreamento de Contribuições para Professores

Este guia explica como usar o sistema automatizado de rastreamento de contribuições dos alunos.

## 📋 Visão Geral

O sistema analisa automaticamente o histórico do Git para gerar relatórios detalhados de participação individual dos alunos em projetos de grupo.

### O que é rastreado?

✅ **Commits**: Número total de commits por aluno
✅ **Linhas de código**: Adições e remoções (indica volume de trabalho)
✅ **Arquivos**: Número de arquivos únicos modificados (indica abrangência)
✅ **Documentação**: Commits específicos em arquivos `.md` (participação acadêmica)
✅ **Atividade semanal**: Distribuição temporal das contribuições
✅ **Visualizações**: Gráficos de linha e pizza para análise rápida

## 🚀 Como Usar

### 1. Visualizar Relatório Atual

Em qualquer repositório de projeto dos alunos:

1. Navegue até `docs/CONTRIBUTION_REPORT.md`
2. O relatório mostra todas as métricas automaticamente

**Exemplo de URL:**
```
https://github.com/[ORGANIZATION]/[REPO-ALUNO]/blob/main/docs/CONTRIBUTION_REPORT.md
```

### 2. Executar Manualmente

Se quiser atualizar o relatório imediatamente:

1. Vá na aba **Actions** do repositório
2. Clique em **Contribution Tracker** na lista de workflows
3. Clique em **Run workflow** → **Run workflow**
4. Aguarde 1-2 minutos
5. O relatório será atualizado em `docs/CONTRIBUTION_REPORT.md`

### 3. Verificar Histórico de Execuções

Para ver quando os relatórios foram gerados:

1. Aba **Actions**
2. Veja a lista de execuções do workflow "Contribution Tracker"
3. Clique em qualquer execução para ver detalhes

### 4. Ver Gráficos

Os gráficos são gerados automaticamente em:
- `docs/img/contribution-weekly.png` - Gráfico de linha mostrando atividade semanal
- `docs/img/contribution-total.png` - Gráfico de pizza mostrando distribuição total

Eles são referenciados automaticamente no relatório.

## 📊 Interpretando as Métricas

### Tabela Principal

| Métrica | Significado | Bom Indicador |
|---------|-------------|---------------|
| **Commits** | Frequência de trabalho | 10-50 commits por aluno (projeto semestral) |
| **Linhas+** | Código adicionado | Deve ser proporcional entre membros |
| **Linhas-** | Código removido/refatorado | Normal ter algumas, indica manutenção |
| **Arquivos** | Diversidade de trabalho | >5 arquivos indica boa distribuição |
| **Docs Commits** | Participação em documentação | >3 commits em docs é importante |
| **Docs Arquivos** | Abrangência documental | Cada aluno deve ter pelo menos 1 |

### Gráfico Semanal

📈 **O que observar:**

✅ **Distribuição regular**: Atividade ao longo de várias semanas
⚠️ **Picos únicos**: Muitos commits em apenas 1-2 semanas (trabalho de última hora)
⚠️ **Semanas vazias**: Períodos longos sem commits (falta de engajamento)

### Gráfico de Pizza

🥧 **O que observar:**

✅ **Distribuição equilibrada**: Fatias similares entre membros (20-30% cada em grupo de 4-5)
⚠️ **Desbalanceamento**: Uma pessoa com >50% indica divisão desigual
⚠️ **Ausência**: Fatia <5% indica participação mínima

## 🎓 Cenários Comuns de Avaliação

### Cenário 1: Participação Equilibrada ✅

```
Aluno A: 25 commits, 800 linhas+, 12 arquivos, 4 docs
Aluno B: 22 commits, 750 linhas+, 10 arquivos, 5 docs
Aluno C: 28 commits, 820 linhas+, 14 arquivos, 3 docs
Aluno D: 24 commits, 780 linhas+, 11 arquivos, 4 docs
```

**Interpretação**: Todos participaram ativamente e de forma equilibrada.

### Cenário 2: Um Aluno Dominante ⚠️

```
Aluno A: 68 commits, 2400 linhas+, 35 arquivos, 12 docs
Aluno B: 8 commits, 150 linhas+, 3 arquivos, 1 docs
Aluno C: 5 commits, 120 linhas+, 2 arquivos, 0 docs
Aluno D: 9 commits, 180 linhas+, 4 arquivos, 1 docs
```

**Interpretação**: Aluno A fez a maior parte do trabalho. Investigar distribuição de tarefas.

### Cenário 3: Apenas Documentação vs Apenas Código ⚠️

```
Aluno A: 35 commits, 1200 linhas+, 8 arquivos, 0 docs
Aluno B: 20 commits, 50 linhas+, 15 arquivos (docs), 15 docs
```

**Interpretação**: Divisão clara mas desequilibrada. Ambos devem participar de código E documentação.

### Cenário 4: Trabalho de Última Hora ⚠️

Gráfico semanal mostra:
- Semanas 1-10: 0-2 commits
- Semana 11: 45 commits
- Semana 12: 38 commits

**Interpretação**: Falta de planejamento. Todo trabalho concentrado no final.

## ⚙️ Customização

### Alterar Frequência de Execução

Edite `.github/workflows/contribution-tracker.yml`:

```yaml
on:
  schedule:
    # Semanal (segunda-feira)
    - cron: '0 0 * * 1'

    # OU diário
    - cron: '0 0 * * *'

    # OU duas vezes por semana (segunda e quinta)
    - cron: '0 0 * * 1,4'
```

### Alterar Período Analisado

Edite `.github/scripts/generate_contribution_report.py`:

```python
# Linha ~281 (função main)
# Padrão atual: 24 semanas (1 semestre completo)
weekly_data = get_weekly_commits(weeks_back=24)

# Altere para:
weekly_data = get_weekly_commits(weeks_back=32)  # Semestre + férias (8 meses)
# ou
weekly_data = get_weekly_commits(weeks_back=12)  # Apenas últimos 3 meses
# ou
weekly_data = get_weekly_commits(weeks_back=4)   # Último mês
```

### Desabilitar Temporariamente

Renomeie ou delete `.github/workflows/contribution-tracker.yml`

## 🔍 Limitações e Considerações

### O que o sistema NÃO rastreia

❌ **Code reviews**: Comentários em PRs não são contabilizados
❌ **Reuniões**: Participação em discussões presenciais
❌ **Pesquisa**: Tempo gasto pesquisando soluções
❌ **Issues**: Abertura e resolução de issues (pode ser adicionado)

### Possíveis "Falsos Positivos"

⚠️ **Commits grandes**: Um commit pode adicionar biblioteca inteira (inflaciona métricas)
⚠️ **Refatoração**: Grandes mudanças de formatação podem inflar linhas modificadas
⚠️ **Commits de merge**: Podem duplicar contagem se não feitos corretamente

**Solução**: Sempre revisar o código junto com as métricas, não confiar apenas nos números.

### Boas Práticas

✅ Use as métricas como **indicadores**, não como nota absoluta
✅ Combine com **revisão qualitativa** do código
✅ Converse com os alunos sobre a **distribuição de trabalho**
✅ Considere **contexto**: alguns alunos podem ter tarefas que geram menos commits

## 📞 Suporte

### Relatório não está sendo gerado?

1. Verifique se há commits no repositório
2. Vá em Actions → veja se há erros na execução
3. Execute manualmente para ver mensagens de erro

### Métricas parecem incorretas?

1. Verifique configuração do Git dos alunos (email/nome)
2. Confirme que todos pusham diretamente para `main` ou há merges corretos
3. Rode script localmente para debug:
   ```bash
   cd .github/scripts
   python generate_contribution_report.py
   ```

### Quer adicionar novas métricas?

O script Python é modular. Exemplos de adições possíveis:
- Issues criadas/fechadas (via GitHub API)
- Pull requests abertos/revisados (via GitHub API)
- Code review comments (via GitHub API)
- Participação em discussões

Veja `.github/scripts/README.md` para detalhes técnicos.

## 📚 Recursos Adicionais

- [Documentação do git log](https://git-scm.com/docs/git-log)
- [GitHub Actions - Sintaxe de Cron](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Matplotlib - Documentação de Gráficos](https://matplotlib.org/stable/gallery/index.html)

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0
