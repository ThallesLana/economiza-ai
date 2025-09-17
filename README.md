<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 💸 Economiza Aí - API de Finanças Pessoais

**Economiza Aí** é uma API REST desenvolvida com **NestJS** e **TypeORM**, que tem como objetivo ajudar usuários a controlarem suas finanças pessoais de forma simples, eficiente e segura.

A aplicação permite que usuários cadastrem, organizem e acompanhem suas transações financeiras (entradas e saídas), mantendo uma visão clara de seus hábitos de consumo e evolução financeira.

---

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/) - Framework para aplicações Node.js escaláveis
- [TypeORM](https://typeorm.io/) - ORM para banco de dados relacional
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional robusto
- [Docker](https://www.docker.com/) (opcional) - Para rodar o banco de dados localmente
- [JWT](https://jwt.io/) - Autenticação segura por token

---
## 📚 Documentação da API
  - Acessar a documentação da API no endereço: http://localhost:3000/api
---

## 📦 Funcionalidades (MVP)

- ✅ Cadastro de usuários
- ✅ Autenticação com JWT
- ✅ CRUD de transações financeiras (entradas e saídas)
- ✅ CRUD de categorias
- ✅ Associação de transações por usuário
- ✅ Filtros por data, categoria e tipo (income/expense)
- ✅ Documentação da API (Swagger)
- ✅ Resumo financeiro (total de entradas, saídas e saldo)

---

## 📦 Funcionalidades Futuras

#### Metas
- Criar metas mensais ou anuais
- Ver progresso

#### Relatórios
- Saldo por período
- Porcentagem por categoria
- Exportação CSV/PDF

---

## 📝 Como Rodar Localmente

Siga o passo a passo abaixo para subir o projeto em ambiente local:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ThallesLana/economiza-ai.git
   cd economiza-ai
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Duplique o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente.

4. **Configure o banco de dados (PostgreSQL via Docker):**
   ```bash
   docker-compose up -d
   ```
   Isso irá subir um container PostgreSQL acessível em `localhost:5432` com usuário e senha iguais ao definido no arquivo `.env`.

5. **Inicie a aplicação em modo desenvolvimento:**
   ```bash
   npm run start:dev
   ```

6. **Acesse a documentação da API:**
   - Acesse: [http://localhost:3000/api](http://localhost:3000/api)

---
## ⏳ Status do Projeto:
- ✅ MVP concluído

---