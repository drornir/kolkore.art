# Implementation Plan - Admin Dashboard

## 1. Setup & Dependencies

We need to add the following Shadcn UI components to build a proper dashboard table and form experience.

- `table` (for the main list)
- `sheet` (for the edit/create form - better for many fields)
- `dialog` (for confirmations if needed)
- `sonner` (for toast notifications)
- `calendar` & `popover` (for date pickers needed for deadline)

**Command:**

```bash
pnpm dlx shadcn@latest add table sheet dialog sonner calendar popover
```

## 2. Server Functions

**File:** `src/server/calls.ts`

I will add the following server functions using `createServerFn` and `withAdminCallsRepo` middleware.

1.  **`getAdminCalls`**
    - **Middleware:** `withAdminCallsRepo`
    - **Input:** `zodQueryParamsWithArchived` (to allow filtering/sorting including archived items)
    - **Handler:** Calls `context.callsAdminRepo.query`.
2.  **`createCall`**
    - **Middleware:** `withAdminCallsRepo`
    - **Input:** `zodCallNoId` (title is required, others optional/nullable)
    - **Handler:** Calls `context.callsAdminRepo.create`.
3.  **`updateCall`**
    - **Middleware:** `withAdminCallsRepo`
    - **Input:** Object with `id: z.number()` and `data: zodCallNoId.partial()`
    - **Handler:** Calls `context.callsAdminRepo.update`.
4.  **`archiveCall`**
    - **Middleware:** `withAdminCallsRepo`
    - **Input:** Object with `id: z.number()` and `unarchive: boolean = false`
    - **Handler:** Calls `context.callsAdminRepo.update` only with `{ archivedAt: new Date()}` or `null` if `unarchive == true` .

## 3. UI Implementation

**File:** `src/routes/admin.tsx`

This will be the main entry point for the `/admin` route.

### Components Structure

1.  **`AdminRoute` Component**:
    - Loads data using `useSuspenseQuery(getAdminCalls)`.
    - Renders the layout: Title, "Add Call" button, and the `CallsTable`.
    - Manages the state for the `CallFormSheet` (open/close, selected call).
2.  **`CallsTable` Component**:
    - Uses `@tanstack/react-table`.
    - Columns:
      - `id`
      - `title`
      - `institution`
      - `deadline` (formatted date)
      - `status` (Active/Archived based on `archivedAt`)
      - `actions` (Edit button)
    - Includes pagination controls.
3.  **`CallFormSheet` Component**:
    - A Shadcn `Sheet` containing the form.
    - Uses `@tanstack/react-form` with `zodValidator`.
    - Fields:
      - Title (Text)
      - Description (Textarea)
      - Type, Location, Institution (Text)
      - Link (Text)
      - Deadline (Date Picker)
      - ArchivedAt (Date Picker or Toggle for "Archive Now")
    - Handles submission via `createCall` or `updateCall` mutations depending on if an ID exists.

## 4. Execution Steps

1.  Run `pnpm dlx shadcn@latest add ...` to get components.
2.  Implement `src/server/calls.ts` functions.
3.  Create `src/routes/admin.tsx` skeleton.
4.  Implement the `CallsTable` with `getAdminCalls` data.
5.  Implement the `CallFormSheet` with mutations.
6.  Connect everything.
7.  Let the user review the code.
