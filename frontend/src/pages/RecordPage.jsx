import React from 'react';
import VoiceRecorder from '../components/VoiceRecorder';

export default function RecordPage({ onOpenAdd, onOpenSub, onVoiceResult, defaultPayer }) {
  return (
    <div className="px-5 pt-4 pb-28 space-y-6">
      {/* 语音速记 */}
      <div>
        <VoiceRecorder onResult={onVoiceResult} defaultPayer={defaultPayer} />
      </div>

      {/* 快捷记账按钮 */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-warm-gray-500">手动记账</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onOpenAdd('Wendy')}
            className="py-4 rounded-comfortable bg-warm-white text-notion-black font-bold text-[15px] active:scale-95 transition shadow-card"
          >
            Wendy 记账
          </button>
          <button
            onClick={() => onOpenAdd('Daniel')}
            className="py-4 rounded-comfortable bg-warm-white text-notion-black font-bold text-[15px] active:scale-95 transition shadow-card"
          >
            Daniel 记账
          </button>
        </div>
      </div>

      {/* 订阅管理入口 */}
      <div className="pt-4 border-t border-black/5">
        <button
          onClick={onOpenSub}
          className="w-full py-3 rounded-micro bg-black/5 text-notion-black text-sm font-semibold hover:bg-black/10 active:scale-95 transition"
        >
          管理订阅
        </button>
      </div>
    </div>
  );
}
