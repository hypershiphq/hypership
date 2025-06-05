import { db } from "@hypership/db";
import Link from "next/link";

interface Book {
  _id?: string;
  name: string;
  year: number;
  author?: string;
  genre?: string;
  description?: string;
  rating?: number;
  tags?: string[];
}

export default async function HomePage() {
  try {
    console.log("🔍 Testing @hypership/db package...");

    // Test 1: Create a single book
    console.log("📚 Creating a single book...");
    const newBook = await db<Book>("books").create({
      name: "The Great Gatsby",
      year: 1925,
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
    });

    console.log("Single book creation result:", newBook);

    // Test 2: Create multiple books
    console.log("📚 Creating multiple books...");
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

    console.log("Multiple books creation result:", multipleBooks);

    // Test 3: Get all books
    console.log("📖 Fetching all books...");
    const allBooks = await db<Book>("books").exec();

    console.log("All books result:", allBooks);

    // Test 4: Find a specific book by ID (if we have one)
    let specificBook = null;
    if (allBooks.success && allBooks.data.length > 0) {
      const firstBookId = allBooks.data[0]._id;
      if (firstBookId) {
        console.log(`🔍 Finding book with ID: ${firstBookId}`);
        specificBook = await db<Book>("books").find(firstBookId);
        console.log("Specific book result:", specificBook);
      }
    }

    // Test 5: Query with filters and sorting
    console.log("🔍 Querying books with filters...");
    const filteredBooks = await db<Book>("books")
      .where({ genre: "Fiction" })
      .sort({ year: -1 })
      .limit(2)
      .exec();

    console.log("Filtered books result:", filteredBooks);

    // Test 6: Get first book
    console.log("📖 Getting first book...");
    const firstBook = await db<Book>("books").sort({ year: 1 }).first();

    console.log("First book result:", firstBook);

    // Test 7: Update document (standard method)
    let updatedBook = null;
    if (allBooks.success && allBooks.data.length > 0) {
      const bookToUpdate = allBooks.data[0];
      if (bookToUpdate._id) {
        console.log(`📝 Updating book with ID: ${bookToUpdate._id}`);
        updatedBook = await db<Book>("books").update(bookToUpdate._id, {
          genre: "Updated Fiction",
          author: "Updated Author",
        });
        console.log("Updated book result:", updatedBook);
      }
    }

    // Test 8: Test field deletion with null values
    let fieldDeletionTest = null;
    if (updatedBook && updatedBook.success && updatedBook.data?._id) {
      const bookId = updatedBook.data._id;
      console.log(
        `🗑️ Testing field deletion with null values for book ID: ${bookId}`
      );

      // First, add some extra fields
      console.log("Adding extra fields...");
      const bookWithExtraFields = await db<Book>("books").update(bookId, {
        genre: "Mystery", // Update existing field
        description: "A fascinating book", // Add new field
        rating: 5, // Add another new field
        tags: ["classic", "literature"], // Add array field
      });
      console.log("Book with extra fields:", bookWithExtraFields);

      // Then, try to delete some fields by passing null
      console.log("Attempting to delete fields with null values...");
      fieldDeletionTest = await db<Book>("books").update(bookId, {
        description: null, // Should delete this field
        rating: null, // Should delete this field
        tags: null, // Should delete this field
        genre: "Final Genre", // Should update this field normally
      } as any);
      console.log("Field deletion test result:", fieldDeletionTest);
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              📚 Hypership DB Test Results
            </h1>
            <Link
              href="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔐 Test Auth Flow
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Single Book Creation */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                1. Single Book Creation
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                {newBook.success ? (
                  <div className="text-green-600">
                    ✅ Successfully created:{" "}
                    <strong>{newBook.data?.name}</strong>
                    <pre className="mt-2 text-sm bg-white p-2 rounded">
                      {JSON.stringify(newBook.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-red-600">
                    ❌ Failed to create book: {newBook.error}
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Books Creation */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                2. Multiple Books Creation
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                {multipleBooks.success ? (
                  <div className="text-green-600">
                    ✅{" "}
                    {(multipleBooks as any).message ||
                      `Successfully created ${multipleBooks.count} books`}
                    <div className="mt-2 text-sm">
                      Count: <strong>{multipleBooks.count}</strong>
                    </div>
                    {(multipleBooks as any).message && (
                      <div className="mt-1 text-sm text-gray-600">
                        Message: {(multipleBooks as any).message}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-600">
                    ❌ Failed to create books: {multipleBooks.error}
                  </div>
                )}
              </div>
            </div>

            {/* All Books */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                3. All Books ({allBooks.success ? allBooks.count : 0})
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                {allBooks.success ? (
                  <div>
                    <div className="text-green-600 mb-3">
                      ✅ Successfully fetched {allBooks.count} books
                    </div>
                    <div className="grid gap-3">
                      {allBooks.data.map((book, index) => (
                        <div
                          key={book._id || index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="font-semibold">{book.name}</div>
                          <div className="text-sm text-gray-600">
                            {book.author} ({book.year}) - {book.genre}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {book._id}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    ❌ Failed to fetch books: {allBooks.error}
                  </div>
                )}
              </div>
            </div>

            {/* Specific Book */}
            {specificBook && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  4. Find Specific Book
                </h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {specificBook.success ? (
                    <div className="text-green-600">
                      ✅ Found book: <strong>{specificBook.data?.name}</strong>
                      <pre className="mt-2 text-sm bg-white p-2 rounded">
                        {JSON.stringify(specificBook.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      ❌ Failed to find book: {specificBook.error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filtered Books */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                5. Filtered Books (Fiction, newest first, limit 2)
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                {filteredBooks.success ? (
                  <div>
                    <div className="text-green-600 mb-3">
                      ✅ Found {filteredBooks.count} books
                    </div>
                    <div className="grid gap-3">
                      {filteredBooks.data.map((book, index) => (
                        <div
                          key={book._id || index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="font-semibold">{book.name}</div>
                          <div className="text-sm text-gray-600">
                            {book.author} ({book.year}) - {book.genre}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    ❌ Failed to filter books: {filteredBooks.error}
                  </div>
                )}
              </div>
            </div>

            {/* First Book */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                6. First Book (oldest)
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
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

            {/* Updated Book */}
            {updatedBook && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  7. Updated Book (standard method)
                </h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {updatedBook.success ? (
                    <div className="text-green-600">
                      ✅ Updated book: <strong>{updatedBook.data?.name}</strong>
                      <pre className="mt-2 text-sm bg-white p-2 rounded">
                        {JSON.stringify(updatedBook.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      ❌ Failed to update book: {updatedBook.error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Field Deletion Test */}
            {fieldDeletionTest && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  8. Field Deletion Test (null values should delete fields)
                </h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {fieldDeletionTest.success ? (
                    <div className="space-y-3">
                      <div className="text-green-600">
                        ✅ Field deletion test completed successfully
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold mb-2">
                          Final document after null updates:
                        </div>
                        <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(fieldDeletionTest.data, null, 2)}
                        </pre>
                      </div>
                      <div className="text-sm text-blue-600">
                        <div className="font-semibold">Expected behavior:</div>
                        <ul className="list-disc ml-6 mt-1">
                          <li>
                            Fields with null values (description, rating, tags)
                            should be deleted
                          </li>
                          <li>
                            Field "genre" should be updated to "Final Genre"
                          </li>
                          <li>Other fields should remain unchanged</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      ❌ Field deletion test failed: {fieldDeletionTest.error}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center text-gray-500 mt-8">
              <p>Test completed! Check the console for detailed logs.</p>
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
              <pre className="text-red-800 text-sm overflow-x-auto">
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
