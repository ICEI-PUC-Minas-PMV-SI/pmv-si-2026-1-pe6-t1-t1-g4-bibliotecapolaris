# Biblioteca Polaris API

API desenvolvida em **Express, Node.js + TypeScript** utilizando **Prisma**.

## Requisitos

- Node.js 18+
- npm

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2026-1-pe6-t1-t1-g4-bibliotecapolaris

cd pmv-si-2026-1-pe6-t1-t1-g4-bibliotecapolaris/src/server

npm install
```

## Configuração do Banco

Este projeto utiliza Prisma como ORM. Configure o arquivo `.env` na raiz do projeto:

```bash
NODE_ENV="development | production"
DATABASE_URL="file:./dev.db"
PORT="3333"
```

- Para desenvolvimento local, utilizamos SQLite.
- Em produção, basta atualizar DATABASE_URL para o banco MariaDB.

## Execução da Aplicação

Para iniciar o servidor em modo desenvolvimento, basta rodar `npm run dev`

O servidor estará disponível em `localhost:3333`

## Observações

Se caso a pasta `/generated` não seja gerada, será necessário executar o comando `npx prisma generate`
