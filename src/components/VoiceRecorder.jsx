import { useState } from 'react'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'
import { structureTaskWithGemini } from '../utils/gemini'

export default function VoiceRecorder({ categories, onTaskStructured }) {
  const { isRecording, transcript, interimText, fullText, error, startRecording, stopRecording } =
    useVoiceRecorder()
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState(null)

  const handleStop = async () => {
    const finalText = (transcript + ' ' + interimText).trim()
    stopRecording()

    if (!finalText) {
      setProcessingError('音声が取得できませんでした。もう一度お試しください。')
      return
    }

    setIsProcessing(true)
    setProcessingError(null)

    try {
      const structured = await structureTaskWithGemini(finalText, categories)
      onTaskStructured({ ...structured, rawTranscript: finalText })
    } catch (err) {
      setProcessingError(err.message || 'AI処理に失敗しました。')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const displayText = transcript + (interimText ? `　${interimText}` : '')

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="bg-white border-t border-gray-100 px-4 pt-3 pb-8 shadow-2xl">

        {/* エラー表示 */}
        {(error || processingError) && (
          <div className="mb-3 p-3 bg-red-50 rounded-xl text-red-600 text-sm text-center">
            {error || processingError}
          </div>
        )}

        {/* 音声テキスト表示 */}
        {(isRecording || isProcessing) && (
          <div className="mb-3 min-h-[56px] p-3 bg-slate-50 rounded-xl">
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2 text-indigo-600">
                <span className="animate-spin text-lg">⏳</span>
                <span className="text-sm font-medium">AIが構造化中...</span>
              </div>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">
                {displayText || (
                  <span className="text-gray-400 animate-pulse">話してください...</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* メインボタン */}
        {!isRecording && !isProcessing ? (
          <button
            onClick={startRecording}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-6 py-4 rounded-2xl font-medium text-base transition-all shadow-md"
          >
            <span className="text-xl">🎙️</span>
            話してタスクを追加
          </button>
        ) : isProcessing ? (
          <div className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-400 px-6 py-4 rounded-2xl font-medium text-base">
            処理中...
          </div>
        ) : (
          <button
            onClick={handleStop}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-6 py-4 rounded-2xl font-medium text-base transition-all shadow-md relative pulse-ring"
          >
            <span className="text-xl">⏹️</span>
            停止して保存
          </button>
        )}
      </div>
    </div>
  )
}
