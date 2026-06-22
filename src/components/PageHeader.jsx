import { Button } from '@/components/ui/button'

export function PageHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {action && (
        <Button onClick={onAction} className="gap-2">
          <span>＋</span> {action}
        </Button>
      )}
    </div>
  )
}