# Front-end Móvel

## Projeto da Interface Mobile

Este projeto consiste no desenvolvimento de uma interface mobile para o sistema de gestão da Biblioteca da Universidade Polaris. A aplicação tem como objetivo permitir que os usuários interajam com o sistema de forma prática e intuitiva por meio de dispositivos móveis, realizando operações relacionadas ao acervo, como consulta de livros, empréstimos, devoluções e reservas.

O front-end mobile será responsável por consumir os dados fornecidos pela API de back-end, apresentando as informações de maneira organizada, acessível e adaptada às características de smartphones e tablets. Além disso, a aplicação busca proporcionar uma experiência de uso fluida, garantindo navegação eficiente para diferentes perfis de usuários.

## Projeto da Interface
A interface mobile foi desenvolvida em alinhamento com a identidade visual previamente definida para a Universidade Polaris, utilizando a mesma paleta de cores, tipografia e elementos gráficos adotados nos demais módulos do sistema. Essa abordagem assegura consistência visual e fortalece a identidade da plataforma.

Inspirado no conceito da estrela Polaris, o design da aplicação adota uma estética levemente retrô, combinada com princípios modernos de design para dispositivos móveis. As telas foram projetadas com foco na simplicidade, organização e aproveitamento eficiente do espaço disponível, facilitando a visualização das informações e a interação do usuário.

As funcionalidades foram estruturadas para oferecer acesso rápido às principais operações do sistema, permitindo que usuários realizem buscas, empréstimos, devoluções e reservas de itens do acervo de maneira simples e intuitiva. A interface também utiliza componentes padronizados e responsivos, promovendo consistência visual, melhorando a usabilidade e facilitando a manutenção e escalabilidade da aplicação.

### Wireframes

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

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

## Implantação
A aplicação mobile foi desenvolvida utilizando React Native com Expo, plataforma que permitiu a compilação e geração do pacote de instalação para dispositivos Android. Foram realizadas as configurações necessárias para comunicação com a API e com os serviços de back-end do sistema, garantindo o funcionamento das funcionalidades implementadas.

Ao final do desenvolvimento, foi gerado o arquivo APK da aplicação, disponibilizado para download e instalação [aqui](www.google.com).

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
