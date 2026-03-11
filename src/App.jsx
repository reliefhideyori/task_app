import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import VoiceRecorder from './components/VoiceRecorder'
import ConfirmModal from './components/ConfirmModal'
import CategoryManager from './components/CategoryManager'
import { loadTasks, saveTasks, loadCategories, saveCategories } from './utils/storage'

const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: '緊急',     emoji: '🔴', color: 'red' },
  { id: 'cat_2', name: '仕事',     emoji: '💼', color: 'blue' },
  { id: 'cat_3', name: '個人',     emoji: '👤', color: 'green' },
  { id: 'cat_4', name: '連絡・返信', emoji: '📞', color: 'yellow' },
  { id: 'cat_5', name: 'その他',   emoji: '📋', color: 'gray' },
]

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export default function App() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [view, setView] = useState('list') // 'list' | 'confirm' | 'settings'
  const [pendingTask, setPendingTask] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  // 初期ロード
  useEffect(() => {
    const savedTasks = loadTasks()
    const savedCategories = loadCategories()
    if (savedTasks?.length) setTasks(savedTasks)
    if (savedCategories) setCategories(savedCategories)
    else saveCategories(DEFAULT_CATEGORIES)
  }, [])

  // AI構造化完了 → 確認モーダルへ
  const handleTaskStructured = (taskData) => {
    setPendingTask(taskData)
    setView('confirm')
  }

  // タスク保存
  const handleSaveTask = (formData) => {
    const newTask = {
      ...formData,
      id: `task_${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    const updated = [...tasks, newTask]
    setTasks(updated)
    saveTasks(updated)
    setPendingTask(null)
    setView('list')
  }

  // 完了トグル
  const handleComplete = (taskId) => {
    const updated = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    )
    setTasks(updated)
    saveTasks(updated)
  }

  // 削除
  const handleDelete = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId)
    setTasks(updated)
    saveTasks(updated)
  }

  // カテゴリ保存
  const handleSaveCategories = (newCats) => {
    setCategories(newCats)
    saveCategories(newCats)
  }

  // ソート: 未完了→優先度→期限→作成日
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const pa = PRIORITY_ORDER[a.priority] ?? 1
    const pb = PRIORITY_ORDER[b.priority] ?? 1
    if (pa !== pb) return pa - pb
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline)
    if (a.deadline) return -1
    if (b.deadline) return 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const filtered = filterCategory === 'all'
    ? sorted
    : sorted.filter(t => t.category === filterCategory)

  const activeCount = tasks.filter(t => !t.completed).length

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-100 flex flex-col">

      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">VoiceTask</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeCount === 0 ? 'タスクなし 🎉' : `残り ${activeCount} 件`}
            </p>
          </div>
          <button
            onClick={() => setView(v => v === 'settings' ? 'list' : 'settings')}
            className={`p-2.5 rounded-full transition-colors ${
              view === 'settings' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto pb-28">
        {view === 'settings' ? (
          <CategoryManager
            categories={categories}
            onSave={handleSaveCategories}
            onBack={() => setView('list')}
          />
        ) : (
          <TaskList
            tasks={filtered}
            categories={categories}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* 音声入力ボタン（固定フッター） */}
      {view !== 'settings' && (
        <VoiceRecorder
          categories={categories}
          onTaskStructured={handleTaskStructured}
        />
      )}

      {/* 確認モーダル */}
      {view === 'confirm' && pendingTask && (
        <ConfirmModal
          task={pendingTask}
          categories={categories}
          onSave={handleSaveTask}
          onCancel={() => { setPendingTask(null); setView('list') }}
        />
      )}
    </div>
  )
}
