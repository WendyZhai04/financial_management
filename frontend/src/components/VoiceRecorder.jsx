import React, { useState, useRef, useEffect } from 'react';

export default function VoiceRecorder({ onResult, defaultPayer }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('您的浏览器不支持语音识别，请使用 Safari (iOS) 或 Chrome');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setError('');
    };

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(final || interim);
    };

    recognition.onerror = (event) => {
      setError(`识别失败: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // 可能已经在运行
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    try {
      const res = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript }),
      });
      const result = await res.json();
      // 如果语音没识别出人名，用默认值
      if (!result.payer && defaultPayer) {
        result.payer = defaultPayer;
      }
      onResult({ ...result, rawText: transcript });
      setTranscript('');
    } catch (e) {
      setError('解析失败，请重试');
    }
  };

  return (
    <div className="bg-white rounded-comfortable p-4 whisper-border">
      <div className="text-sm font-medium text-warm-gray-500 mb-2">语音速记</div>
      <div className="text-xs text-warm-gray-300 mb-3">
        试着说："Wendy 买菜花了三十五块" 或 "Daniel 打车二十八"
      </div>

      <div
        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl transition-all duration-200 cursor-pointer select-none ${
          isListening
            ? 'bg-orange text-white scale-110 shadow-deep'
            : 'bg-notion-blue text-white hover:bg-active-blue active:scale-95'
        }`}
        onClick={() => (isListening ? stopListening() : startListening())}
      >
        {isListening ? '⏹' : '🎤'}
      </div>

      <div className="text-center mt-2 text-xs text-warm-gray-500">
        {isListening ? '正在聆听… 松手或点击结束' : '点击开始说话'}
      </div>

      {transcript && (
        <div className="mt-3 p-3 rounded-micro bg-warm-white text-sm text-notion-black">
          {transcript}
        </div>
      )}

      {transcript && !isListening && (
        <button
          onClick={handleSubmit}
          className="w-full mt-3 notion-btn-primary"
        >
          确认并解析
        </button>
      )}

      {error && <div className="mt-2 text-xs text-orange text-center">{error}</div>}
    </div>
  );
}
