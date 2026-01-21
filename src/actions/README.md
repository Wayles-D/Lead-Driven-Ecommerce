# Server Actions

This folder contains Next.js Server Actions for handling business logic.

## Purpose

Server Actions provide a secure way to mutate data from the client while keeping business logic server-side.

## Structure (Future)

```
actions/
├── auth.ts          # Authentication actions (signup, login)
├── products.ts      # Product CRUD (admin only)
├── orders.ts        # Order creation and management
└── payments.ts      # Payment processing
```

## Guidelines

1. **Always validate input** - Never trust client data
2. **Check permissions** - Use `requireAuth()` or `requireAdmin()`
3. **Use Prisma client** - Import from `@/lib/prisma`
4. **Return typed responses** - Use consistent error/success patterns
5. **Mark with "use server"** - Required directive for Server Actions

## Example Pattern

```typescript
"use server";

import { requireAuth } from "@/lib/utils/session";
import { prisma } from "@/lib/prisma";

export async function createOrder(data: OrderInput) {
  // 1. Authenticate
  const session = await requireAuth();

  // 2. Validate input
  // ... validation logic

  // 3. Execute business logic
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      // ... other fields
    },
  });

  // 4. Return result
  return { success: true, orderId: order.id };
}
```

## Security Rules

- No business logic in UI components
- All mutations go through Server Actions
- Session validation is mandatory for protected actions
- Admin actions must use `requireAdmin()`
