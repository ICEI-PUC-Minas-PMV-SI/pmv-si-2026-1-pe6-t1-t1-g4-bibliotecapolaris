# Scripts de Automação

Este diretório contém scripts para rastreamento automático de contribuições dos alunos.

## 📊 generate_contribution_report.py

Gera relatório detalhado de contribuições incluindo:
- Commits por autor
- Linhas de código adicionadas/removidas
- Arquivos modificados
- Contribuições em documentação
- Visualizações gráficas

### Execução Automática

O script é executado automaticamente via GitHub Actions:
- ⏰ **Toda segunda-feira às 00:00 UTC**
- 🔄 **A cada push em `src/` ou `docs/`**
- 🖱️ **Manualmente via GitHub Actions** (aba Actions → Contribution Tracker → Run workflow)

> **Nota:** O workflow **não executa no repositório template** (repositórios com "Template" no nome). Ele só será ativado automaticamente nos repositórios dos alunos criados a partir do template.

### Execução Local (Opcional)

Para gerar o relatório localmente antes de fazer commit:

#### Opção 1: Script Automatizado (Recomendado)

**Linux/macOS:**
```bash
bash .github/scripts/test_local.sh
```

**Windows (PowerShell):**
```powershell
.\.github\scripts\test_local.ps1
```

Os scripts automaticamente:
- ✅ Verificam se Python está instalado
- ✅ Instalam dependências se necessário
- ✅ Geram o relatório e gráficos
- ✅ Mostram instruções para commit

#### Opção 2: Execução Manual

```bash
# 1. Instalar dependências Python
pip install matplotlib pandas tabulate

# 2. Executar script (do diretório raiz do repositório)
python .github/scripts/generate_contribution_report.py

# 3. Ver resultado
cat docs/CONTRIBUTION_REPORT.md
```

### Saída Gerada

O script cria:
- `docs/CONTRIBUTION_REPORT.md` - Relatório completo em Markdown
- `docs/img/contribution-weekly.png` - Gráfico de contribuições semanais
- `docs/img/contribution-total.png` - Gráfico de distribuição total de commits

## 🎓 Para Professores

### Visualizando Contribuições de Alunos

1. **Via GitHub**: Acesse a aba "Actions" do repositório do aluno para ver o histórico de execuções
2. **Via Relatório**: Acesse `docs/CONTRIBUTION_REPORT.md` no repositório
3. **Executar Manualmente**:
   - Vá em Actions → Contribution Tracker → Run workflow
   - Aguarde 1-2 minutos
   - O relatório será atualizado automaticamente

### Interpretando as Métricas

- **Commits**: Total de commits - indica frequência de trabalho
- **Linhas+/-**: Quantidade de código - indica volume de trabalho
- **Arquivos**: Diversidade de contribuições - indica abrangência
- **Docs Commits**: Participação em documentação - importante para avaliação acadêmica
- **Gráfico Semanal**: Mostra consistência e distribuição temporal do trabalho
- **Gráfico Pizza**: Mostra distribuição relativa entre membros da equipe

### Dicas de Avaliação

✅ **Bons Indicadores:**
- Contribuições distribuídas ao longo das semanas (não apenas no final)
- Participação tanto em código quanto em documentação
- Commits regulares e incrementais

⚠️ **Pontos de Atenção:**
- Muitos commits em um único dia (possível trabalho de última hora)
- Zero contribuições em documentação (falta de participação acadêmica)
- Desbalanceamento extremo entre membros (possível divisão desigual)

## 🔧 Customização

### Alterar Frequência de Execução

Edite `.github/workflows/contribution-tracker.yml`:

```yaml
on:
  schedule:
    # Para rodar diariamente às 00:00
    - cron: '0 0 * * *'

    # Para rodar às segundas e sextas
    - cron: '0 0 * * 1,5'
```

### Alterar Período de Análise

Edite `generate_contribution_report.py`, linha com `get_weekly_commits`:

```python
# Padrão atual: 24 semanas (1 semestre completo)
weekly_data = get_weekly_commits(weeks_back=24)

# Para analisar últimas 12 semanas (3 meses)
weekly_data = get_weekly_commits(weeks_back=12)

# Para analisar últimas 32 semanas (8 meses - semestre + férias)
weekly_data = get_weekly_commits(weeks_back=32)
```

### Adicionar Novas Métricas

O script Python é modular. Para adicionar novas análises:

1. Crie uma nova função de coleta de dados
2. Adicione chamada em `main()`
3. Inclua os dados no `generate_markdown_report()`

Exemplos de métricas adicionais possíveis:
- Issues criadas/resolvidas por aluno
- Pull Requests criados/revisados
- Comentários em code reviews
- Participação em discussões

## 📝 Notas Técnicas

- O script usa `git log` para análise local
- GitHub API poderia ser usada para métricas adicionais (issues, PRs)
- Relatórios são commitados automaticamente com `[skip ci]` para evitar loops
- Funciona sem dependências Python (modo simplificado) se necessário
