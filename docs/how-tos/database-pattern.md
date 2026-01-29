# Database Patterns

This document describes the database conventions used in this project.

## Overview

- **PostgreSQL** is the primary database
- All database operations are encapsulated in model files in `models/`
- Schema changes are managed through migration scripts in `migration/`

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Routes    │ ──▶  │   Models    │ ──▶  │  PostgreSQL │
│  (handlers) │      │ (data layer)│      │  (database) │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Database Connection

- Connection pool is configured in `libs/db.js`
- Uses the `pg` library
- Connection settings are read from environment variables

## Model Guidelines

Each model file should:

1. Import the database pool from `libs/db.js`
2. Export async functions for each database operation
3. Use parameterized queries (`$1`, `$2`, etc.) to prevent SQL injection
4. Include JSDoc comments documenting parameters and return types
5. Return `null` or empty arrays when no data is found

### Typical Operations

- `getAll()` - Retrieve all records
- `getById(id)` - Retrieve single record
- `getBy<Field>(value)` - Retrieve by specific field
- `create(data)` - Insert new record
- `update(id, data)` - Update existing record
- `remove(id)` - Delete record

## Query Rules

| Do | Don't |
|---|---|
| Use parameterized queries | Use string interpolation in queries |
| Use `RETURNING *` for insert/update | Make separate SELECT after insert |
| Handle null/empty results | Assume data always exists |
| Keep queries in models | Write SQL in route handlers |

## Transactions

Use transactions when multiple operations must succeed or fail together:

1. Get a client from the pool
2. Begin transaction
3. Execute queries
4. Commit on success, rollback on error
5. Release the client in a `finally` block

## Migrations

### File Naming

Use sequential numbering with descriptive names:

```
migration/
├── 001_create_users_table.sql
├── 002_create_posts_table.sql
└── 003_add_status_to_posts.sql
```

### Common Column Patterns

| Column Type | Convention |
|---|---|
| Primary key | `id SERIAL PRIMARY KEY` |
| Timestamps | `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` |
| Foreign key | `user_id INTEGER REFERENCES users(id) ON DELETE CASCADE` |
| Status/enum | `status VARCHAR(50) CHECK (status IN (...))` |
| JSON data | `metadata JSONB DEFAULT '{}'` |

## Best Practices

- **One model per table** - Keep models focused
- **Descriptive function names** - `getByUserId` not `get2`
- **Index frequently queried columns** - Especially foreign keys
- **Validate at route level** - Models assume valid data
- **Use transactions** - For multi-step operations