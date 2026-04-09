export default function SpiralBinding() {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-start justify-evenly px-5 lg:px-6 z-50 pointer-events-none">
      {Array.from({ length: 38 }).map((_, i) => (
        <div 
          key={i} 
          className="relative w-[10px] h-3 rounded-md mt-2 shadow-[inset_0_3px_5px_rgba(0,0,0,1),_0_1px_0_rgba(255,255,255,0.4)]"
          style={{ background: '#0a0f18' }}
        >
          <div 
            className="absolute -top-[10px] left-[1px] w-[3.5px] h-[20px] rounded-[2px]"
            style={{
              background: 'linear-gradient(90deg, #64748b 0%, #f8fafc 40%, #94a3b8 70%, #334155 100%)',
              boxShadow: '-1px 2px 3px rgba(0,0,0,0.4), inset 0px 1px 1px rgba(255,255,255,0.9)',
              transform: 'skewX(-2deg)'
            }}
          />
          <div 
            className="absolute -top-[10px] right-[1px] w-[3.5px] h-[20px] rounded-[2px]"
            style={{
              background: 'linear-gradient(90deg, #475569 0%, #e2e8f0 30%, #64748b 70%, #1e293b 100%)',
              boxShadow: '-1px 2px 3px rgba(0,0,0,0.5), inset 0px 1px 1px rgba(255,255,255,0.8)',
              transform: 'skewX(2deg)'
            }}
          />
        </div>
      ))}
    </div>
  );
}
