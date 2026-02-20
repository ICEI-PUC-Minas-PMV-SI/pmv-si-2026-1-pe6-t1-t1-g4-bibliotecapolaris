#!/bin/bash
# Script para testar a geração de relatório localmente
# Útil para professores/administradores verificarem antes de fazer commit

echo "🔍 Testando geração de relatório de contribuições localmente..."
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python não encontrado. Por favor, instale Python 3.7+"
    exit 1
fi

# Determinar comando Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
else
    PYTHON_CMD=python
fi

echo "✅ Python encontrado: $PYTHON_CMD"

# Verificar se está em um repositório Git
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "❌ Não está em um repositório Git"
    exit 1
fi

echo "✅ Repositório Git detectado"
echo ""

# Verificar e instalar dependências
echo "📦 Verificando dependências Python..."
$PYTHON_CMD -c "import matplotlib, pandas, tabulate" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Dependências não encontradas. Instalando..."
    $PYTHON_CMD -m pip install matplotlib pandas tabulate

    if [ $? -ne 0 ]; then
        echo "❌ Falha ao instalar dependências"
        echo "Execute manualmente: pip install matplotlib pandas tabulate"
        exit 1
    fi
    echo "✅ Dependências instaladas"
else
    echo "✅ Dependências já instaladas"
fi

echo ""
echo "🚀 Gerando relatório..."
echo ""

# Ir para o diretório raiz do repositório
cd "$(git rev-parse --show-toplevel)" || exit 1

# Executar script
$PYTHON_CMD .github/scripts/generate_contribution_report.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Relatório gerado com sucesso!"
    echo ""
    echo "📄 Arquivos criados:"
    echo "   - docs/CONTRIBUTION_REPORT.md"

    if [ -f "docs/img/contribution-weekly.png" ]; then
        echo "   - docs/img/contribution-weekly.png"
    fi

    if [ -f "docs/img/contribution-total.png" ]; then
        echo "   - docs/img/contribution-total.png"
    fi

    echo ""
    echo "💡 Para visualizar o relatório:"
    echo "   cat docs/CONTRIBUTION_REPORT.md"
    echo ""
    echo "💡 Para fazer commit das mudanças:"
    echo "   git add docs/"
    echo "   git commit -m '📊 Atualizar relatório de contribuições'"
    echo "   git push"
else
    echo "❌ Erro ao gerar relatório"
    exit 1
fi
