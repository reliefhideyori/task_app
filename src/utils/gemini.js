const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17'

export const structureTaskWithGemini = async (transcript, categories) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey || apiKey.includes('ここに')) {
    throw new Error('Gemini APIキーが設定されていません。.envファイルを確認してください。')
  }

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const categoryNames = categories.map(c => c.name).join('、')

  const prompt = `今日の日付: ${todayStr}

以下の日本語の音声入力からタスク情報を抽出し、JSON形式のみで返してください。

音声入力:
「${transcript}」

利用可能なカテゴリ: ${categoryNames}

抽出ルール:
- taskName: 簡潔なタスク名（「〜する」の形）
- deadline: 期日があれば YYYY-MM-DD 形式に変換。「明日」「来週金曜」等の相対表現も今日の日付から計算して変換。なければ null
- priority: 「急ぎ」「緊急」「重要」「早めに」→ "high" / 「普通」「通常」→ "medium" / 「いつか」「余裕あれば」→ "low" / 明示なしは "medium"
- category: 上記カテゴリの中から最適なものを1つ選ぶ。どれにも当てはまらなければ「その他」
- notes: 補足情報があれば。なければ空文字

JSON以外のテキストは一切含めないこと。

{
  "taskName": "",
  "deadline": null,
  "priority": "medium",
  "category": "",
  "notes": ""
}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || `Gemini APIエラー (${response.status})`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini APIからの応答が不正です')

  return JSON.parse(text)
}
