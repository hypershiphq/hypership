# @hypership/db

React and Next.js server-side database package for CRUD operations via RESTful endpoints.

## Installation

```bash
npm install @hypership/db
```

## Environment Variables

Set the following environment variables in your `.env.local`:

```bash
HYPERSHIP_API_BASE=http://localhost:3002
HYPERSHIP_SECRET_KEY=your-secret-key-here
```

## Quick Start with Next.js

### 1. Initialize in Layout

```typescript
// app/layout.tsx
import { initDb } from "@hypership/db";

// Initialize the database package
initDb({
  apiBase: "http://localhost:3002",
  secretKey: process.env.HYPERSHIP_SECRET_KEY!, // In production, use environment variable
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2. Use in React Server Components

````typescript
// app/page.tsx
import { db } from "@hypership/db";

interface Book {
  _id?: string;
  name: string;
  year: number;
  author?: string;
  genre?: string;
}

export default async function HomePage() {
  try {
    // Create a single book
    const newBook = await db<Book>("books").create({
      name: "The Great Gatsby",
      year: 1925,
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
    });

    // Create multiple books
    const multipleBooks = await db<Book>("books").createMany([
      {
        name: "To Kill a Mockingbird",
        year: 1960,
        author: "Harper Lee",
        genre: "Fiction",
      },
      {
        name: "1984",
        year: 1949,
        author: "George Orwell",
        genre: "Dystopian Fiction",
      },
    ]);

    // Get all books
    const allBooks = await db<Book>("books").exec();

    // Find a specific book by ID
    let specificBook = null;
    if (allBooks.success && allBooks.data.length > 0) {
      const firstBookId = allBooks.data[0]._id;
      if (firstBookId) {
        specificBook = await db<Book>("books").find(firstBookId);
      }
    }

    // Query with filters and sorting
    const filteredBooks = await db<Book>("books")
      .where({ genre: "Fiction" })
      .sort({ year: -1 })
      .limit(2)
      .exec();

    // Get first book (oldest)
    const firstBook = await db<Book>("books").sort({ year: 1 }).first();

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              📚 Hypership DB Results
            </h1>

            {/* Single Book Creation */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Single Book Creation
              </h2>
              {newBook.success ? (
                <div className="text-green-600">
                  ✅ Successfully created: <strong>{newBook.data?.name}</strong>
                </div>
              ) : (
                <div className="text-red-600">
                  ❌ Failed to create book: {newBook.error}
                </div>
              )}
            </div>

            {/* Multiple Books Creation */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Multiple Books Creation
              </h2>
              {multipleBooks.success ? (
                <div className="text-green-600">
                  ✅ Successfully created {multipleBooks.count} books
                  {(multipleBooks as any).message && (
                    <div className="text-sm text-gray-600">
                      {(multipleBooks as any).message}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-600">
                  ❌ Failed to create books: {multipleBooks.error}
                </div>
              )}
            </div>

            {/* All Books */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                All Books ({allBooks.success ? allBooks.count : 0})
              </h2>
              {allBooks.success ? (
                <div className="grid gap-3">
                  {allBooks.data.map((book, index) => (
                    <div
                      key={book._id || index}
                      className="bg-gray-100 p-3 rounded"
                    >
                      <div className="font-semibold">{book.name}</div>
                      <div className="text-sm text-gray-600">
                        {book.author} ({book.year}) - {book.genre}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-red-600">
                  ❌ Failed to fetch books: {allBooks.error}
                </div>
              )}
            </div>

            {/* Filtered Books */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Filtered Books (Fiction, newest first, limit 2)
              </h2>
              {filteredBooks.success ? (
                <div className="text-green-600">
                  ✅ Found {filteredBooks.count} books matching criteria
                </div>
              ) : (
                <div className="text-red-600">
                  ❌ Failed to filter books: {filteredBooks.error}
                </div>
              )}
            </div>

            {/* First Book */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                First Book (oldest)
              </h2>
              {firstBook.success ? (
                <div className="text-green-600">
                  ✅ First book: <strong>{firstBook.data?.name}</strong> (
                  {firstBook.data?.year})
                </div>
              ) : (
                <div className="text-red-600">
                  ❌ Failed to get first book: {firstBook.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Critical error:", error);

    return (
      <div className="min-h-screen bg-red-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ❌ Database Test Failed
            </h1>
            <div className="bg-red-100 p-4 rounded-lg">
              <pre className="text-red-800 text-sm">
                {error instanceof Error ? error.message : String(error)}
              </pre>
            </div>
            <div className="mt-4 text-gray-600">
              <p>Make sure:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Your Hypership API is running on http://localhost:3002</li>
                <li>The secret key is correctly configured</li>
                <li>The @hypership/db package is properly installed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

## Initialization

Initialize the package with your API configuration:

```typescript
import { initDb } from "@hypership/db";

// Initialize once in your app (e.g., in a layout or middleware)
initDb({
  apiBase: "http://localhost:3002", // optional, defaults to env var
  secretKey: "your-secret-key-here", // required
});
````

## Basic Usage

```typescript
import { db, initDb } from '@hypership/db';

// Initialize the package
initDb({
  secretKey: process.env.HYPERSHIP_SECRET_KEY!
});

// Define your data types
interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
}

// Use in React Server Components
export default async function UserList() {
  // Get users with filtering and sorting
  const users = await db<User>('users')
    .where({ active: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec();

  if (!users.success) {
    return <div>Error: {users.error}</div>;
  }

  return (
    <ul>
      {users.data.map(user => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## API Reference

### Initialization

#### `initDb(config)`

Initialize the database package with your API configuration.

```typescript
import { initDb } from '@hypership/db';

initDb({
  apiBase?: string;     // Optional: API base URL (defaults to env var)
  secretKey: string;    // Required: Your hs-secret-key
});
```

### Query Builder Methods

Chain these methods to build your database queries:

#### `db<T>(collection: string)`

Initialize a query for a collection with optional TypeScript typing.

```typescript
const query = db<User>("users");
```

#### `.where(conditions: Record<string, any>)`

Add filter conditions to your query.

```typescript
const activeUsers = await db("users")
  .where({ active: true, role: "admin" })
  .exec();
```

#### `.sort(sortOptions: Record<string, 1 | -1>)`

Sort results. Use `1` for ascending, `-1` for descending.

```typescript
const sortedUsers = await db("users").sort({ createdAt: -1, name: 1 }).exec();
```

#### `.limit(count: number)`

Limit the number of results.

```typescript
const limitedUsers = await db("users").limit(5).exec();
```

#### `.skip(count: number)`

Skip a number of results (useful for pagination).

```typescript
const page2Users = await db("users").skip(10).limit(10).exec();
```

### Execution Methods

#### `.exec(): Promise<DbListResponse<T>>`

Execute the query and return all matching documents.

```typescript
const result = await db("users").exec();
// result.success: boolean
// result.data: T[]
// result.count: number
// result.error?: string
```

#### `.first(): Promise<DbResponse<T>>`

Get the first document matching the query.

```typescript
const result = await db("users")
  .where({ email: "james@hypership.com" })
  .first();
// result.success: boolean
// result.data: T | null
// result.error?: string
```

#### `.find(id: string): Promise<DbResponse<T>>`

Find a document by its ID.

```typescript
const user = await db("users").find("abc123");
```

#### `.create(data: Omit<T, '_id'>): Promise<DbResponse<T>>`

Create a new document.

```typescript
const newUser = await db("users").create({
  name: "James",
  email: "james@hypership.com",
  role: "founder",
  active: true,
  createdAt: new Date(),
});
```

#### `.createMany(dataArray: Omit<T, '_id'>[]): Promise<DbListResponse<T>>`

Create multiple documents at once.

```typescript
const newUsers = await db("users").createMany([
  { name: "James", email: "james@hypership.com", role: "founder" },
  { name: "Sarah", email: "sarah@hypership.com", role: "admin" },
]);
```

#### `.update(id: string, data: Partial<T>): Promise<DbResponse<T>>`

⚠️ **Not yet implemented** - Update a document by ID.

```typescript
// Will return an error until backend endpoint is implemented
const updated = await db("users").update("abc123", {
  name: "James Crowson",
  role: "CEO",
});
```

#### `.delete(id: string): Promise<DbResponse<boolean>>`

Delete a document by ID.

```typescript
const deleted = await db("users").delete("abc123");
```

## Backend API Endpoints

The package connects to these endpoints:

- `POST /v1/db/create` - Create single document
- `POST /v1/db/create-many` - Create multiple documents
- `GET /v1/db/collection/:collection` - Get all documents from collection
- `GET /v1/db/document/:id` - Get single document by ID
- `DELETE /v1/db/delete/:id` - Delete document by ID

All requests include the `hs-secret-key` header for authentication.

## Error Handling

All database operations return a response object with success/error information:

```typescript
const result = await db("users").find("invalid-id");

if (!result.success) {
  console.error("Operation failed:", result.error);
  return;
}

// Safe to use result.data
console.log("User found:", result.data);
```

## Examples

### Initialization in Next.js App

```typescript
// app/layout.tsx or middleware.ts
import { initDb } from "@hypership/db";

initDb({
  secretKey: process.env.HYPERSHIP_SECRET_KEY!,
});
```

### Pagination

```typescript
async function getUsers(page = 1, pageSize = 10) {
  return await db<User>("users")
    .where({ active: true })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();
}
```

### Bulk Operations

```typescript
// Create multiple documents
const books = await db("books").createMany([
  { name: "Book 1", year: 2023 },
  { name: "Book 2", year: 2024 },
]);

// Get all documents
const allBooks = await db("books").exec();
```

### Complex Queries

```typescript
async function getRecentPostsByUser(userId: string) {
  return await db<Post>("posts")
    .where({
      authorId: userId,
      published: true,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec();
}
```

## TypeScript Support

The package is fully typed. Define your data interfaces and use them with the generic methods:

```typescript
interface User {
  _id?: string;
  name: string;
  email: string;
  role: "admin" | "user" | "founder";
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// TypeScript will enforce the correct types
const user = await db<User>("users").create({
  name: "James",
  email: "james@example.com",
  role: "founder", // TypeScript knows this must be one of the allowed values
  active: true,
  createdAt: new Date(),
});
```

## License

MIT
