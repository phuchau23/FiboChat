"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

function CharactersRemaining() {
  const [value, setValue] = useState("");
  const maxLength = 12;
  const remaining = Math.max(0, maxLength - value.length);
  const [scope, animate] = useAnimate();

  // Màu HSL chuyển mượt: còn nhiều -> xanh, sắp hết -> đỏ
  const colorByRemaining = (r: number) => {
    const ratio = Math.max(0, Math.min(1, r / maxLength)); // 0..1
    const hue = Math.round(120 * ratio); // 120 (xanh) -> 0 (đỏ)
    return `hsl(${hue} 90% 60%)`;
  };

  useEffect(() => {
    if (remaining > 6) return;

    // “Bật” 2 bước (2 keyframes hợp lệ với spring): 1 -> 1.12 -> 1
    const velocity = Math.min(2000, Math.max(0, (6 - remaining) * 400));

    (async () => {
      await animate(
        scope.current,
        { scale: 1.12 },
        { type: "spring", stiffness: 900, damping: 20, velocity }
      );
      await animate(
        scope.current,
        { scale: 1 },
        { type: "spring", stiffness: 700, damping: 30 }
      );
    })();
  }, [animate, remaining, scope]);

  return (
    <div className="container">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
      />
      <div>
        <motion.span
          ref={scope}
          style={{
            color: colorByRemaining(remaining),
            willChange: "transform",
          }}
          initial={{ scale: 1 }}
        >
          {remaining}
        </motion.span>
      </div>
      <Stylesheet />
    </div>
  );
}

function Stylesheet() {
  return (
    <style>{`
      .container, input {
        position: relative;
        font-size: 32px;
        line-height: 1;
      }
      input {
        background-color: #0b1011;
        color: #f5f5f5;
        border: 2px solid #1d2628;
        border-radius: 10px;
        padding: 20px;
        padding-right: 70px;
        width: 300px;
      }
      input:focus { border-color: var(--hue-blue); }
      .container div {
        color: #ccc;
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, #0b1011 20%);
        position: absolute;
        top: 50%;
        right: 2px;
        transform: translateY(-50%);
        padding: 10px 20px 10px 50px;
      }
      .container div span { display: block; }
    `}</style>
  );
}

export default CharactersRemaining;
