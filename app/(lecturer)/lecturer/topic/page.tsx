"use client";

import React, { useState } from "react";
import { Folder, FolderOpen, Layers, BookOpen, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useDomains } from "@/hooks/useDomain";
import { useMasterTopics } from "@/hooks/useMasterTopic";
import { useTopics } from "@/hooks/useTopic";
import { Domain } from "@/lib/api/services/fetchDomain";
import { MasterTopic } from "@/lib/api/services/fetchMasterTopic";
import { Topic } from "@/lib/api/services/fetchTopic";

/**
 * 🌳 DashboardTree Component
 * Hiển thị cấu trúc cây 3 tầng:
 *  DOMAIN → MASTER TOPIC → TOPIC
 * Có hiệu ứng mở/đóng (expand/collapse) và hiển thị trạng thái Active/Inactive.
 */
export default function DashboardTree() {
  // Fetch dữ liệu
  const { domains } = useDomains();
  const { masterTopics } = useMasterTopics();
  const { topics } = useTopics();

  // State lưu domain và master topic đang mở
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  const [openMaster, setOpenMaster] = useState<string | null>(null);

  /** 🟠 Helper: Render Badge trạng thái */
  const renderStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-orange-200/60 text-orange-800 border border-orange-500 rounded-md px-2 py-0.5 text-xs">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-600 border border-gray-300 rounded-md px-2 py-0.5 text-xs">
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };
  if (!domains?.length || !masterTopics?.length || !topics?.length) {
    return <div className="p-6 text-orange-600 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="w-full space-y-4 p-6 bg-gradient-to-b from-white via-orange-50/50 to-white rounded-2xl border border-orange-100 shadow-[0_4px_20px_rgba(255,137,56,0.08)]">
      <Card className="border border-orange-200/70 shadow-md rounded-xl backdrop-blur-sm bg-white/80">
        {/* 🏷️ Header */}
        <CardHeader className="bg-gradient-to-r from-orange-100/70 via-orange-50 to-white border-b border-orange-200/70 rounded-t-xl">
          <CardTitle className="text-orange-700 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-orange-600" />
            Domain Explorer
          </CardTitle>
        </CardHeader>

        {/* 📋 Nội dung chính */}
        <CardContent className="pt-4 space-y-3">
          {domains?.map((domain: Domain) => {
            const isDomainOpen = openDomain === domain.id;
            const relatedMasterTopics = masterTopics?.filter((mt) => mt.domain?.id === domain.id);

            return (
              <div key={domain.id} className="space-y-2">
                {/* ========================= 🌐 DOMAIN ITEM ========================= */}
                <div
                  onClick={() => setOpenDomain(isDomainOpen ? null : domain.id)}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition border ${
                    isDomainOpen
                      ? "bg-gradient-to-r from-orange-50 to-orange-100/60 border-orange-400"
                      : "hover:bg-orange-50 border-transparent"
                  }`}
                >
                  {/* Icon mũi tên xoay khi mở */}
                  <motion.div animate={{ rotate: isDomainOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight className="h-4 w-4 text-orange-500" />
                  </motion.div>

                  {/* Icon thư mục mở/đóng */}
                  {isDomainOpen ? (
                    <FolderOpen className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Folder className="h-5 w-5 text-orange-500" />
                  )}

                  {/* Tên Domain + mô tả */}
                  <span className="font-semibold text-orange-800">{domain.name}</span>
                  <span className="text-sm text-gray-500 ml-1">{domain.description}</span>

                  {/* Số lượng Master Topics */}
                  <Badge variant="outline" className="ml-auto bg-white border-orange-200 text-orange-600">
                    {relatedMasterTopics?.length ?? 0} Master Topics
                  </Badge>

                  {/* Trạng thái Domain */}
                  <div>{renderStatus(domain.status)}</div>
                </div>

                {/* ========================= 📚 MASTER TOPICS ========================= */}
                <AnimatePresence>
                  {isDomainOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-7 pl-3 border-l-2 border-orange-200/70 space-y-2"
                    >
                      {relatedMasterTopics?.map((mt: MasterTopic) => {
                        const isMasterOpen = openMaster === mt.id;
                        const relatedTopics = topics?.filter((t) => t.masterTopic?.id === mt.id);

                        return (
                          <div key={mt.id} className="space-y-2">
                            {/* ---------- MASTER TOPIC ITEM ---------- */}
                            <div
                              onClick={() => setOpenMaster(isMasterOpen ? null : mt.id)}
                              className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-md border transition ${
                                isMasterOpen
                                  ? "bg-orange-50 border-orange-200"
                                  : "hover:bg-orange-50/60 border-transparent"
                              }`}
                            >
                              <motion.div animate={{ rotate: isMasterOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronRight className="h-3.5 w-3.5 text-orange-500" />
                              </motion.div>

                              {isMasterOpen ? (
                                <BookOpen className="h-4 w-4 text-orange-500" />
                              ) : (
                                <Layers className="h-4 w-4 text-orange-500" />
                              )}

                              <span className="text-orange-700 font-medium">{mt.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{mt.semester?.code || "-"}</span>

                              {/* Hiển thị số lượng Topics */}
                              <Badge variant="outline" className="ml-auto bg-white border-orange-200 text-orange-600">
                                {relatedTopics?.length ?? 0} Topics
                              </Badge>

                              {/* Trạng thái */}
                              <div>{renderStatus(mt.status)}</div>
                            </div>

                            {/* ========================= 📘 TOPICS ========================= */}
                            <AnimatePresence>
                              {isMasterOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="ml-8 pl-4 border-l border-orange-100/70 space-y-1"
                                >
                                  {relatedTopics?.map((t: Topic) => (
                                    <div
                                      key={t.id}
                                      className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-50 transition"
                                    >
                                      <FolderOpen className="h-4 w-4 text-orange-400" />
                                      <span className="text-sm font-medium text-orange-800">{t.name}</span>
                                      <span className="text-xs text-gray-500 ml-2">{t.description}</span>
                                      <div className="ml-auto">{renderStatus(t.status)}</div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
