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

<img width="3840" height="2930" alt="Tela de Livro" src="https://github.com/user-attachments/assets/b7429f72-07e1-4397-896a-c8b8b82a29bc" />

## Tela de Perfil

<img width="3840" height="3830" alt="Tela de Perfil" src="https://github.com/user-attachments/assets/bb005a62-a2b9-4c0d-b960-3941f6dd4ba3" />

## Tela de Painel de Controle

<img width="3840" height="2160" alt="Tela de Painel de Controle" src="https://github.com/user-attachments/assets/f151abb1-8c0f-4132-b6aa-98cb8e4a74e0" />

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

- React - Biblioteca utilizada para construção da interface de usuário baseada em componentes, permitindo maior reutilização de código e organização da aplicação.
- Next.js - Framework utilizado para estruturar a aplicação, oferecendo recursos como roteamento, renderização otimizada e melhor organização do projeto.
- TypeScript - Linguagem utilizada para adicionar tipagem estática ao JavaScript, aumentando a segurança, legibilidade e manutenibilidade do código.

- Tailwind CSS - Framework de estilização utilizado para construir a interface de forma rápida e consistente, através de classes utilitárias e padronização visual dos componentes.

## Considerações de Segurança

A aplicação web adota um conjunto de práticas e mecanismos de segurança ao longo da sua camada de cliente, abrangendo desde o gerenciamento da sessão autenticada até a proteção das rotas privadas e o tratamento adequado de respostas de erro vindas da API. As seções a seguir detalham cada aspecto implementado e as decisões que os motivaram.

### Autenticação com JWT e Gerenciamento de Sessão

A autenticação é realizada por meio de um **token JWT** emitido pelo backend após a validação das credenciais. O token e os dados do usuário autenticado são persistidos no `localStorage` e disponibilizados globalmente para a aplicação por meio de um **AuthContext**, o que permite manter a sessão ativa entre recargas de página e centralizar o estado de autenticação em um único ponto.

```ts
// src/web/src/context/AuthContext.tsx
const stored = localStorage.getItem("auth");
if (stored) {
  const parsed = JSON.parse(stored) as StoredAuth;
  if (isTokenExpired(parsed.token)) {
    localStorage.removeItem("auth");
    return;
  }
  setUser(parsed.user);
  setToken(parsed.token);
}
```

Ao restaurar a sessão, a expiração do token é verificada antes de considerá-la válida, evitando que o usuário continue navegando com um JWT já vencido. Quando o token expira ou é considerado inválido pelo servidor, a sessão é encerrada automaticamente.

### Proteção de Rotas Privadas

Páginas que dependem de autenticação são envolvidas por um componente **`ProtectedRoute`**, responsável por verificar se há um usuário autenticado e, opcionalmente, se ele possui o papel necessário para acessar a rota. Caso o usuário não esteja autenticado, é redirecionado para a tela de login; caso não tenha permissão suficiente, é redirecionado para a página inicial.

```tsx
// src/web/src/components/Global/ProtectedRoute.tsx
export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/LoginPage");
    else if (requiredRole && user.role !== requiredRole) router.replace("/");
  }, [user, isLoading, requiredRole, router]);

  if (isLoading || !user) return null;
  if (requiredRole && user.role !== requiredRole) return null;
  return <>{children}</>;
}
```

Esse mecanismo garante que telas como o **Painel de Controle**, restrito a administradores, não sejam acessíveis por contas comuns mesmo via digitação direta da URL.

### Logout Automático em Respostas Não Autorizadas

Todas as requisições HTTP da aplicação passam por um wrapper centralizado (`apiFetch`), que injeta automaticamente o cabeçalho `Authorization: Bearer <token>` em rotas autenticadas e detecta respostas `401 Unauthorized`. Quando isso ocorre, a sessão é encerrada e o usuário é redirecionado para a tela de login, prevenindo que a interface continue tentando operar com um token inválido.

```ts
// src/web/src/lib/api.ts
if (auth && res.status === 401) {
  localStorage.removeItem("auth");
  window.location.href = "/LoginPage";
}
```

### Controle de Acesso por Papel na Interface

Além da proteção de rotas, a interface se adapta dinamicamente ao papel do usuário autenticado. Botões e links sensíveis — como acesso ao Painel de Controle, exclusão de livros e ajustes administrativos — só são renderizados quando o usuário possui o papel `administrator`. Vale destacar que esse controle é apenas uma camada de **usabilidade**: a autorização efetiva é sempre validada pelo backend, evitando que manipulação do cliente conceda privilégios indevidos.

### Validação de Entrada nos Formulários

Os formulários de cadastro, login e ações administrativas validam os campos antes do envio à API, restringindo formato e tamanho mínimo de e-mail, senha e demais dados. Essa camada visa fornecer feedback imediato ao usuário e reduzir requisições inválidas, mas a validação definitiva — incluindo regras de negócio — é sempre realizada pelo backend com **Zod**, que retorna erros padronizados (`HTTP 400`) tratados de forma consistente pela interface.

### Tratamento de Erros e Não-Exposição de Dados Sensíveis

As respostas de erro da API são tratadas por um modal de alerta padronizado (`AlertModal`), que apresenta mensagens claras e amigáveis ao usuário sem expor detalhes internos do servidor, identificadores de banco ou _stack traces_. Erros silenciosos como `401` em rotas opcionais (por exemplo, recuperação inicial da _wishlist_) são suprimidos para evitar poluição visual quando a sessão ainda está sendo restaurada.

### Variáveis de Ambiente

A URL da API é configurada via variáveis de ambiente (`NEXT_PUBLIC_API_URL`), permitindo trocar facilmente o destino entre os ambientes de desenvolvimento e produção sem necessidade de alterações no código-fonte. O arquivo `.env.local` não é rastreado pelo Git, isolando configurações específicas do ambiente local da equipe.

### HTTPS e Comunicação Segura

Em ambiente de produção, toda a comunicação entre o cliente e o servidor é realizada por meio de **HTTPS**, garantindo a criptografia em trânsito das credenciais, do token JWT e dos dados pessoais trocados durante a sessão.

### Melhorias Previstas

As seguintes práticas de segurança foram identificadas como próximos passos prioritários para elevar o nível de proteção da camada web:

| Melhoria                                   | Descrição                                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Armazenamento do token em cookies HttpOnly | Substituir o `localStorage` por cookies seguros e marcados como `HttpOnly`, mitigando o risco de roubo de token via XSS |
| Refresh Token                              | Adoção de fluxo com tokens de curta duração e _refresh tokens_, reduzindo o impacto de um token comprometido            |
| Content Security Policy (CSP)              | Configuração de cabeçalhos CSP para restringir origens permitidas de scripts, estilos e imagens                         |
| Sanitização explícita de conteúdo          | Aplicação de bibliotecas como **DOMPurify** em campos que possam vir a renderizar HTML proveniente do usuário           |
| Proteção contra CSRF                       | Implementação de tokens _anti-CSRF_ em conjunto com o uso de cookies para autenticação                                  |
| Rate Limiting no cliente                   | Controle de tentativas seguidas de login no front-end como camada complementar à proteção do backend                    |

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

Foi implementado testes automatizados de integração utilizando Jest e React Testing Library (RTL):

Os testes podem ser executados via linha de comando dentro do diretório `src/web/`:

- **Executar todos os testes:** `npm test`

### 1. Testes Relacionados aos Livros

Foco em testar a lógica interna dos componentes, validações de formulário e chamadas de serviços de forma isolada.

- **Ferramentas:** Jest (test runner), React Testing Library (renderização de componentes), ts-jest (suporte a TypeScript).
- **Escopo Implementado:** Testes detalhados para o componente `AddBookModal`.
- **Cenários Cobertos:**
  - Renderização correta em modo de "criação" e "edição".
  - Comportamento de debounce e mock visual da capa do livro (integração visual).
  - Chamadas corretas aos serviços da API (`addNewBook` e `updateBook`).
  - Integração com o contexto global de alertas (`useAlertModal`) para feedback visual.
  - Tratamento de exceções (erros 400/500 da API).

A imagem a seguir apresenta a execução dos testes unitários (Jest), evidenciando a cobertura e validação dos cenários mapeados:

<img width="693" height="447" alt="test-books" src="https://github.com/user-attachments/assets/225b2c40-8828-40b2-80e7-b6d8a70e5306" />

### 2. ControlPanel e Empréstimos:

<img width="803" height="1026" alt="image" src="https://github.com/user-attachments/assets/aebf1ae0-a6bb-400a-a8d5-239d0e6b926e" />

### 3. Autenticação e Registro de Usuários

Foco em testar o fluxo completo de cadastro de usuários, garantindo a robustez das validações de formulário (client-side) e a correta resposta da interface frente às diferentes interações com a API.

- **Ferramentas:** Jest (test runner), React Testing Library (renderização de componentes), ts-jest (suporte a TypeScript).
- **Escopo Implementado:** Testes detalhados para a tela de registro (`SignPage`).
- **Cenários Cobertos:**
  - Renderização correta do formulário e seus respectivos campos de entrada (Nome, Email e Senha).
  - Fluxo de sucesso: preenchimento válido, chamada correta aos serviços da API (`registerUser`), exibição do modal de confirmação e redirecionamento seguro de rota.
  - Tratamento de exceções da API: exibição de feedback visual adequado quando o servidor recusa o cadastro (ex: e-mail já existente ou senha fora do padrão).
  - Validações de Front-end: bloqueio de envio de requisições quando os campos obrigatórios estão vazios ou quando o formato do e-mail é inválido.
  - Integração com contextos globais de alerta (`useAlertModal`) e roteamento do Next.js (`useRouter`).

A imagem a seguir apresenta a execução dos testes unitários (Jest) da rotina de usuários, evidenciando a cobertura e validação dos cenários mapeados:

<img width="660" height="250" alt="a" src="https://github.com/user-attachments/assets/0532908a-b8b7-4f88-9454-2d2ac39df336" />


# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
