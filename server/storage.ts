// This app uses client-side localStorage authentication
// Server storage is minimal for this use case

export interface IStorage {
  // Add any future server-side storage methods here if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize any server-side storage here
  }
}

export const storage = new MemStorage();
