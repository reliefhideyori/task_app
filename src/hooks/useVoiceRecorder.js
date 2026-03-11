import { useState, useRef, useCallback } from 'react'

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef('')

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('このブラウザは音声認識に対応していません。Chrome または Edge をお使いください。')
      return
    }

    setError(null)
    setTranscript('')
    setInterimText('')
    finalTranscriptRef.current = ''

    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      setTranscript(finalTranscriptRef.current)
      setInterimText(interim)
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return
      if (event.error === 'no-speech') {
        setError('音声が検出されませんでした。もう一度試してください。')
      } else {
        setError(`音声認識エラー: ${event.error}`)
      }
      setIsRecording(false)
    }

    recognition.onend = () => {
      setInterimText('')
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setInterimText('')
    setIsRecording(false)
    return finalTranscriptRef.current
  }, [])

  const fullText = (transcript + ' ' + interimText).trim()

  return {
    isRecording,
    transcript,
    interimText,
    fullText,
    error,
    startRecording,
    stopRecording,
  }
}
