import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  Clock, 
  X, 
  Compass, 
  ArrowRight, 
  CheckSquare, 
  MessageSquare, 
  ChevronRight,
  Volume2
} from 'lucide-react';

interface Interactive3DTourProps {
  onDismiss?: () => void;
}

export const Interactive3DTour: React.FC<Interactive3DTourProps> = ({ onDismiss }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Cycle cards by sending the top card to the back with a "curl up / page turn" slide
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % 3);
  };

  const cards = [
    {
      id: 'transcript',
      title: 'Timeline & Audio Waveform Player',
      description: 'Sleek visual playback tracking direct dialogue timelines. Listen to dialogue pitches matched securely against full speech waves.',
      color: 'from-blue-50 to-indigo-50 border-blue-100',
      badge: 'Product Sync • 0m 1s',
      render: () => (
        <div className="w-full h-full bg-white rounded-xl p-4 shadow-inner flex flex-col justify-between select-none">
          {/* Audio Wave player */}
          <div className="space-y-2 border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 font-sans">Timeline Dialogue Transcript</span>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-mono">Multi-Speaker</span>
            </div>
            
            <div className="bg-[#f8fafc] rounded-lg p-3 border border-gray-100 flex items-center gap-3">
              <button className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 hover:bg-blue-600 transition">
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold text-gray-800 block leading-none">Audio Playback Standard</span>
                {/* Simulated Waveform bar graph */}
                <div className="flex items-end gap-0.5 h-6 pt-1">
                  {[12, 24, 18, 14, 30, 8, 16, 22, 10, 26, 32, 15, 20, 14, 28, 6, 18, 24, 12, 16, 22, 14, 10, 8, 18, 24, 14, 20, 26, 12, 8].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className={`w-full rounded-t-sm transition-all duration-300 ${i < 12 ? 'bg-blue-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-500 shrink-0">00:01 / 00:01</span>
            </div>
          </div>

          {/* Transcript dialog rows */}
          <div className="space-y-2 flex-1 pt-3 overflow-hidden text-left">
            <div className="flex gap-2 items-start pl-1 border-l-2 border-amber-400">
              <span className="font-mono text-[9px] text-[#111111] bg-gray-100 px-1 py-0.5 rounded font-bold shrink-0">00:0.5</span>
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-gray-800 text-[10px] block">Speaker 1</span>
                <p className="text-gray-500 text-[11px]">Chào mọi người, hôm nay chúng ta sẽ thảo luận nhanh về tiến độ...</p>
              </div>
            </div>
            <div className="flex gap-2 items-start pl-1 border-l-2 border-blue-400">
              <span className="font-mono text-[9px] text-[#111111] bg-gray-100 px-1 py-0.5 rounded font-bold shrink-0">00:6.8</span>
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-gray-800 text-[10px] block font-sans">Speaker 2 (Designer)</span>
                <p className="text-gray-500 text-[11px]">Về phần giao diện UI/UX thì em đã hoàn thành xong bản mock-up rồi ạ.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'summary',
      title: 'AI Gemini Executive Insights',
      description: 'Generates structured smart content automatically. Delivers high-value summaries, risks, and task checklists.',
      color: 'from-amber-50 to-orange-50 border-amber-100',
      badge: 'Executive Summary • Car',
      render: () => (
        <div className="w-full h-full bg-white rounded-xl p-4 shadow-inner flex flex-col justify-between text-left select-none">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-wide font-sans font-bold text-gray-400 uppercase">Executive Summaries</span>
              <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Gemini Verified
              </span>
            </div>

            {/* Quote Summary Block */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 border-l-4 border-l-amber-500">
              <p className="text-[11px] text-amber-900 leading-relaxed font-sans italic font-medium">
                "Cuộc họp cập nhật tiến độ dự án Website mới, tập trung vào thiết kế giao diện UI/UX và tiến trình phát triển."
              </p>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5">
              {['#Website_mới', '#UI/UX', '#Thiết_kế', '#Backend'].map((k) => (
                <span key={k} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {k}
                </span>
              ))}
            </div>

            {/* Critical Risks alerts */}
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 flex gap-1.5 items-start">
              <div className="font-bold text-rose-600 text-[10px] shrink-0">⚠️ Critical Risk:</div>
              <p className="text-rose-900 text-[10px] leading-tight">
                Việc đổi màu sắc thương hiệu có thể ảnh hưởng nhẹ đến thời gian bàn giao dự án.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'assistant',
      title: 'Conversational Co-Pilot Drawer',
      description: 'Interact with your audio archives instantly. Convert discussion waveforms into Vietnamese email updates or custom reports automatically.',
      color: 'from-emerald-50 to-teal-50 border-emerald-100',
      badge: 'Ask Co-Pilot • Car Session',
      render: () => (
        <div className="w-full h-full bg-white rounded-xl p-4 shadow-inner flex flex-col justify-between text-left select-none">
          {/* Chat header */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              E
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-800 block">Ask MeetEcho AI</span>
              <span className="text-[9px] text-gray-400 font-mono">Status: Online</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* AI Message Thread */}
          <div className="space-y-2 flex-1 pt-2 overflow-hidden text-xs">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-2 mr-6 text-[10.5px]">
              Tóm tắt buổi họp này bằng tiếng Việt giùm mình nhé!
            </div>
            <div className="bg-blue-50/70 text-blue-900 rounded-lg p-2.5 ml-4 border border-blue-100 leading-normal space-y-1 text-[10.5px]">
              <div className="font-bold text-blue-900 flex items-center gap-1 text-[10px]">
                <Sparkles className="w-2.5 h-2.5 text-blue-600" /> Trả lời từ Gemini:
              </div>
              <p className="text-gray-700 leading-tight">
                Bộ phận thiết kế sẽ cập nhật lại màu sắc giao diện vào ngày mai và bộ phận kỹ thuật (Nam) tiến hành tích hợp API.
              </p>
            </div>
          </div>

          {/* Prompt quick action chips */}
          <div className="flex gap-1.5 pt-2 border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-none">
            {['Summarize (VN)', 'Follow-ups', 'Decisions'].map((chip) => (
              <span key={chip} className="text-[9px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full bg-white cursor-pointer hover:border-blue-500 transition duration-150">
                {chip}
              </span>
            ))}
          </div>
        </div>
      )
    }
  ];

  // Map absolute indexes to correct displaying stack order
  const getCardIndex = (stackPos: number) => {
    return (activeIndex + stackPos) % 3;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-r from-gray-900 via-[#1e293b] to-[#0f172a] text-white rounded-xl shadow-xl border border-gray-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
    >
      {/* Decorative background vectors representing sounds/waveform glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

      {/* Dismiss button */}
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-150 bg-gray-800/50 hover:bg-gray-700/80 p-1.5 rounded-full"
          title="Dismiss Tour"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Left side: content presentation */}
      <div className="flex-1 space-y-4 md:max-w-xl text-left">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300 font-mono">MeetEcho AI Showcase Tour</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Animate, Transcribe &amp; Curate in 1-Click
          </h2>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-sans">
            Here is a simulation of our three core modules running concurrently in your workspace. Hover to spread them out, and click to unroll them sequentialy!
          </p>
        </div>

        {/* Feature bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {cards.map((c, i) => (
            <div 
              key={c.id}
              onClick={() => setActiveIndex(i)}
              className={`p-3 rounded-lg border cursor-pointer transition duration-300 text-left ${
                (activeIndex === i)
                  ? 'bg-white/10 border-blue-500/70 shadow-md translate-x-1' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span className="text-[11px] font-bold text-gray-200 tracking-tight block">{c.title}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-snug mt-1 truncate">
                {c.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main call to actions */}
        <div className="flex items-center gap-4 pt-3">
          <button 
            onClick={handleNext}
            className="group bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 transition duration-200"
          >
            <span>Curl Up Stack Next</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex gap-1">
            {cards.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'bg-blue-400 w-4' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side: 3D curling overlapping card deck */}
      <div 
        className="w-full max-w-[340px] h-[300px] relative flex items-center justify-center mt-4 md:mt-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: '1200px' }}
      >
        <AnimatePresence mode="popLayout">
          {/* Deck rendering */}
          {[2, 1, 0].map((stackPosition) => {
            const index = getCardIndex(stackPosition);
            const cardObj = cards[index];

            // Define custom interactive transformations based on stack index position
            // Stack position 0 is details of currently active card on top
            // Stack position 1 is middle card peeking below
            // Stack position 2 is bottom card peeking deeper
            
            let rotation = 0;
            let translateY = 0;
            let translateZ = 0;
            let scale = 1;

            if (stackPosition === 0) {
              rotation = isHovered ? -3 : -1;
              translateY = isHovered ? -16 : 0;
              translateZ = 0;
              scale = 1;
            } else if (stackPosition === 1) {
              rotation = isHovered ? 4 : 2;
              translateY = isHovered ? 4 : 12;
              translateZ = -50;
              scale = 0.95;
            } else {
              rotation = isHovered ? -7 : -3;
              translateY = isHovered ? 24 : 24;
              translateZ = -100;
              scale = 0.90;
            }

            return (
              <motion.div
                key={cardObj.id}
                style={{
                  zIndex: 30 - stackPosition,
                  transformOrigin: 'bottom center',
                }}
                animate={{
                  rotateZ: rotation,
                  y: translateY,
                  z: translateZ,
                  scale: scale,
                  opacity: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 25,
                }}
                exit={{
                  // The "Curl Up" Animation: curls slightly, pulls upward + rotates backwards before diving into the back!
                  y: -180,
                  rotateX: -65,
                  rotateZ: -20,
                  skewY: -6,
                  scale: 0.82,
                  opacity: 0.4,
                  transition: { duration: 0.4, ease: 'easeInOut' }
                }}
                onClick={stackPosition === 0 ? handleNext : () => setActiveIndex(index)}
                className="absolute w-full h-[250px] bg-gradient-to-b from-[#ffffff] to-[#fcfcfc] border border-gray-200 rounded-xl shadow-2xl overflow-hidden cursor-pointer flex flex-col justify-start"
              >
                {/* Shiny reflex gradient representing rolling/curled page shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />

                {/* SubHeader styling bar inside the mock stack */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 text-right shrink-0">
                    {cardObj.badge}
                  </span>
                </div>

                {/* Simulated App content mockup renderer */}
                <div className="flex-1 p-3 bg-white relative">
                  {cardObj.render()}
                </div>

                {/* Curling edge indicator line footer */}
                <div className="h-1 w-full bg-gradient-to-r from-gray-200 via-transparent to-gray-200" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
