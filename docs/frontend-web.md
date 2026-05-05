# Front-end Web

Este projeto consiste no desenvolvimento de uma interface web para o sistema de gestão da Biblioteca da Universidade Polaris. A aplicação tem como objetivo permitir que usuários interajam de forma intuitiva com o sistema, realizando operações relacionadas ao acervo, como consulta de livros, empréstimos, devoluções e reservas.

O front-end será responsável por consumir os dados fornecidos pela API de back-end, apresentando as informações de maneira organizada e acessível, além de garantir uma boa experiência de navegação e usabilidade para diferentes perfis de usuários.

## Projeto da Interface Web

A interface web da aplicação foi desenvolvida em alinhamento com a identidade visual previamente definida para a Universidade Polaris, aproveitando a mesma paleta de cores, tipografia e elementos gráficos, a fim de garantir consistência entre os diferentes módulos do sistema.

Inspirado no conceito da estrela Polaris, o design adota uma estética levemente retrô, com foco em centralização e clareza visual. O layout das páginas foi estruturado de forma organizada, priorizando a distribuição equilibrada dos elementos em tela e facilitando a navegação do usuário.

As interações foram projetadas para serem simples e diretas, permitindo que usuários realizem ações como busca, empréstimo, devolução e reserva de itens do acervo de maneira rápida e intuitiva.
Além disso, a interface utiliza componentes padronizados, promovendo consistência visual e melhorando a usabilidade, ao mesmo tempo em que facilita a manutenção e escalabilidade do sistema.

### Wireframes

## Tela Inicial
<img width="3840" height="4426" alt="Tela Inicial" src="https://github.com/user-attachments/assets/be67409a-50ce-4f7c-9fc2-2c69a81770c4" />

## Tela de Livro
<img width="3840" height="2930" alt="Tela de livro" src="https://github.com/user-attachments/assets/3da7bb78-6718-44f1-8b06-e70b01d5367a" />

## Tela de Perfil
<img width="3840" height="3830" alt="Tela de Perfil" src="https://github.com/user-attachments/assets/bb005a62-a2b9-4c0d-b960-3941f6dd4ba3" />

## Tela de Painel de Controle
<img width="3840" height="2160" alt="Tela de Painel de controle" src="https://github.com/user-attachments/assets/cbf8b8da-9e18-4014-b40e-1faed07859e7" />

### Design Visual
O estilo visual da interface foi projetado com foco em clareza, consistência e legibilidade, utilizando uma paleta de cores bem definida e de alto contraste. A aplicação adota um tema escuro como base, com tons predominantes de fundo em preto e variações próximas, combinados com cores claras para texto, garantindo conforto visual e fácil leitura.

A paleta também inclui cores específicas para estados de interação e feedback do sistema, como sucesso, aviso e erro, permitindo que o usuário identifique rapidamente o resultado de suas ações. Além disso, variações de cores são utilizadas em botões para indicar estados como ativo, inativo e hover, reforçando a interatividade da interface.

No que diz respeito à tipografia, o projeto utiliza a combinação de fontes serifadas e sem serifa, criando uma hierarquia visual clara entre títulos, rótulos e campos de entrada. Essa escolha contribui para uma leitura mais organizada e para a distinção entre diferentes tipos de informação.

Os componentes visuais, como campos de busca e formulários, seguem um padrão consistente de espaçamento, tipografia e cores, garantindo uniformidade em toda a aplicação. Ícones e elementos gráficos são utilizados de forma discreta, priorizando a funcionalidade e evitando poluição visual.

De forma geral, o design busca ser direto e objetivo, reduzindo distrações e facilitando a navegação, ao mesmo tempo em que mantém uma identidade visual marcante e coerente com o restante do sistema.

## Fluxo de Dados

### 1. Autenticação do usuário
 - O fluxo se inicia na tela de login, onde o usuário insere suas credenciais.
 - Esses dados são enviados para a API de back-end, responsável por validar as informações.

#### Após a validação:
 - A API retorna os dados do usuário
 - Inclui o tipo de usuário (ex: estudante ou administrador)
 - Um token de autenticação é gerado
Essas informações são armazenadas no front-end, permitindo manter a sessão ativa e controlar o acesso às funcionalidades.

### 2. Controle de acesso e estado da aplicação
Com o usuário autenticado:
- O sistema armazena o estado global (usuário + permissões)
- A interface se adapta dinamicamente com base no tipo de usuário

Exemplos:
- Estudante → acesso a operações padrão
- Administrador → acesso a funcionalidades avançadas

### 3. Navegação e carregamento de dados
Ao acessar a aplicação:
- A página inicial requisita dados básicos à API
- A listagem de livros é carregada por meio de requisições ao back-end

Quando o usuário seleciona um livro:
 - O usuário é redirecionado a página do livro selecionado
 - A interface é atualizada com essas informações

### 4. Interações do usuário (operações)
Usuários autenticados podem realizar ações como:
 - Empréstimo de livros
 - Favoritar itens

Fluxo dessas ações:
 - O usuário interage com a interface
 - O front-end envia a requisição para a API

A API valida:
 - Autenticação
 - Permissão do usuário
A API processa a ação e retorna o resultado. O front-end atualiza a interface com base na resposta

### 5. Página de perfil
A página de perfil:
- Pode ser acessada por usuários autenticados

Regras:
 - Visualização → permitida
 - Edição → restrita ao próprio usuário

Validação:
 - O front-end controla a interface
 - O back-end garante a segurança

### 6. Painel administrativo
- O painel de controle:
- É exclusivo para usuários administradores

Fluxo:
- As ações realizadas enviam requisições específicas para a API
- A API valida privilégios antes de executar qualquer operação

7. Padrão geral do fluxo
- De forma geral, a aplicação segue o padrão cliente-servidor:

O front-end:
- Solicita dados
- Envia ações do usuário
- Atualiza a interface

O back-end:
- Processa regras de negócio
- Valida autenticação e autorização
- Retorna respostas estruturadas

## Tecnologias Utilizadas
O desenvolvimento da interface web foi realizado utilizando tecnologias modernas do ecossistema JavaScript, com foco em desempenho, escalabilidade e organização do código.

#### React
Biblioteca utilizada para construção da interface de usuário baseada em componentes, permitindo maior reutilização de código e organização da aplicação.

#### Next.js
Framework utilizado para estruturar a aplicação, oferecendo recursos como roteamento, renderização otimizada e melhor organização do projeto.

#### TypeScript
Linguagem utilizada para adicionar tipagem estática ao JavaScript, aumentando a segurança, legibilidade e manutenibilidade do código.

#### Tailwind CSS
Framework de estilização utilizado para construir a interface de forma rápida e consistente, através de classes utilitárias e padronização visual dos componentes.

## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
