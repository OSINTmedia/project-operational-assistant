export const USER_ROLE_IDS = ['manager', 'project-manager', 'user'] as const

export type UserRoleId = (typeof USER_ROLE_IDS)[number]

export const USER_ROLE_LABELS: Record<UserRoleId, string> = {
  manager: 'Manager',
  'project-manager': 'Project Manager',
  user: 'User',
}
