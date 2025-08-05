export class Client {
  async connect() {}
  async query(_sql?: string) {
    return { rows: [], rowCount: 0 }
  }
  async end() {}
}
