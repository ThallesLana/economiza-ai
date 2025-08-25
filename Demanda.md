### 🔧 Tech Stack Recomendado

#### ✅ **Framework:**
- **NestJS**

#### ✅ **Banco de Dados:**
- **PostgreSQL**
 
#### ✅ **ORM:**
- **TypeORM**

---

### 🧱 Estrutura de Domínio Sugerida

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

---

### 🛠️ Funcionalidades Iniciais

#### Usuários
- Registro e login com JWT
- Recuperação de senha
- Atualização de perfil

#### Transações
- Criar/editar/excluir
- Tipos: Receita / Despesa
- Filtros por data, categoria, valor

#### Metas
- Criar metas mensais ou anuais
- Ver progresso

#### Relatórios
- Saldo por período
- Porcentagem por categoria
- Exportação CSV/PDF
