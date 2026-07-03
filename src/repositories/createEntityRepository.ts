import type { IndexableType, Table } from 'dexie'
import { IndexedDbTableAdapter } from '../persistence/indexedDbAdapter'

export interface EntityRepository<TEntity, TId extends IndexableType> {
  getById(id: TId): Promise<TEntity | undefined>
  list(): Promise<TEntity[]>
  put(entity: TEntity): Promise<TId>
  bulkPut(entities: TEntity[]): Promise<TId[]>
  deleteById(id: TId): Promise<void>
  clear(): Promise<void>
}

export function createEntityRepository<TEntity, TId extends IndexableType>(
  table: Table<TEntity, TId>,
): EntityRepository<TEntity, TId> {
  const adapter = new IndexedDbTableAdapter(table)

  return {
    getById(id) {
      return adapter.getById(id)
    },
    list() {
      return adapter.list()
    },
    put(entity) {
      return adapter.put(entity)
    },
    bulkPut(entities) {
      return adapter.bulkPut(entities)
    },
    deleteById(id) {
      return adapter.deleteById(id)
    },
    clear() {
      return adapter.clear()
    },
  }
}
