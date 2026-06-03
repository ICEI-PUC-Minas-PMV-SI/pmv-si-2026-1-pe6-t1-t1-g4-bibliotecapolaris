# Front-end Móvel

[Inclua uma breve descrição do projeto e seus objetivos.]

## Projeto da Interface
[Descreva o projeto da interface móvel da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]

### Wireframes

[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]

### Design Visual

[Descreva o estilo visual da interface, incluindo paleta de cores, tipografia, ícones e outros elementos gráficos.]

## Fluxo de Dados

[Diagrama ou descrição do fluxo de dados na aplicação.]

## Tecnologias Utilizadas

[Lista das tecnologias principais que serão utilizadas no projeto.]

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
