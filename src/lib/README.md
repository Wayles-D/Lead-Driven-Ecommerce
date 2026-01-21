# Library Structure

This folder contains shared server-side utilities and configurations.

## Structure

```
lib/
├── prisma.ts              # Centralized Prisma client instance
├── validations/           # Input validation and env checks
│   └── env.ts            # Environment variable validation
└── utils/                # Utility functions
    └── session.ts        # Server-side session helpers
```

## Guidelines

- **prisma.ts**: Single source of truth for database access
- **validations/**: Schema validation, env checks, input sanitization
- **utils/**: Reusable helper functions for server-side logic

## Usage

### Prisma Client

```typescript
import { prisma } from "@/lib/prisma";

const users = await prisma.user.findMany();
```

### Session Utilities

```typescript
import { requireAuth, requireAdmin } from "@/lib/utils/session";

// In Server Components or Server Actions
const session = await requireAuth();
const adminSession = await requireAdmin();
```

### Environment Validation

Environment validation runs automatically on server startup.
Add new required variables to `validations/env.ts`.
