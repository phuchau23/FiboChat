// app/lecturer/documents/page.tsx
"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle2, XCircle, MessageSquare, PlusCircle, Search } from "lucide-react";
import { useDocumentsAll, useDocumentsByLecturer, useUploadDocument } from "@/hooks/useDocuments";
import { useQAPairs, useCreateQAPair } from "@/hooks/useQAPairs";
import { useTopicsByLecturer } from "@/hooks/useTopic";

// === Mock current user ===
const useCurrentUser = () => {
  return {
    id: "019a1fc2-286f-708f-beea-0c81d2e5ee1e",
    fullName: "Kim Ngọc Minh Tâm",
  };
};

type TabType = "documents" | "qa";
type ViewMode = "my" | "all";

export default function LecturerDocumentAndQAPage() {
  const { id: lecturerId } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<TabType>("documents");
  const [viewMode, setViewMode] = useState<ViewMode>("my");
  const { topics: lecturerTopics, isLoading: loadingTopics } = useTopicsByLecturer(lecturerId);

  // === Document States ===
  const [docPage, setDocPage] = useState(1);
  const docPageSize = 10;

  // === Q&A States ===
  const [qaPage, setQAPage] = useState(1);
  const qaPageSize = 10;
  const [qaTopicId, setQATopicId] = useState("019a16de-fb8d-7cb8-95fa-ee4084d244a9");
  const [qaDocumentId, setQADocumentId] = useState("");
  const [qaKeyword, setQAKeyword] = useState("");

  // === Upload States ===
  const [uploadTopicId, setUploadTopicId] = useState("019a16de-fb8d-7cb8-95fa-ee4084d244a9");
  const [uploadDocTypeId, setUploadDocTypeId] = useState("019a1fc6-5495-7142-8d5a-dd83072dd392");
  const [uploadTitle, setUploadTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === API Hooks ===
  const { data: allDocs, isLoading: loadingAllDocs } = useDocumentsAll(docPage, docPageSize);
  const { data: myDocs, isLoading: loadingMyDocs } = useDocumentsByLecturer(lecturerId, docPage, docPageSize);
  const uploadMutation = useUploadDocument();

  const { data: qaData, isLoading: loadingQA } = useQAPairs({
    topicId: viewMode === "my" ? undefined : qaTopicId,
    documentId: qaDocumentId || undefined,
    status: "Active",
    keyword: qaKeyword || undefined,
    page: qaPage,
    pageSize: qaPageSize,
  });

  const createQAMutation = useCreateQAPair();

  // === Derived Data ===
  const documents = viewMode === "my" ? myDocs?.documents || [] : allDocs?.documents || [];
  const docPagination = viewMode === "my" ? myDocs?.pagination : allDocs?.pagination;
  const isLoadingDocs = viewMode === "my" ? loadingMyDocs : loadingAllDocs;

  const qaPairs = qaData?.qaPairs || [];
  const qaPagination = qaData?.pagination;

  // === Upload Handler ===
  const handleFileSelect = (file: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("TopicId", uploadTopicId);
    formData.append("DocumentTypeId", uploadDocTypeId);
    formData.append("Title", uploadTitle || file.name.replace(/\.[^/.]+$/, ""));
    formData.append("File", file);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setUploadTitle("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && isValidFileType(file)) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFileType(file)) handleFileSelect(file);
  };

  const isValidFileType = (file: File): boolean => {
    const valid = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return valid.includes(file.type);
  };

  // === Create Q&A Handler ===
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleCreateQA = () => {
    if (!newQuestion.trim() || !newAnswer.trim() || !qaDocumentId) return;

    const formData = new FormData();
    formData.append("TopicId", qaTopicId);
    formData.append("DocumentId", qaDocumentId);
    formData.append("QuestionText", newQuestion.trim());
    formData.append("AnswerText", newAnswer.trim());

    createQAMutation.mutate(formData, {
      onSuccess: () => {
        setNewQuestion("");
        setNewAnswer("");
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-orange-200 mb-6">
        {(
          [
            { key: "documents" as const, label: "Documents", icon: FileText },
            { key: "qa" as const, label: "Q&A", icon: MessageSquare },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.key
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Mode */}
      <div className="flex justify-end mb-4">
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
          className="border border-orange-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="my">My {activeTab === "documents" ? "Documents" : "Q&A"}</option>
          <option value="all">All {activeTab === "documents" ? "Documents" : "Q&A"}</option>
        </select>
      </div>

      {/* === DOCUMENT TAB === */}
      {activeTab === "documents" && (
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold text-orange-600 mb-4">Upload New Document</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Title (optional)"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-2"
              />
              <select
                value={uploadTopicId}
                onChange={(e) => setUploadTopicId(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-2"
              >
                {loadingTopics ? (
                  <option>Loading topics...</option>
                ) : lecturerTopics && lecturerTopics.length > 0 ? (
                  lecturerTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))
                ) : (
                  <option value="">No topics available</option>
                )}
              </select>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-orange-500 transition cursor-pointer bg-orange-50/30"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-3" />
                  <p className="text-orange-600 font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-orange-400 mb-3" />
                  <p className="text-gray-700 font-medium">Click or drag file to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {uploadMutation.isSuccess && (
              <p className="mt-3 text-green-600 flex items-center gap-1 text-sm">
                <CheckCircle2 className="h-4 w-4" /> Upload successful!
              </p>
            )}
            {uploadMutation.isError && (
              <p className="mt-3 text-red-600 flex items-center gap-1 text-sm">
                <XCircle className="h-4 w-4" /> Upload failed.
              </p>
            )}
          </div>

          {/* Document Table */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-orange-100 text-orange-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Topic</th>
                  <th className="px-4 py-3 text-left">Uploader</th>
                  <th className="px-4 py-3 text-left">File</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingDocs ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin text-orange-500" />
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  documents.map((doc, idx) => (
                    <tr key={doc.id} className="odd:bg-white even:bg-orange-50 hover:bg-orange-100 transition">
                      <td className="px-4 py-3">{(docPage - 1) * docPageSize + idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{doc.title}</td>
                      <td className="px-4 py-3">{doc.topic.name}</td>
                      <td className="px-4 py-3">{doc.updatedById === lecturerId ? "You" : "Other"}</td>
                      <td className="px-4 py-3">
                        <a
                          href={doc.file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" /> {doc.file.fileName}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === "Draft" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {docPagination && docPagination.totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {(docPage - 1) * docPageSize + 1} to{" "}
                  {Math.min(docPage * docPageSize, docPagination.totalItems)} of {docPagination.totalItems}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDocPage((p) => Math.max(1, p - 1))}
                    disabled={!docPagination.hasPreviousPage}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-orange-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setDocPage((p) => p + 1)}
                    disabled={!docPagination.hasNextPage}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-orange-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === Q&A TAB === */}
      {activeTab === "qa" && (
        <div className="space-y-8">
          {/* Add New Q&A */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5" /> Add New Q&A
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <textarea
                placeholder="Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-2 min-h-20 resize-y focus:ring-2 focus:ring-orange-400"
              />
              <textarea
                placeholder="Answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-2 min-h-20 resize-y focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={qaTopicId}
                onChange={(e) => setQATopicId(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-2 text-sm"
              >
                {loadingTopics ? (
                  <option>Loading topics...</option>
                ) : lecturerTopics && lecturerTopics.length > 0 ? (
                  lecturerTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))
                ) : (
                  <option value="">No topics available</option>
                )}
              </select>

              <select
                value={qaDocumentId}
                onChange={(e) => setQADocumentId(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Document</option>
                {documents
                  .filter((d) => d.updatedById === lecturerId)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
              </select>

              <button
                onClick={handleCreateQA}
                disabled={createQAMutation.isPending || !qaDocumentId || !newQuestion.trim() || !newAnswer.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {createQAMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                Add Q&A
              </button>
            </div>

            {createQAMutation.isSuccess && (
              <p className="mt-3 text-green-600 text-sm flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Q&A created successfully!
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search question..."
                  value={qaKeyword}
                  onChange={(e) => setQAKeyword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          {/* Q&A Table */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-orange-100 text-orange-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Question</th>
                  <th className="px-4 py-3 text-left">Answer</th>
                  <th className="px-4 py-3 text-left">Document</th>
                  <th className="px-4 py-3 text-left">Uploader</th>
                </tr>
              </thead>
              <tbody>
                {loadingQA ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin text-orange-500" />
                    </td>
                  </tr>
                ) : qaPairs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 italic">
                      No Q&A found
                    </td>
                  </tr>
                ) : (
                  qaPairs.map((qa, idx) => (
                    <tr key={qa.id} className="odd:bg-white even:bg-orange-50 hover:bg-orange-100 transition">
                      <td className="px-4 py-3">{(qaPage - 1) * qaPageSize + idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{qa.questionText}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{qa.answerText}</td>
                      <td className="px-4 py-3">{documents.find((d) => d.id === qa.documentId)?.title || "—"}</td>
                      <td className="px-4 py-3">{qa.createdById === lecturerId ? "You" : "Other"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {qaPagination && qaPagination.totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {(qaPage - 1) * qaPageSize + 1} to {Math.min(qaPage * qaPageSize, qaPagination.totalItems)} of{" "}
                  {qaPagination.totalItems}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQAPage((p) => Math.max(1, p - 1))}
                    disabled={!qaPagination.hasPreviousPage}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-orange-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setQAPage((p) => p + 1)}
                    disabled={!qaPagination.hasNextPage}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-orange-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
