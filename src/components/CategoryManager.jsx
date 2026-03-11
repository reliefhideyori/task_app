import { useState } from 'react'

const EMOJI_LIST = ['💼', '👤', '🔴', '📞', '📋', '🏠', '🎯', '💡', '📝', '⭐', '🚀', '💬', '📅', '🔧', '📊', '🎪', '🤝', '📌']

export default function CategoryManager({ categories, onSave, onBack }) {
  const [cats, setCats] = useState(categories)
  const [editingId, setEditingId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')
  const [addEmoji, setAddEmoji] = useState('📋')

  const handleRename = (id, name) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, name } : c))
  }

  const handleDelete = (id) => {
    if (cats.length <= 1) return
    setCats(prev => prev.filter(c => c.id !== id))
  }

  const handleAdd = () => {
    if (!addName.trim()) return
    setCats(prev => [...prev, {
      id: `cat_${Date.now()}`,
      name: addName.trim(),
      emoji: addEmoji,
      color: 'gray',
    }])
    setAddName('')
    setAddEmoji('📋')
    setShowAdd(false)
  }

  const handleSave = () => {
    onSave(cats)
    onBack()
  }

  return (
    <div className="px-4 py-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 text-sm">
          ← 戻る
        </button>
        <h2 className="text-lg font-bold text-gray-900 flex-1">カテゴリ管理</h2>
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold"
        >
          保存
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        カテゴリ名をタップして編集できます
      </p>

      {/* カテゴリリスト */}
      <div className="space-y-2 mb-4">
        {cats.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3"
          >
            <span className="text-2xl">{cat.emoji}</span>
            {editingId === cat.id ? (
              <input
                autoFocus
                value={cat.name}
                onChange={e => handleRename(cat.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                className="flex-1 border-b-2 border-indigo-400 focus:outline-none text-base py-0.5"
              />
            ) : (
              <span
                className="flex-1 text-base text-gray-800"
                onClick={() => setEditingId(cat.id)}
              >
                {cat.name}
              </span>
            )}
            <button
              onClick={() => handleDelete(cat.id)}
              disabled={cats.length <= 1}
              className="text-gray-300 hover:text-red-400 text-xl disabled:opacity-20"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* カテゴリ追加フォーム */}
      {showAdd ? (
        <div className="bg-white rounded-2xl border border-indigo-200 px-4 py-4">
          {/* 絵文字選択 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {EMOJI_LIST.map(emoji => (
              <button
                key={emoji}
                onClick={() => setAddEmoji(emoji)}
                className={`text-xl w-10 h-10 rounded-xl transition-all ${
                  addEmoji === emoji ? 'bg-indigo-100 scale-110' : 'hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <input
            autoFocus
            value={addName}
            onChange={e => setAddName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="カテゴリ名を入力"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <div className="flex gap-2">
            <button
              onClick={() => { setShowAdd(false); setAddName('') }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleAdd}
              disabled={!addName.trim()}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold disabled:opacity-40"
            >
              追加
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-400 transition-colors text-sm font-medium"
        >
          + カテゴリを追加
        </button>
      )}
    </div>
  )
}
