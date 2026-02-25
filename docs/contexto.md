# Introdução

A Biblioteca da Universidade Polaris constitui um dos principais pilares de apoio às atividades acadêmicas e científicas da instituição, disponibilizando acesso a livros físicos, materiais digitais, periódicos e serviços de empréstimo e consulta ao acervo. Com o avanço das tecnologias da informação e o crescimento da comunidade acadêmica, torna-se imprescindível a modernização dos processos de gestão da biblioteca, de modo a garantir maior eficiência operacional, integração sistêmica e acessibilidade aos usuários.

Nesse contexto, este projeto propõe o desenvolvimento de um sistema distribuído para a Biblioteca Polaris, fundamentado nos princípios da Arquitetura de Sistemas Distribuídos. A solução contemplará a documentação de contexto, o planejamento e desenvolvimento de APIs e Web Services, a implementação de uma aplicação Web para gestão administrativa e uma aplicação Mobile voltada ao usuário final.

## Problema

A Biblioteca Polaris enfrenta desafios relacionados à eficiência e à integração de seus processos internos. Observa-se baixa eficiência no gerenciamento do acervo, dificuldades no controle de empréstimos e devoluções, ausência de notificações automatizadas para prazos e reservas, bem como limitações no acesso remoto aos serviços oferecidos.

Adicionalmente, a inexistência de uma arquitetura distribuída compromete a escalabilidade do sistema e dificulta sua manutenção e evolução tecnológica. A falta de integração entre os diferentes setores e sistemas institucionais também impacta negativamente a experiência dos usuários e a gestão administrativa.

Dessa forma, identifica-se a necessidade de uma solução tecnológica integrada, escalável e orientada a serviços, capaz de suprir as demandas atuais e futuras da biblioteca universitária.

## Objetivos

### Objetivo Geral

Desenvolver um sistema distribuído para a Biblioteca da Universidade Polaris, com o propósito de modernizar a gestão do acervo, integrar serviços por meio de APIs e Web Services e oferecer aplicações Web e Mobile que atendam às necessidades dos diferentes perfis de usuários.

### Objetivos Específicos

Elaborar a documentação de contexto da solução, identificando atores, stakeholders e limites do sistema;

Planejar e implementar APIs para integração entre os módulos da aplicação;

Desenvolver uma aplicação Web destinada à gestão administrativa do acervo e dos usuários;

Desenvolver uma aplicação Mobile para consulta, reserva e renovação de materiais;

Definir e aplicar requisitos funcionais e não funcionais relacionados à segurança, desempenho e escalabilidade.

## Justificativa

A crescente digitalização dos serviços acadêmicos e o aumento da demanda por acesso remoto à informação tornam indispensável a modernização dos sistemas de bibliotecas universitárias. A Biblioteca da Universidade Polaris, como unidade de apoio ao ensino, pesquisa e extensão, necessita de uma solução tecnológica que acompanhe a evolução das necessidades de seus usuários e da própria instituição.

O desenvolvimento de uma Biblioteca Digital Distribuída justifica-se pela necessidade de melhorar a eficiência operacional no gerenciamento do acervo, otimizar o controle de empréstimos e devoluções e ampliar o acesso aos serviços oferecidos, independentemente de localização ou horário. A adoção de uma arquitetura distribuída possibilita maior escalabilidade, disponibilidade e integração entre os diferentes módulos do sistema, além de facilitar sua manutenção e evolução futura.

## Público-Alvo

Público-alvo

O sistema proposto é destinado a diferentes perfis de usuários da Universidade Polaris, tanto a comunidade acadêmica quanto a equipe administrativa da biblioteca. O público-alvo é composto por:
Estudantes de graduação e pós-graduação, que utilizarão a aplicação Mobile e Web para consulta ao acervo, realização de reservas, empréstimos, renovações e acompanhamento de prazos;
Professores e pesquisadores, que necessitam de acesso rápido e organizado aos materiais bibliográficos para apoio às atividades de ensino e pesquisa;
Bibliotecários e equipe administrativa, responsáveis pelo cadastro, gerenciamento e controle do acervo, dos usuários e dos processos de empréstimo e devolução por meio da aplicação Web administrativa;
Gestores da instituição, que poderão se beneficiar de informações para apoio à tomada de decisão e planejamento estratégico dos serviços da biblioteca.

<img width="1536" height="1024" alt="diagramas de personas e mapa de stakeholders" src="https://github.com/user-attachments/assets/2a1a6ecf-e4da-43cb-aaff-bd8bbaf36c55" />


# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir que o usuário cadastre tarefas | ALTA | 
|RF-002| Emitir um relatório de tarefas no mês   | MÉDIA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.
