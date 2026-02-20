# 🚀 Guia Rápido: Rastreamento de Contribuições

Este template inclui um sistema automatizado para rastrear contribuições individuais dos alunos em projetos de grupo.

## ✨ O que você ganha?

- 📊 **Relatórios automáticos** de participação individual
- 📈 **Gráficos visuais** de contribuições semanais
- 📝 **Métricas objetivas** para avaliação (commits, linhas de código, arquivos, documentação)
- ⏰ **Atualização automática** toda segunda-feira
- 🔍 **Visibilidade completa** da distribuição de trabalho entre membros da equipe

## 🎯 Para Começar (Professores)

### 1️⃣ Criar Repositórios para Alunos

Quando você usa este template no GitHub Classroom:

```bash
# O sistema de rastreamento já está configurado!
# Nada mais precisa ser feito - funciona automaticamente
```

### 2️⃣ Visualizar Contribuições

Em qualquer repositório de aluno:

1. Abra `docs/CONTRIBUTION_REPORT.md`
2. Veja métricas detalhadas e gráficos

**Exemplo de URL:**
```
https://github.com/[ORG]/[REPO-ALUNO]/blob/main/docs/CONTRIBUTION_REPORT.md
```

### 3️⃣ Atualizar Manualmente (Opcional)

Se quiser ver o relatório mais recente antes da próxima segunda-feira:

1. Vá em **Actions** no repositório do aluno
2. Clique em **Contribution Tracker**
3. Clique **Run workflow** → **Run workflow**
4. Aguarde 1-2 minutos
5. Atualize `docs/CONTRIBUTION_REPORT.md`

## 📊 O que é Rastreado?

| Métrica | O que Significa |
|---------|-----------------|
| **Commits** | Frequência de trabalho do aluno |
| **Linhas+** | Código adicionado (volume) |
| **Linhas-** | Código removido/refatorado |
| **Arquivos** | Diversidade de contribuições |
| **Docs Commits** | Participação em documentação |
| **Docs Arquivos** | Abrangência documental |

## 🎓 Exemplos de Uso na Avaliação

### ✅ Participação Equilibrada
```
Aluno A: 25 commits | 800+ linhas | 12 arquivos | 4 docs
Aluno B: 22 commits | 750+ linhas | 10 arquivos | 5 docs
Aluno C: 28 commits | 820+ linhas | 14 arquivos | 3 docs
```
**Interpretação:** Todos participaram ativamente → Nota distribuída igualmente

### ⚠️ Desbalanceamento
```
Aluno A: 68 commits | 2400+ linhas | 35 arquivos | 12 docs
Aluno B:  8 commits |  150+ linhas |  3 arquivos |  1 docs
Aluno C:  5 commits |  120+ linhas |  2 arquivos |  0 docs
```
**Interpretação:** Aluno A fez a maior parte → Conversar com equipe sobre distribuição

## ⚙️ Customização (Opcional)

### Alterar Frequência

Edite `.github/workflows/contribution-tracker.yml`:

```yaml
# De semanal para diário:
- cron: '0 0 * * *'

# Ou duas vezes por semana:
- cron: '0 0 * * 1,4'
```

### Alterar Período Analisado

O padrão atual já é **24 semanas (1 semestre completo)**. Para alterar:

Edite `.github/scripts/generate_contribution_report.py` linha ~281:

```python
# Padrão: 24 semanas (já configurado)
weekly_data = get_weekly_commits(weeks_back=24)

# Para aumentar (semestre + férias):
weekly_data = get_weekly_commits(weeks_back=32)

# Para reduzir (apenas trimestre):
weekly_data = get_weekly_commits(weeks_back=12)
```

## 📚 Documentação Completa

- **[Guia Detalhado para Professores](help/contribution-tracking.md)** - Interpretação de métricas e cenários comuns
- **[Documentação Técnica](.github/scripts/README.md)** - Customização e execução local
- **[Exemplos de Configuração](.github/workflows/contribution-tracker.examples.yml)** - Diferentes cenários de uso

## 🔧 Solução de Problemas

### Relatório não gerado?
1. Verifique se há commits no repositório dos alunos
2. Vá em **Actions** e veja se há erros
3. Execute manualmente para diagnóstico

### Métricas parecem erradas?
1. Verifique se alunos configuraram Git corretamente (nome/email)
2. Confirme que commits estão sendo feitos na branch `main`

### Precisa de ajuda?
- Veja documentação completa em [help/contribution-tracking.md](help/contribution-tracking.md)
- Execute localmente para debug: `.github/scripts/test_local.ps1` (Windows) ou `.github/scripts/test_local.sh` (Linux/Mac)

## 💡 Dicas

✅ **Combine métricas com revisão qualitativa** do código
✅ **Use como indicadores**, não como nota absoluta
✅ **Converse com alunos** sobre a distribuição mostrada nos relatórios
✅ **Observe padrões semanais** - trabalho consistente vs. última hora

---

**Pronto para usar!** O sistema funciona automaticamente assim que os alunos começarem a fazer commits. 🎉
