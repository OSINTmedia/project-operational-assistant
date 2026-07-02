import Dexie from 'dexie'

export class ProjectOperationalAssistantDb extends Dexie {
  constructor() {
    super('project-operational-assistant')

    // TODO: define versioned stores when entity models are implemented.
    this.version(1).stores({})
  }
}

export const db = new ProjectOperationalAssistantDb()
