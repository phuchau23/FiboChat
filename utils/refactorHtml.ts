// import { useEffect, useState } from "react";
// import style from "styled-jsx/style";

// export function stripCodeFenceToHtml(text: string): string | undefined {
//   const m =
//     text.match(/```(?:html|HTML)?\s*([\s\S]*?)```/i) ||
//     text.match(/```([\s\S]*?)```/);
//   if (!m) return undefined;
//   const inner = m[1]?.trim();
//   if (!inner) return undefined;
//   return inner;
// }

// export function isLikelyHTML(text: string): boolean {
//   return /<\/?[a-z][\s\S]*>/i.test(text);
// }

// export function sanitizeHtml(html: string): string {
//   // Simple sanitization - in production use DOMPurify
//   return html;
// }



// export function TypewriterText({
//   text,
//   className,
// }: {
//   text: string;
//   className?: string;
// }) {
//   const [shown, setShown] = useState("");
//   useEffect(() => {
//     let i = 0,
//       stop = false;
//     const step = () => {
//       if (stop) return;
//       setShown(text.slice(0, i + 1));
//       i++;
//       if (i >= text.length) return;
//       const ch = text[i - 1];
//       const base = 14 + Math.random() * 14;
//       const extra = /[.,!?;:…]/.test(ch)
//         ? 140 + Math.random() * 120
//         : ch === " "
//         ? 20
//         : 0;
//       setTimeout(step, base + extra);
//     };
//     setShown("");
//     if (text) setTimeout(step, 60);
//     return () => {
//       stop = true;
//     };
//   }, [text]);

//   return (
//     <span className={className} style={{ whiteSpace: "pre-wrap" }}>
//       {shown}
//       <span
//         className="inline-block w-3"
//         style={{
//           borderRight: "2px solid rgba(0,0,0,0.35)",
//           animation: "blink 1s step-end infinite",
//           height: "1em",
//           transform: "translateY(1px)",
//         }}
//       />
//       <style>{`@keyframes blink { 50% { border-color: transparent; } }`}</style>
//     </span>
//   );
// }