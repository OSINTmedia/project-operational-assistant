import type { IndexableType, Table } from 'dexie'

export class IndexedDbTableAdapter<TRecord, TKey extends IndexableType> {
  private readonly table: Table<TRecord, TKey>

  constructor(table: Table<TRecord, TKey>) {
    this.table = table
  }

  async getById(id: TKey): Promise<TRecord | undefined> {
    return this.table.get(id)
  }

  async list(): Promise<TRecord[]> {
    return this.table.toArray()
  }

  async put(record: TRecord): Promise<TKey> {
    return this.table.put(record)
  }

  async bulkPut(records: TRecord[]): Promise<TKey[]> {
    return this.table.bulkPut(records, { allKeys: true })
  }

  async deleteById(id: TKey): Promise<void> {
    await this.table.delete(id)
  }

  async clear(): Promise<void> {
    await this.table.clear()
  }
}
