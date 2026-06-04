# Front-end Móvel

## Projeto da Interface Mobile

Este projeto consiste no desenvolvimento de uma interface mobile para o sistema de gestão da Biblioteca da Universidade Polaris. A aplicação tem como objetivo permitir que os usuários interajam com o sistema de forma prática e intuitiva por meio de dispositivos móveis, realizando operações relacionadas ao acervo, como consulta de livros, empréstimos, devoluções e reservas.

O front-end mobile será responsável por consumir os dados fornecidos pela API de back-end, apresentando as informações de maneira organizada, acessível e adaptada às características de smartphones e tablets. Além disso, a aplicação busca proporcionar uma experiência de uso fluida, garantindo navegação eficiente para diferentes perfis de usuários.

## Projeto da Interface

A interface mobile foi desenvolvida em alinhamento com a identidade visual previamente definida para a Universidade Polaris, utilizando a mesma paleta de cores, tipografia e elementos gráficos adotados nos demais módulos do sistema. Essa abordagem assegura consistência visual e fortalece a identidade da plataforma.

Inspirado no conceito da estrela Polaris, o design da aplicação adota uma estética levemente retrô, combinada com princípios modernos de design para dispositivos móveis. As telas foram projetadas com foco na simplicidade, organização e aproveitamento eficiente do espaço disponível, facilitando a visualização das informações e a interação do usuário.

As funcionalidades foram estruturadas para oferecer acesso rápido às principais operações do sistema, permitindo que usuários realizem buscas, empréstimos, devoluções e reservas de itens do acervo de maneira simples e intuitiva. A interface também utiliza componentes padronizados e responsivos, promovendo consistência visual, melhorando a usabilidade e facilitando a manutenção e escalabilidade da aplicação.

## Wireframes

## Tela Inicial

<img width="804" height="1694" alt="image" src="https://github.com/user-attachments/assets/e28c16ff-225b-429d-9675-72571808d4ef" />

## Tela do Livro

<img width="804" height="1618" alt="image" src="https://github.com/user-attachments/assets/ff0ee78f-deb4-4797-8edc-c067dee819b9" />

## Tela de Perfil

<img width="804" height="1362" alt="image" src="https://github.com/user-attachments/assets/f79ac777-96cc-4406-bcdd-719fd44bef65" />

## Tela de Painel de Controle

<img width="804" height="1094" alt="image" src="https://github.com/user-attachments/assets/3a806dfe-8cb0-4898-a91d-539777865a42" />

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

- React Native – Framework utilizado para o desenvolvimento da aplicação mobile, permitindo a criação de interfaces nativas para diferentes plataformas a partir de uma única base de código, promovendo reutilização e eficiência no desenvolvimento.
- Expo – Plataforma e conjunto de ferramentas que simplificam o desenvolvimento, testes e publicação da aplicação mobile, oferecendo recursos integrados que aceleram o processo de criação e manutenção do projeto.
- TypeScript – Linguagem utilizada para adicionar tipagem estática ao JavaScript, aumentando a segurança, legibilidade e manutenibilidade do código, além de auxiliar na identificação de erros durante o desenvolvimento.

## Considerações de Segurança

A aplicação mobile adota um conjunto de práticas e mecanismos de segurança ao longo da sua camada de cliente, abrangendo desde o gerenciamento da sessão autenticada até a proteção das telas privadas e o tratamento adequado de respostas de erro vindas da API. As seções a seguir detalham cada aspecto implementado e as decisões que os motivaram.

### Autenticação com JWT e Gerenciamento de Sessão

A autenticação é realizada por meio de um **token JWT** emitido pelo backend após a validação das credenciais. O token e os dados do usuário autenticado são persistidos no **AsyncStorage** e disponibilizados globalmente para a aplicação por meio de um **AuthContext**, o que permite manter a sessão ativa entre encerramentos do aplicativo e centralizar o estado de autenticação em um único ponto.

```ts
// src/mobile/context/AuthContext.tsx
const [storedUser, storedToken] = await Promise.all([
  AsyncStorage.getItem(USER_KEY),
  AsyncStorage.getItem(TOKEN_KEY),
]);

if (storedUser && storedToken) {
  const payload = JSON.parse(atob(storedToken.split('.')[1]));
  const expired = payload.exp && Date.now() / 1000 > payload.exp;

  if (expired) {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
  } else {
    setUser(JSON.parse(storedUser));
    setAuthToken(storedToken);
  }
}
```

Ao restaurar a sessão, a expiração do token é verificada antes de considerá-la válida, evitando que o usuário continue navegando com um JWT já vencido. Quando o token expira ou é considerado inválido pelo servidor, a sessão é encerrada automaticamente.

### Proteção de Telas Privadas

Telas que dependem de autenticação verificam o estado do `AuthContext` antes de renderizar conteúdo ou disparar requisições. O painel administrativo, em particular, valida o tipo do usuário logo após o carregamento da sessão e redireciona para a página inicial caso o acesso seja indevido.

```ts
// src/mobile/app/admin/index.tsx
useEffect(() => {
  if (authLoading) return;
  if (!user || user.type !== 'administrator') {
    router.replace('/');
  }
}, [authLoading, user]);
```

Esse mecanismo garante que a tela de **Painel de Controle**, restrita a administradores, não seja acessível por contas comuns mesmo via navegação direta pela URL.

### Logout Automático em Respostas Não Autorizadas

Todas as requisições HTTP da aplicação passam por um wrapper centralizado (`apiFetch`), que injeta automaticamente o cabeçalho `Authorization: Bearer <token>` em rotas autenticadas e detecta respostas `401 Unauthorized`. Quando isso ocorre, a sessão é encerrada e o usuário é redirecionado para a tela de login, prevenindo que a interface continue tentando operar com um token inválido.

```ts
// src/mobile/util/api.ts
const res = await fetch(`${API_URL}${path}`, { headers: resolvedHeaders, ...rest });

if (res.status === 401 && _onUnauthorized) {
  _onUnauthorized();
}
```

### Controle de Acesso por Papel na Interface

Além da proteção de telas, a interface se adapta dinamicamente ao papel do usuário autenticado. Botões e ações sensíveis — como acesso ao Painel de Controle, exclusão de livros e ajustes administrativos — só são renderizados quando o usuário possui o papel `administrator`. O controle de acesso efetivo é sempre validado pelo backend, evitando que manipulação do cliente conceda privilégios indevidos.

### Validação de Entrada nos Formulários

Os formulários de cadastro, login e ações administrativas validam os campos antes do envio à API, restringindo formato e tamanho mínimo de e-mail, senha e demais dados. A validação definitiva — incluindo regras de negócio — é sempre realizada pelo backend com **Zod**, que retorna erros padronizados (`HTTP 400`) tratados de forma consistente pela interface.

### Tratamento de Erros e Não-Exposição de Dados Sensíveis

As respostas de erro da API são tratadas por um modal de alerta padronizado (`AlertModal`), que apresenta mensagens claras e amigáveis ao usuário sem expor detalhes internos do servidor. Erros silenciosos como falhas na recuperação da _wishlist_ quando o usuário não está autenticado são suprimidos para evitar poluição visual durante a restauração da sessão.

### Variáveis de Ambiente

A URL da API é configurada via variável de ambiente (`EXPO_PUBLIC_API_URL`), permitindo trocar facilmente o destino entre os ambientes de desenvolvimento e produção sem necessidade de alterações no código-fonte. O arquivo `.env` não é rastreado pelo Git, isolando configurações específicas do ambiente local.

### Melhorias Previstas

As seguintes práticas de segurança foram identificadas como próximos passos prioritários para elevar o nível de proteção da camada mobile:

| Melhoria                                   | Descrição                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Armazenamento seguro do token              | Substituir o `AsyncStorage` por soluções como **Expo SecureStore**, que utiliza o _Keychain_ (iOS) e _Keystore_ (Android)        |
| Refresh Token                              | Adoção de fluxo com tokens de curta duração e _refresh tokens_, reduzindo o impacto de um token comprometido                     |
| Rate Limiting no cliente                   | Controle de tentativas seguidas de login no front-end como camada complementar à proteção do backend                             |
| Certificate Pinning                        | Fixação do certificado TLS para evitar ataques de interceptação em redes não confiáveis                                          |

## Implantação

A aplicação mobile foi desenvolvida utilizando React Native com Expo, plataforma que permitiu a compilação e geração do pacote de instalação para dispositivos Android. Foram realizadas as configurações necessárias para comunicação com a API e com os serviços de back-end do sistema, garantindo o funcionamento das funcionalidades implementadas.

Ao final do desenvolvimento, foi gerado o arquivo APK da aplicação, disponibilizado para download e instalação [aqui](www.google.com).

## Testes

Foram implementados testes automatizados utilizando Jest e React Native Testing Library (RNTL):

Os testes podem ser executados via linha de comando dentro do diretório `src/mobile/`:

- **Executar todos os testes:** `npm test`

### 1. Testes Relacionados aos Livros (AddBookModal)

Foco em testar de forma isolada a renderização, a lógica interna do formulário móvel, a validação de campos e a integração com os serviços de salvamento de livros e exibição de alertas.

- **Ferramentas:** Jest (test runner), `@testing-library/react-native` (renderização e interação com componentes nativos), `jest-expo` (configuração do ambiente Expo).
- **Escopo Implementado:** Testes detalhados para o componente `AddBookModal`.
- **Cenários Cobertos:**
  - **Renderização correta:** Valida se o modal e seus inputs (ISBN, Nome, Autor, Ano, Categorias, Descrição) aparecem em tela quando a propriedade `open` é verdadeira.
  - **Controle de visibilidade:** Garante que o conteúdo do modal permaneça oculto quando `open` é falso.
  - **Interatividade do formulário:** Assegura que o estado interno do formulário é devidamente atualizado à medida que o usuário digita nos campos.
  - **Submissão de dados (Criação):** Verifica se a função `addNewBook` é chamada com os dados mapeados após o debounce do ISBN e pressão do botão "Adicionar".
  - **Submissão de dados (Edição):** Garante que o fluxo de edição invoca corretamente `updateBook` em vez de `addNewBook` e passa os parâmetros corretos do livro preexistente.
  - **Fluxo de feedback visual (Sucesso):** Valida a chamada do alerta de sucesso (`showSuccess`) ao concluir a inserção ou atualização.
  - **Tratamento de erros:** Valida se a mensagem de exceção vinda da API é exibida corretamente por meio do modal de erro (`showError`).

Abaixo, apresenta-se a saída da execução dos testes unitários (Jest) no console da aplicação móvel, evidenciando o sucesso de todos os cenários implementados:

<img width="507" height="311" alt="Captura de tela 2026-06-03 185939" src="https://github.com/user-attachments/assets/5f14ac8d-436d-4d0a-a4f6-f28b449541c9" />

### Testes Relacionados a Usuários

No aplicativo Mobile, a entidade de Usuários possui um papel vital para o controle de sessão, segurança e gerenciamento de perfis. Para garantir a confiabilidade da aplicação e a melhor experiência para o usuário, desenvolvemos testes unitários abrangentes com foco na comunicação da nossa camada de Serviços com a API REST.

Nossos testes garantem que o aplicativo Mobile constrói corretamente os payloads, utiliza os verbos HTTP adequados e, principalmente, intercepta os erros da API com precisão para que a interface gráfica possa alertar o usuário corretamente.

**Cobertura de Testes (CRUD e Regras de Negócio):**
* **Autenticação/Login (POST):** Validação de sucesso (salvando o Token JWT na sessão) e interceptação de credenciais inválidas (Erro 401 Unauthorized).
* **Registro e Segurança (POST):** Validação rigorosa do repasse de erros 400 Bad Request e 409 Conflict retornados pelo Back-end, cobrindo:
  * Tentativas de cadastro com campos vazios.
  * Nomes fora do limite mínimo de caracteres.
  * Formatos de e-mail institucional inválidos.
  * Força de senha (exigência de tamanho mínimo, letras maiúsculas e caracteres especiais).
  * Prevenção de duplicidade (E-mail já em uso).
* **Leitura de Dados (GET):** Busca de perfil de usuário por *slug* e listagem de estudantes, garantindo a injeção correta do cabeçalho de autenticação nas rotas protegidas.

<img width="579" height="404" alt="T" src="https://github.com/user-attachments/assets/ac98fcec-91dd-4421-9d75-0259058e5295" />


# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
