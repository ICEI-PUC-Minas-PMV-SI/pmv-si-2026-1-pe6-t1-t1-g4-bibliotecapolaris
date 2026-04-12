# Metodologia: 

Foram testados os endpoints pela API hospedada, que foi temporariamente aberta para a Web pelo url http://3.23.221.240:3333/api. As requisições foram feitas pelo postman.

# Testes

## Setup

Para podermos testar integralmente a API, primeiro precisamos ter criados usuários, autores e livros, respectivamente. Portanto:

### Teste da API de Users

#### Post

<img width="866" height="1023" alt="image" src="https://github.com/user-attachments/assets/2e0292e4-2ac8-47d2-baf0-8952d0f2ed72" />

#### Get/:id

Vamos conferir se nosso usuário de UUID `0e17f273-0876-4cab-9f6b-b8a143e4e99c` foi registrado corretamente:

<img width="858" height="1206" alt="image" src="https://github.com/user-attachments/assets/a01fef67-8005-403a-9253-5c8f10a29752" />

OK!

#### Put

Vamos tentar alterar alguma informação dele:

<img width="1289" height="900" alt="image" src="https://github.com/user-attachments/assets/0d896b35-493f-4f2d-8442-328915eba318" />

OK!

### Author

Faremos o mesmo agora para o author...

#### POST

Criaremos o autor Machado de Assis:

<img width="1289" height="900" alt="image" src="https://github.com/user-attachments/assets/3da4bf3b-23ae-4d12-b165-53fbed6c95a5" />

Machado de Assis foi criado com sucesso no UUID `397153d3-a3c9-4f2a-8aff-551d3e49524c`

#### GET

Podemos vê-lo registrado aqui:

<img width="1288" height="1063" alt="image" src="https://github.com/user-attachments/assets/d2317ebe-3401-4dea-9fa2-8c55b0bb85aa" />


#### GET/id

Ou podemos puxar apenas ele:

<img width="1288" height="851" alt="image" src="https://github.com/user-attachments/assets/272d49ed-dfa8-48d7-acc9-9386c5599c24" />

OK!

#### PUT

Nesse caso, podemos colocar seu nome completo:

<img width="849" height="931" alt="image" src="https://github.com/user-attachments/assets/2c63b74c-d435-4cb7-a72c-50406eacd548" />

Pronto!

#### Delete

Vamos aproveitar e já deletar um autor da fase de testes, o "string", UUID `ee2a7a92-8183-4065-821f-1d0df390cb1f`

<img width="849" height="963" alt="image" src="https://github.com/user-attachments/assets/81c83a18-400f-4670-acf8-480c2a701267" />

Vamos ver se funcionou:

<img width="849" height="1117" alt="image" src="https://github.com/user-attachments/assets/51a1352a-0b47-4788-bd64-a20dbcc739d0" />

OK!

### Books

#### POST

Vamos registrar um livro do Machado de Assis:

<img width="849" height="1117" alt="image" src="https://github.com/user-attachments/assets/8b79b784-b136-439c-a7ad-39b14972c913" />

### GET

<img width="849" height="1117" alt="image" src="https://github.com/user-attachments/assets/53d7e1f7-c5e7-4f3a-bac8-3c72af0e9cbb" />

Ele está registrado, junto de outros livros:

```
{
    "error": false,
    "data": [
        {
            "id": "b40bb1ca-eeab-4aea-86e2-8505be97613f",
            "slug": "clean-code",
            "isbn": "978-0132350884",
            "name": "Clean Code",
            "year": 2008,
            "authorId": "dc47a282-64ea-42d2-9eaa-d44b614fda38",
            "description": "Clean code is a programming philosophy focusing on writing software that is easy to read, understand, and maintain, prioritizing human readability alongside functionality.",
            "categories": "string",
            "totalQuantity": 5,
            "totalAvailable": 4,
            "author": {
                "id": "dc47a282-64ea-42d2-9eaa-d44b614fda38",
                "name": "autor teste"
            }
        },
        {
            "id": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
            "slug": "dom-casmurro",
            "isbn": "978-85-7326-188-0",
            "name": "Dom Casmurro",
            "year": 1899,
            "authorId": "dc47a282-64ea-42d2-9eaa-d44b614fda38",
            "description": "Romance classico de Machado de Assis sobre ciume e duvida",
            "categories": "romance,literatura brasileira",
            "totalQuantity": 5,
            "totalAvailable": 5,
            "author": {
                "id": "dc47a282-64ea-42d2-9eaa-d44b614fda38",
                "name": "autor teste"
            }
        },
        {
            "id": "cc401702-fd59-44ab-89db-d3fbd91ee0a1",
            "slug": "memorias-postumas-de-bras-cubas",
            "isbn": "978-65-5692-666-7",
            "name": "Memórias Póstumas de Brás Cubas",
            "year": 1881,
            "authorId": "397153d3-a3c9-4f2a-8aff-551d3e49524c",
            "description": "Romance classico de Machado de Assis sobre um autor defunto (ou seria um defunto autor?) que conta em retrospecto sua vida e obra com um humor ácido",
            "categories": "romance,literatura brasileira",
            "totalQuantity": 5,
            "totalAvailable": 5,
            "author": {
                "id": "397153d3-a3c9-4f2a-8aff-551d3e49524c",
                "name": "Joaquim Maria Machado de Assis"
            }
        }
    ]
}
```

Também conseguimos filtrá-lo por nome com o _query param_ `?name`:

<img width="859" height="869" alt="image" src="https://github.com/user-attachments/assets/30dffa48-51fd-440f-a85f-23b0ec3bf750" />

Aqui vemos que o id do livro é `cc401702-fd59-44ab-89db-d3fbd91ee0a1`


Podemos inclusive pesquisá-lo por id:

### GET/id

<img width="859" height="748" alt="image" src="https://github.com/user-attachments/assets/800e6094-959f-4e56-b0fd-f44862217f6c" />


### PUT

Na lista, tínhamos Dom Casmurro de id `c0050bc2-b042-4cd2-ad95-eb7a246cdb30` e ele estava no autor teste, mas podemos colocá-lo no Machado:

<img width="859" height="873" alt="image" src="https://github.com/user-attachments/assets/779c96b9-a944-477d-ad3c-65f11339c03d" />

#### DELETE

Temos o livro Clean Code no id `b40bb1ca-eeab-4aea-86e2-8505be97613f`, mas um aluno muito cansado jogou nosso último exemplar pela janela pois não aguentava mais o código dando erro... Vamos ter que apagar!

<img width="1293" height="1104" alt="image" src="https://github.com/user-attachments/assets/72b10431-bdf2-4dc6-b2b5-38f73779bcd5" />

Pronto!

### Loans

#### POST

O teste da Silva decidiu pegar Dom Casmurro emprestado:

<img width="1293" height="1104" alt="image" src="https://github.com/user-attachments/assets/c347c04b-afaa-496d-9896-b7ef5fa9aa91" />

id `410be348-35ad-46e4-bee5-f8874961d55e`

#### GET/id

<img width="1293" height="747" alt="image" src="https://github.com/user-attachments/assets/e2d2f7ba-3ca0-42b0-8a72-2ad632cdd9a6" />


#### GET

TODOS

<img width="1293" height="1126" alt="image" src="https://github.com/user-attachments/assets/549eac47-6663-49a9-936f-8202ed9b8472" />

```
{
    "error": false,
    "data": [
        {
            "id": "410be348-35ad-46e4-bee5-f8874961d55e",
            "studentId": "0e17f273-0876-4cab-9f6b-b8a143e4e99c",
            "bookId": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
            "loanDate": "2026-04-12",
            "dueDate": "2026-04-25",
            "returnDate": null,
            "status": "in_progress",
            "student": {
                "id": "0e17f273-0876-4cab-9f6b-b8a143e4e99c",
                "slug": "teste-api-da-silva",
                "name": "Teste Api da Silva",
                "email": "user.teste@unipolaris.br",
                "password": "$2b$10$Zpa7DAaxhUcPjdliEpcdNOUMQtFgDJE3rbAsNDL9ba4Q/qHiAPqUG",
                "isBlocked": false,
                "type": "student"
            }
        },
        {
            "id": "4ce82142-785a-48f9-9531-d3d127831aea",
            "studentId": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
            "bookId": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
            "loanDate": "2026-04-10",
            "dueDate": "2026-04-20",
            "returnDate": null,
            "status": "returned",
            "student": {
                "id": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
                "slug": "joao-teste",
                "name": "Joao Teste",
                "email": "joao.teste@unipolaris.br",
                "password": "$2b$10$jxBVA.izNUKeJ4he6ZcBGOcb4BarnyzLTwXnCoZRH9bKqelbFzAOW",
                "isBlocked": false,
                "type": "student"
            }
        },
        {
            "id": "5caf33aa-cdb7-47d3-9367-0eedab3a28a7",
            "studentId": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
            "bookId": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
            "loanDate": "2026-04-10",
            "dueDate": "2026-04-20",
            "returnDate": null,
            "status": "returned",
            "student": {
                "id": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
                "slug": "joao-teste",
                "name": "Joao Teste",
                "email": "joao.teste@unipolaris.br",
                "password": "$2b$10$jxBVA.izNUKeJ4he6ZcBGOcb4BarnyzLTwXnCoZRH9bKqelbFzAOW",
                "isBlocked": false,
                "type": "student"
            }
        },
        {
            "id": "a1bb5642-1873-4013-8962-4dd73f3973e2",
            "studentId": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
            "bookId": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
            "loanDate": "2026-04-11",
            "dueDate": "2026-04-25",
            "returnDate": "2026-04-12",
            "status": "returned",
            "student": {
                "id": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
                "slug": "joao-teste",
                "name": "Joao Teste",
                "email": "joao.teste@unipolaris.br",
                "password": "$2b$10$jxBVA.izNUKeJ4he6ZcBGOcb4BarnyzLTwXnCoZRH9bKqelbFzAOW",
                "isBlocked": false,
                "type": "student"
            }
        }
    ]
}
```

##### PUT

<img width="1223" height="787" alt="image" src="https://github.com/user-attachments/assets/11839855-8483-4139-948f-9f8363e2c7bb" />


#### DEL

id: `5caf33aa-cdb7-47d3-9367-0eedab3a28a7`, reminescente dos testes

<img width="1223" height="787" alt="image" src="https://github.com/user-attachments/assets/49c27656-74bf-4b2c-b13c-dbe5b48d5fe5" />


### REVIEW

#### POST

Teste da Silva não entendeu bem a premissa do livro e quer manifestar isso:

<img width="1293" height="1126" alt="image" src="https://github.com/user-attachments/assets/7f671216-59c1-4153-8950-cbbc16875e20" />

#### GET

<img width="1293" height="1126" alt="image" src="https://github.com/user-attachments/assets/88fb3322-f663-4165-acc6-e1de02f646fc" />

Retorno completo:

```
{
    "error": false,
    "data": [
        {
            "id": "2b3e1482-a903-4a76-b3af-21317f231fa9",
            "rating": 5,
            "loanId": "a1bb5642-1873-4013-8962-4dd73f3973e2",
            "description": "Excelente livro, recomendo!",
            "date": "2026-04-12",
            "loan": {
                "id": "a1bb5642-1873-4013-8962-4dd73f3973e2",
                "studentId": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
                "bookId": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
                "loanDate": "2026-04-11",
                "dueDate": "2026-04-25",
                "returnDate": "2026-04-12",
                "status": "returned",
                "student": {
                    "id": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
                    "slug": "joao-teste",
                    "name": "Joao Teste",
                    "email": "joao.teste@unipolaris.br",
                    "password": "$2b$10$jxBVA.izNUKeJ4he6ZcBGOcb4BarnyzLTwXnCoZRH9bKqelbFzAOW",
                    "isBlocked": false,
                    "type": "student"
                },
                "book": {
                    "id": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
                    "slug": "dom-casmurro",
                    "isbn": "978-85-7326-188-0",
                    "name": "Dom Casmurro",
                    "year": 1899,
                    "authorId": "dc47a282-64ea-42d2-9eaa-d44b614fda38",
                    "description": "Romance classico de Machado de Assis sobre ciume e duvida",
                    "categories": "romance,literatura brasileira",
                    "totalQuantity": 5,
                    "totalAvailable": 5
                }
            }
        },
        {
            "id": "6bf3545b-2ce2-48ca-9e67-5119cb45c7fd",
            "rating": 2,
            "loanId": "410be348-35ad-46e4-bee5-f8874961d55e",
            "description": "CAPITU TRAIU BENTINHO?! OU NÃO?! NÃO ENTENDI ESCRITA FRACA",
            "date": "2026-04-12",
            "loan": {
                "id": "410be348-35ad-46e4-bee5-f8874961d55e",
                "studentId": "0e17f273-0876-4cab-9f6b-b8a143e4e99c",
                "bookId": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
                "loanDate": "2026-04-12",
                "dueDate": "2026-04-25",
                "returnDate": null,
                "status": "in_progress",
                "student": {
                    "id": "0e17f273-0876-4cab-9f6b-b8a143e4e99c",
                    "slug": "teste-api-da-silva",
                    "name": "Teste Api da Silva",
                    "email": "user.teste@unipolaris.br",
                    "password": "$2b$10$Zpa7DAaxhUcPjdliEpcdNOUMQtFgDJE3rbAsNDL9ba4Q/qHiAPqUG",
                    "isBlocked": false,
                    "type": "student"
                },
                "book": {
                    "id": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
                    "slug": "dom-casmurro",
                    "isbn": "978-85-7326-188-0",
                    "name": "Dom Casmurro",
                    "year": 1899,
                    "authorId": "dc47a282-64ea-42d2-9eaa-d44b614fda38",
                    "description": "Romance classico de Machado de Assis sobre ciume e duvida",
                    "categories": "romance,literatura brasileira",
                    "totalQuantity": 5,
                    "totalAvailable": 5
                }
            }
        }
    ]
}
```

O id do nosso Review é `6bf3545b-2ce2-48ca-9e67-5119cb45c7fd`

#### PUT

Teste da Silva procurou explicações no Reddit e, depois de entender menos ainda, diminui sua nota pra 1.

<img width="1235" height="1127" alt="image" src="https://github.com/user-attachments/assets/2eaecb56-71ca-4e0f-b898-92a3576e5db3" />


#### GET/:id

<img width="1235" height="1127" alt="image" src="https://github.com/user-attachments/assets/8d827299-e420-40e8-8aba-8685eb73208d" />


#### GET/user/:id

Podemos ver a avaliação dele pelo seu id de usuário:
<img width="1260" height="984" alt="image" src="https://github.com/user-attachments/assets/bcc6c5a0-0382-4b15-b70a-64ba29a77496" />


#### GET/book/:book_id

Podemos ver também todas as reviews do livro:

<img width="1260" height="984" alt="image" src="https://github.com/user-attachments/assets/82b582e5-817f-424c-aa9c-4f759beb047b" />


```
{
    "error": false,
    "data": [
        {
            "id": "6bf3545b-2ce2-48ca-9e67-5119cb45c7fd",
            "rating": 1,
            "description": "Livro overrated",
            "date": "2026-04-12",
            "loan": {
                "id": "410be348-35ad-46e4-bee5-f8874961d55e",
                "student": {
                    "id": "0e17f273-0876-4cab-9f6b-b8a143e4e99c",
                    "name": "Teste Api da Silva"
                },
                "book": {
                    "id": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
                    "name": "Dom Casmurro"
                }
            }
        },
        {
            "id": "2b3e1482-a903-4a76-b3af-21317f231fa9",
            "rating": 5,
            "description": "Excelente livro, recomendo!",
            "date": "2026-04-12",
            "loan": {
                "id": "a1bb5642-1873-4013-8962-4dd73f3973e2",
                "student": {
                    "id": "eb3b0f14-2851-48c8-aaab-39df406c73cd",
                    "name": "Joao Teste"
                },
                "book": {
                    "id": "c0050bc2-b042-4cd2-ad95-eb7a246cdb30",
                    "name": "Dom Casmurro"
                }
            }
        }
    ]
}
```

#### DELETE

Depois de uma conversa calma de uma professora do departamento de letras com Testinho, ele foi convencido a por favor apagar sua review deveras acalorada e dar uma segunda chance pro livro no futuro:

<img width="1260" height="1134" alt="image" src="https://github.com/user-attachments/assets/c0c7da16-2e46-4ccd-8522-5e862089341d" />

### WISHLIST

#### POST

Testinho perdeu a chance de pegar o empréstimo do livro de novo, então vai adicioná-lo à sua lista:

<img width="1260" height="1134" alt="image" src="https://github.com/user-attachments/assets/73b54be7-ea11-4dca-9694-a4ded8afc828" />



#### GET/:user_id

Como podemos ver abaixo, também:

<img width="1260" height="1134" alt="image" src="https://github.com/user-attachments/assets/771d2b8e-43ba-441d-adcc-3f6ba427e6cb" />

#### DELETE/:user_id/:book_id

No fim, ele optou por pegar o ebook numa promoção e removeu-o da lista de desejos:

<img width="1260" height="1134" alt="image" src="https://github.com/user-attachments/assets/30957ce3-be2a-4af0-bb29-dd3209369189" />

