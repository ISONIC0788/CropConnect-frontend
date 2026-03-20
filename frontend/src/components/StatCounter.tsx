import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion, useTransform } from "framer-motion";

interface StatCounterProps {
  value: number;
  direction?: "up" | "down";
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function StatCounter({ value, direction = "up", suffix = "", prefix = "", decimals = 0 }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  const displayValue = useTransform(springValue, (latest) => 
    latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}