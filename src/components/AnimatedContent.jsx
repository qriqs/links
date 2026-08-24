import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const AnimatedContent = ({
  children,
  distance = 30,
  direction = "vertical",
  reverse = false,
  duration = 0.6,
  ease = "power2.out",
  initialOpacity = 0,
  scale = 1,
  delay = 0,
  className = "",
  ...props
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;

    gsap.fromTo(
      el,
      {
        [axis]: offset,
        scale,
        opacity: initialOpacity,
      },
      {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        delay,
        ease,
        clearProps: "transform,opacity",
      }
    );
  }, [distance, direction, reverse, duration, ease, initialOpacity, scale, delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;
