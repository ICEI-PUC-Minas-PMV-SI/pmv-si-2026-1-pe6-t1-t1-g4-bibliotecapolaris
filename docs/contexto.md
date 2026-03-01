# Introdução

A Biblioteca da Universidade Polaris constitui um dos principais pilares de apoio às atividades acadêmicas e científicas da instituição, disponibilizando acesso a livros físicos, materiais digitais, periódicos e serviços de empréstimo e consulta ao acervo. Com o avanço das tecnologias da informação e o crescimento da comunidade acadêmica, torna-se imprescindível a modernização dos processos de gestão da biblioteca, de modo a garantir maior eficiência operacional, integração sistêmica e acessibilidade aos usuários.

## Problema

A Biblioteca Polaris enfrenta como desafio central a ineficiência na gestão integrada de seus processos operacionais e informacionais. O crescimento da comunidade acadêmica e a ampliação do acervo físico e digital intensificaram a complexidade das atividades relacionadas a empréstimos, devoluções, reservas e controle de disponibilidade de materiais.

Atualmente, observam-se falhas no acompanhamento de prazos, ausência de mecanismos automatizados de comunicação com os usuários e dificuldades na consolidação de informações administrativas. Essas limitações impactam diretamente a experiência da comunidade acadêmica, que enfrenta obstáculos no acesso ágil à informação, e afetam a equipe responsável pela gestão do acervo, que lida com retrabalho e inconsistências operacionais.

A relevância do problema torna-se ainda mais evidente diante da crescente demanda por acesso remoto, serviços digitais e maior autonomia por parte dos usuários. Sem a modernização de seus processos e estruturas informacionais, a biblioteca tende a enfrentar aumento de inconsistências operacionais, sobrecarga administrativa e insatisfação da comunidade acadêmica.

Dessa forma, o problema identificado não se limita a falhas pontuais de processo, mas refere-se a uma limitação estrutural na gestão integrada da biblioteca universitária, com impactos operacionais, estratégicos e institucionais.

## Objetivos

### Objetivo Geral

Desenvolver um sistema integrado de gestão para a Biblioteca da Universidade Polaris, com o objetivo de modernizar seus processos operacionais, facilitar o acesso da comunidade acadêmica aos materiais disponíveis e fornecer suporte estratégico à administração por meio de informações consolidadas e em tempo real.

### Objetivos Específicos

Analisar os fluxos atuais de empréstimo e devolução da biblioteca.

Projetar uma arquitetura integrada que permita centralização e escalabilidade da gestão do acervo.

Automatizar os processos de solicitação, aprovação e registro de empréstimos.

Reduzir o tempo médio de atendimento nas operações de retirada e devolução de livros.

Disponibilizar consulta online ao catálogo, ampliando o acesso remoto aos serviços da biblioteca.

Melhorar a experiência do usuário por meio de notificações automatizadas e acompanhamento em tempo real do status dos empréstimos.

## Justificativa

A crescente digitalização dos serviços acadêmicos e o aumento da demanda por acesso remoto à informação tornam indispensável a modernização dos sistemas de bibliotecas universitárias. A Biblioteca da Universidade Polaris, como unidade de apoio ao ensino, pesquisa e extensão, necessita de uma solução tecnológica que acompanhe a evolução das necessidades de seus usuários e da própria instituição.

O desenvolvimento de uma Biblioteca Digital Distribuída justifica-se pela necessidade de melhorar a eficiência operacional no gerenciamento do acervo, otimizar o controle de empréstimos e devoluções e ampliar o acesso aos serviços oferecidos, independentemente de localização ou horário. A adoção de uma arquitetura distribuída possibilita maior escalabilidade, disponibilidade e integração entre os diferentes módulos do sistema, além de facilitar sua manutenção e evolução futura.

## Público-Alvo

O sistema proposto é destinado a diferentes perfis de usuários da Universidade Polaris, tanto a comunidade acadêmica quanto a equipe administrativa da biblioteca.


**O público-alvo é composto por:**


**Estudantes de graduação e pós-graduação**, que utilizarão a aplicação Mobile e Web para consulta ao acervo, realização de reservas, empréstimos, renovações e acompanhamento de prazos;


**Professores e pesquisadores**, que necessitam de acesso rápido e organizado aos materiais bibliográficos para apoio às atividades de ensino e pesquisa;


**Bibliotecários e equipe administrativa**, responsáveis pelo cadastro, gerenciamento e controle do acervo, dos usuários e dos processos de empréstimo e devolução por meio da aplicação Web administrativa;


**Gestores da instituição**, que poderão se beneficiar de informações para apoio à tomada de decisão e planejamento estratégico dos serviços da biblioteca.

<img width="1536" height="1024" alt="diagramas de personas e mapa de stakeholders" src="https://github.com/user-attachments/assets/9c75057c-e8cd-4b1c-908f-3ca470064a7e" />



# Especificações do Projeto
## Requisitos
A técnica de priorização de requisitos adotada foi o método MoSCoW, um modelo qualitativo que organiza os requisitos de acordo com sua essencialidade para o sistema. Essa abordagem permite estruturar os requisitos de forma clara, evidenciando quais funcionalidades são críticas para o funcionamento do sistema, quais são importantes, quais são desejáveis e quais não serão implementadas neste ciclo.

O princípio da técnica consiste em analisar cada requisito quanto à sua importância para o sistema e impacto no funcionamento geral. Com base nessa análise, cada requisito é classificado em uma das quatro categorias do MoSCoW:
* **M – Must have (Essencial)**: requisitos críticos, sem os quais o sistema não pode funcionar.
* **S – Should have (Importante)**: requisitos relevantes, mas cuja ausência não inviabiliza a operação imediata do sistema.
* **C – Could have (Desejável)**: requisitos que agregam valor, mas que podem ser implementados em fases futuras.
* **W – Won’t have (Não terá neste ciclo)**: requisitos que não serão implementados no escopo atual, podendo ser considerados em futuras versões.

### Requisitos Funcionais
| ID    | Descrição do Requisito                                                                 | Prioridade |
|-------|----------------------------------------------------------------------------------------|-----------|
| RF01  | O sistema deve permitir o cadastro de livros                                           | M |
| RF02  | O sistema deve disponibilizar listas com requisições de empréstimo para aprovação ou reprovação | M |
| RF03  | O sistema deve disponibilizar lista de empréstimos realizados, com seus respectivos status | M |
| RF04  | O sistema deve permitir o cadastro de usuários, incluindo nome e e-mail, com envio de notificação ao administrador do sistema | M |
| RF05  | O sistema deve disponibilizar lista de livros para download e retirada, com opções de filtro por nome, categoria ou autor | M |
| RF06  | O sistema deve bloquear o empréstimo de novos livros caso o aluno esteja com pendência | M |
| RF07  | O sistema deve disponibilizar a criação de empréstimo manual              | S |
| RF08  | O sistema deve permitir o agendamento de retirada do livro na biblioteca               | S |
| RF09  | O sistema deve permitir o download de conteúdos eletrônicos                             | S |
| RF10  | O sistema deve disponibilizar visualização do status do empréstimo, com possibilidade de justificar atraso, antecipar entrega ou solicitar adiamento | S |
| RF11  | O sistema deve permitir visualização de livros emprestados, conteúdos baixados e livros desejados | C |
| RF12  | O sistema deve oferecer recomendações baseadas nos livros emprestados ou baixados pelo usuário | C |

### Requisitos não Funcionais
|ID     | Descrição do Requisito  | Prioridade |
|-------|-------------------------|----|
| RNF01  | O sistema deve responder às requisições em até 3 segundos                               | M |
| RNF02  | O sistema deve suportar no mínimo 6.000 usuários simultâneos                            | M |
| RNF03  | O sistema deve exigir autenticação por login e senha                                    | M |
| RNF04  | O sistema deve armazenar senhas de forma criptografada                                  | M |
| RNF05  | O sistema deve restringir funcionalidades administrativas por perfil                   | M |
| RNF06  | O sistema deve registrar logs de ações críticas                                         | S |
| RNF07  | O sistema deve possuir interface intuitiva, compatível com navegadores modernos e otimizado para cada tela | S |
| RNF08  | O sistema deve apresentar mensagens de erro claras e objetivas                           | C |



## Restrições
O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O escopo da solução está limitado às funcionalidades descritas neste documento |
|02| A implementação deverá priorizar os requisitos classificados como “Must Have”, conforme o método MoSCoW|
|03| A solução deverá seguir o modelo de arquitetura distribuída definido no projeto|
|04| O projeto deverá ser concluído até o final do semestre|
|05| A validação prática da solução ocorrerá em ambiente acadêmico e de demonstração|

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços
O catálogo de serviços apresenta os serviços disponibilizados pelo sistema de biblioteca universitária, descrevendo suas finalidades, funcionalidades e o público ao qual se destinam. Cada serviço representa uma entrega concreta do sistema aos seus usuários, estruturando as operações relacionadas à gestão de livros, empréstimos e conteúdos digitais.

Os serviços estão organizados conforme o perfil de acesso (Aluno e Administrador), refletindo as permissões e responsabilidades de cada tipo de usuário.

## Serviços destinados ao Aluno
1. Serviço de Cadastro e Login de Usuário
* Permite que os usuários criem uma conta com nome, email;
* Validação de informações obrigatórias para login;
* Envio automático de notificação ao administrador, em caso de cadastro.

2. Serviço de Consulta ao Catálogo
* Listagem de livros físicos e digitais
* Filtros por nome, autor ou categoria
* Visualização de disponibilidade

3. Serviço de Solicitação e Agendamento de Empréstimo
* Envio de solicitação de empréstimo
* Escolha de data para retirada
* Acompanhamento do status da solicitação

4. Serviço de Download de Conteúdo Digital
* Acesso a conteúdos digitais
* Download direto pelo sistema
* Registro do histórico de downloads

5. Serviço de Acompanhamento de Empréstimos
* Visualização de status
* Solicitação de adiamento
* Justificativa de atraso
* Consulta de pendências

6. Serviço de Recomendações
* Análise de empréstimos anteriores
* Sugestão automatizada de novos títulos

## Serviços destinados ao Administrador
7. Serviço de Gestão de Acervo
* Cadastro de novos livros
* Atualização de informações
* Controle de disponibilidade

8. Serviço de Gestão de Empréstimos
* Aprovação ou reprovação de solicitações
* Criação manual de empréstimos
* Visualização de todos os empréstimos
* Controle de status

9. Serviço de Controle de Pendências
* Identificação de atrasos
* Aplicação de restrições automáticas
* Registro de irregularidades

# Arquitetura e Tecnologia

A arquitetura do sistema fundamenta-se em uma estrutura de **Camadas Desacopladas**. O ecossistema é dividido entre uma base de dados centralizada, um núcleo de serviços (*Backend*) e interfaces multiplataforma (*Frontend* e *Mobile*).

A persistência das informações é gerenciada por um banco de dados unificado **MariaDB**, utilizando o modelo relacional para garantir a consistência e a atomicidade das operações.

### Tabelas:

*   Aluno (matrícula, nome, nada consta)
*   Livros (Autor, título, editora, ano, estoque, empréstimos(MAX=estoque)
*   Empréstimos (prazo, multa, livro)
*   Multas (valor, pagamento)
*   Pagamentos (multa, pago ou não)

Nenhuma interface de usuário possui permissão de conexão direta com o SGDB; toda e qualquer interação é realizada exclusivamente através de uma **API RESTful** desenvolvida em **TypeScript + Node.js** com o framework **Express**. Esta API é hospedada em uma instância dedicada,

O sistema provê suporte multiplataforma para os usuários finais, consumindo a API centralizada:

*   **Aplicação Web:** Desenvolvida em **React** utilizando **Tailwind CSS** para uma interface responsiva e performática.
*   **Aplicação Mobile:** Desenvolvida em **React Native**.

# Hospedagem e Deploy Contínuo (CI/CD)

O workflow de software segue práticas de *DevOps*:

*   **Database:** Nossa base de dados estará hospedada em uma instância do Amazon RDS(?), acessível pelo backend por meio de subrede e de protocolo CORS(?)
*   **Monorepo de Interfaces:** As aplicações *Web* e *Mobile* residem no mesmo repositório, facilitando a padronização visual, manutenção e reusabilidade de código. O processo de *build* e distribuição é automatizado via **GitHub Actions**.
*   **Serviços Backend:** O servidor de API possui seu próprio pipeline de entrega, também automatizada pelo **GitHub Action.**
