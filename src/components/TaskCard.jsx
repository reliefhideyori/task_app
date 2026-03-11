import { useState } from 'react'

const PRIORITY_CONFIG = {
  high:   { label: '高', bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  medium: { label: '中', bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  low:    { label: '低', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
}

const formatDeadline = (deadline) => {
  if (!deadline) return null
  const date = new Date(deadline + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((date - today) / (1000 * 60 * 60 * 24))

  if (diff < 0)  return { text: `${Math.abs(diff)}日前`, color: 'text-red-500' }
  if (diff === 0) return { text: '今日',  color: 'text-red-500 font-semibold' }
  if (diff === 1) return { text: '明日',  color: 'text-orange-500 font-semibold' }
  if (diff <= 7)  return { text: `${diff}日後`, color: 'text-orange-400' }
  return { text: `${date.getMonth() + 1}/${date.getDate()}`, color: 'text-gray-400' }
}

export default function TaskCard({ task, categories, onComplete, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const cat = categories.find(c => c.name === task.category)
  const deadline = formatDeadline(task.deadline)

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(task.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div
      className={`mb-2 rounded-2xl border bg-white transition-all ${
        task.completed ? 'opacity-50 border-gray-100' : 'border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* 完了ボタン */}
        <button
          onClick={() => onComplete(task.id)}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium text-base leading-snug ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
          >
            {task.taskName}
          </p>

          {task.notes && (
            <p className="text-sm text-gray-500 mt-0.5 leading-snug">{task.notes}</p>
          )}

          {/* バッジ群 */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* 優先度 */}
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${priority.bg} ${priority.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            {/* カテゴリ */}
            {cat && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {cat.emoji} {cat.name}
              </span>
            )}

            {/* 期限 */}
            {deadline && (
              <span className={`text-xs ${deadline.color}`}>
                📅 {deadline.text}
              </span>
            )}
          </div>
        </div>

        {/* 削除ボタン */}
        <button
          onClick={handleDeleteClick}
          className={`flex-shrink-0 text-xs px-2 py-1 rounded-lg transition-all ${
            confirmDelete
              ? 'bg-red-500 text-white'
              : 'text-gray-300 hover:text-gray-500'
          }`}
        >
          {confirmDelete ? '削除?' : '✕'}
        </button>
      </div>
    </div>
  )
}
