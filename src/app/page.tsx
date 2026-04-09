'use client';
import Calendar from '@/components/Calendar';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Home() {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [0, 1], ["2.5deg", "-2.5deg"]);
  const rotateY = useTransform(mouseXSpring, [0, 1], ["-2.5deg", "2.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <main className="flex min-h-screen items-start justify-center p-4 pt-2 md:p-8 md:pt-4 lg:p-12 lg:pt-6" style={{ perspective: 2000 }}>
      <motion.div 
        className="w-full max-w-7xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d",
          willChange: "transform" 
        }}
      >
        <Calendar />
      </motion.div>
    </main>
  );
}
