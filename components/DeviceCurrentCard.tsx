// components/DeviceCurrentCard.tsx
"use client";
import React from "react";
import { useDeviceInfoSafe } from "@/hooks/useDeviceInfo";

export default function DeviceCurrentCard() {
  const { info } = useDeviceInfoSafe();

  if (!info) {
    return (
      <div className="border border-border rounded-xl p-4 animate-pulse">
        <div className="h-5 w-40 bg-muted rounded mb-2" />
        <div className="h-4 w-56 bg-muted rounded mb-1" />
        <div className="h-3 w-64 bg-muted rounded mb-1" />
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
          💻
        </div>
        <div>
          <div className="font-medium">{info.os}</div>
          <div className="text-sm text-muted-foreground">{info.browser}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Last active: {info.lastActiveLocal}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Privacy: no IP/location is fetched or sent.
          </div>
        </div>
      </div>

      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md">
        This device
      </span>
    </div>
  );
}
