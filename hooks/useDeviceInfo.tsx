"use client";
import { useEffect, useState } from "react";

export interface DeviceInfo {
  os: string;
  browser: string;
  lastActiveLocal: string;
}

/** Mở rộng type Navigator an toàn, không lỗi TS */
interface NavigatorWithPlatform
  extends Omit<Navigator, "platform">,
    Partial<Pick<Navigator, "platform">> {}

function detectOS(userAgent: string, platform: string | undefined): string {
  if (/Windows NT/i.test(userAgent) || /Win/i.test(platform ?? ""))
    return "Windows";
  if (/Mac OS X|Macintosh/i.test(userAgent) || /Mac/i.test(platform ?? ""))
    return "macOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Linux/i.test(platform ?? "") || /Linux/i.test(userAgent)) return "Linux";
  return "Unknown OS";
}

function detectBrowser(userAgent: string): string {
  const patterns: Array<[RegExp, string]> = [
    [/(Edg|Edge)\/([\d.]+)/i, "Edge"],
    [/(OPR)\/([\d.]+)/i, "Opera"],
    [/(Chrome)\/([\d.]+)/i, "Chrome"],
    [/(Firefox)\/([\d.]+)/i, "Firefox"],
    [/(Safari)\/([\d.]+)/i, "Safari"],
  ];

  for (const [regex, label] of patterns) {
    const match = userAgent.match(regex);
    if (match) {
      const version = match[2] ?? "";
      const name = /OPR/i.test(match[1]) ? "Opera" : label;
      return `${name} ${version}`.trim();
    }
  }

  return "Unknown Browser";
}

/**
 * Safe, client-only hook.
 * - Không dùng `any`
 * - Không gọi API ngoài, không gửi IP
 * - Chạy được trong môi trường strict TypeScript
 */
export function useDeviceInfoSafe() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined") return; // tránh SSR

    const nav = navigator as NavigatorWithPlatform;
    const ua = nav.userAgent || "";
    const platform = nav.platform;

    const os = detectOS(ua, platform);
    const browser = detectBrowser(ua);

    setInfo({
      os,
      browser,
      lastActiveLocal: new Date().toLocaleString(),
    });
  }, []);

  return { info };
}
