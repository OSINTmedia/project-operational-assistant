import type { UserId } from '../../entities'
import type { User } from '../../entities'
import { USER_ROLE_IDS, USER_ROLE_LABELS, type UserRoleId } from '../../shared/types'
import { cn } from '../../shared/utils/cn'

type DemoRoleSwitcherProps = {
  demoUsers: User[]
  currentUserId: UserId | null
  selectedRole: UserRoleId | null
  onSelectRole: (role: UserRoleId) => void
  variant?: 'panel' | 'sidebar'
  title?: string
  description?: string
}

export function DemoRoleSwitcher({
  demoUsers,
  currentUserId,
  selectedRole,
  onSelectRole,
  variant = 'panel',
  title = 'Role switch',
  description,
}: DemoRoleSwitcherProps) {
  const currentUser = demoUsers.find((user) => user.id === currentUserId) ?? null
  const isSidebar = variant === 'sidebar'

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        isSidebar
          ? 'border-slate-800 bg-slate-900 text-slate-300'
          : 'border-slate-200 bg-white text-slate-600 shadow-panel',
      )}
    >
      <p className={cn('text-sm font-medium', isSidebar ? 'text-slate-100' : 'text-slate-950')}>
        {title}
      </p>
      <p className={cn('mt-1 text-sm', isSidebar ? 'text-slate-400' : 'text-slate-600')}>
        {currentUser
          ? `${USER_ROLE_LABELS[currentUser.role]} · ${currentUser.name}`
          : 'No demo user selected'}
      </p>

      {description ? (
        <p className={cn('mt-2 text-xs leading-5', isSidebar ? 'text-slate-500' : 'text-slate-500')}>
          {description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {USER_ROLE_IDS.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              onSelectRole(role)
            }}
            className={cn(
              'rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
              selectedRole === role
                ? 'border-accent bg-accent text-white'
                : isSidebar
                  ? 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:text-white'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100',
            )}
          >
            {USER_ROLE_LABELS[role]}
          </button>
        ))}
      </div>
    </div>
  )
}
