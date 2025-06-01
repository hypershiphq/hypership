// Main exports from server.ts
export {
  db,
  initDb,
  hypership,
  currentUser,
  authServer,
  handleAuthHeaders,
  type AuthResult,
  type DbDocument,
  type DbResponse,
  type DbListResponse,
  type QueryOptions,
} from "./server";

// Default export is the db function
export { default } from "./server";
