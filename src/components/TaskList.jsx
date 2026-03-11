import TaskCard from './TaskCard'

export default function TaskList({ tasks, categories, filterCategory, onFilterChange, onComplete, onDelete }) {
  const activeTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="px-4 py-4">
      {/* カテゴリフィルター */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <button
          onClick={() => onFilterChange('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
          }`}
        >
          すべて
          {activeTasks.length > 0 && (
            <span className="ml-1 text-xs opacity-75">({activeTasks.length})</span>
          )}
        </button>

        {categories.map(cat => {
          const count = activeTasks.filter(t => t.category === cat.name).length
          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange(cat.name)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              {cat.emoji} {cat.name}
              {count > 0 && <span className="ml-1 text-xs opacity-75">({count})</span>}
            </button>
          )
        })}
      </div>

      {/* タスクなし */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🎙️</p>
          <p className="text-lg font-medium text-gray-600">タスクはありません</p>
          <p className="text-sm mt-1">下のボタンを押して話しかけてください</p>
        </div>
      )}

      {/* アクティブタスク */}
      {activeTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          categories={categories}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}

      {/* 完了済み */}
      {completedTasks.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            完了済み ({completedTasks.length})
          </p>
          {completedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              categories={categories}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* 下部の余白（固定ボタン分） */}
      <div className="h-4" />
    </div>
  )
}
