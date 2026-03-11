import { useState } from 'react'

const PRIORITY_OPTIONS = [
  { value: 'high',   label: '🔴 高い',  desc: '急ぎ・重要' },
  { value: 'medium', label: '🟡 普通',  desc: '通常' },
  { value: 'low',    label: '🟢 低い',  desc: '余裕あり' },
]

export default function ConfirmModal({ task, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    taskName: task.taskName || '',
    deadline: task.deadline || '',
    priority: task.priority || 'medium',
    category: task.category || categories[0]?.name || '',
    notes: task.notes || '',
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center max-w-md mx-auto">
      <div className="bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto">

        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 rounded-t-3xl flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            ← キャンセル
          </button>
          <h2 className="font-bold text-gray-900">タスクを確認・編集</h2>
          <button
            onClick={() => onSave(form)}
            disabled={!form.taskName.trim()}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>

        <div className="px-4 py-5 space-y-5">

          {/* 音声入力（表示のみ） */}
          {task.rawTranscript && (
            <div className="bg-slate-50 rounded-2xl p-3">
              <p className="text-xs text-gray-400 mb-1">🎙️ 音声入力</p>
              <p className="text-sm text-gray-600 leading-relaxed">「{task.rawTranscript}」</p>
            </div>
          )}

          {/* タスク名 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              タスク名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.taskName}
              onChange={e => set('taskName', e.target.value)}
              placeholder="タスク名を入力"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
          </div>

          {/* 期限 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">期限</label>
            <input
              type="date"
              value={form.deadline || ''}
              onChange={e => set('deadline', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
          </div>

          {/* 優先度 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">優先度</label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('priority', opt.value)}
                  className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                    form.priority === opt.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* カテゴリ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">カテゴリ</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">メモ</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="補足情報があれば"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
            />
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}
