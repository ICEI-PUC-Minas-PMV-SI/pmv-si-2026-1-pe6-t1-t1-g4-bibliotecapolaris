# Script PowerShell para testar a geração de relatório localmente
# Útil para professores/administradores verificarem antes de fazer commit

Write-Host "🔍 Testando geração de relatório de contribuições localmente..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Python está instalado
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
} else {
    Write-Host "❌ Python não encontrado. Por favor, instale Python 3.7+" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python encontrado: $pythonCmd" -ForegroundColor Green

# Verificar se está em um repositório Git
$gitCheck = git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não está em um repositório Git" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Repositório Git detectado" -ForegroundColor Green
Write-Host ""

# Verificar e instalar dependências
Write-Host "📦 Verificando dependências Python..." -ForegroundColor Yellow
& $pythonCmd -c "import matplotlib, pandas, tabulate" 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Dependências não encontradas. Instalando..." -ForegroundColor Yellow
    & $pythonCmd -m pip install matplotlib pandas tabulate

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Falha ao instalar dependências" -ForegroundColor Red
        Write-Host "Execute manualmente: pip install matplotlib pandas tabulate" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Gerando relatório..." -ForegroundColor Cyan
Write-Host ""

# Ir para o diretório raiz do repositório
$repoRoot = git rev-parse --show-toplevel
Set-Location $repoRoot

# Executar script
& $pythonCmd .github/scripts/generate_contribution_report.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Relatório gerado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Arquivos criados:" -ForegroundColor Cyan
    Write-Host "   - docs/CONTRIBUTION_REPORT.md"

    if (Test-Path "docs/img/contribution-weekly.png") {
        Write-Host "   - docs/img/contribution-weekly.png"
    }

    if (Test-Path "docs/img/contribution-total.png") {
        Write-Host "   - docs/img/contribution-total.png"
    }

    Write-Host ""
    Write-Host "💡 Para visualizar o relatório:" -ForegroundColor Yellow
    Write-Host "   Get-Content docs/CONTRIBUTION_REPORT.md"
    Write-Host ""
    Write-Host "💡 Para fazer commit das mudanças:" -ForegroundColor Yellow
    Write-Host "   git add docs/"
    Write-Host "   git commit -m '📊 Atualizar relatório de contribuições'"
    Write-Host "   git push"
} else {
    Write-Host "❌ Erro ao gerar relatório" -ForegroundColor Red
    exit 1
}
