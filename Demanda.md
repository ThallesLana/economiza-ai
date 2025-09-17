### 🔧 Tech Stack

#### ✅ **Framework:**
- **NestJS**

#### ✅ **Banco de Dados:**
- **PostgreSQL**
 
#### ✅ **ORM:**
- **TypeORM**

#### ✅ **Autenticação:**
- **JWT**

#### ✅ **Documentação:**
- **Swagger**

---

### 🧱 Estrutura de Domínio

Modularização:

```bash
src/
├── auth/              # Login, JWT, guardas ✅
├── common/            # Filtros, pipes, interceptors ✅
├── transactions/      # Receitas, despesas ✅
├── categories/        # Alimentação, Transporte, etc. ✅
├── users/             # Perfil do usuário ✅
```

### 🧱 Estrutura de Domínio Futura

Modularização:

```bash
src/
├── auth/              # Login, JWT, guardas ✅
├── common/            # Filtros, pipes, interceptors ✅
├── transactions/      # Receitas, despesas ✅
├── categories/        # Alimentação, Transporte, etc. ✅
├── goals/             # Metas financeiras 🔜
├── reports/           # Resumo mensal, exportações 🔜
├── users/             # Perfil do usuário ✅
```