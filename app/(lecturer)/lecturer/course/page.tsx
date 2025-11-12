// app/lecturer/documents/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload, FileText, Loader2, CheckCircle2, XCircle, MessageSquare, PlusCircle, Search } from "lucide-react";
import {
  useDeleteDocument,
  useDocumentsAll,
  useDocumentsByLecturer,
  usePublishDocument,
  useUnpublishDocument,
  useUpdateDocument,
  useUploadDocument,
} from "@/hooks/useDocuments";
import {
  useQAPairs,
  useCreateQAPair,
  useQAPairsByLecturer,
  useUpdateQAPair,
  useDeleteQAPair,
} from "@/hooks/useQAPairs";
import { useTopicsByLecturer } from "@/hooks/useTopic";
import { getCookie } from "cookies-next";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import { toast } from "@/hooks/use-toast";
import { useCreateDocumentType } from "@/hooks/useDocumentTypes";
import { Plus } from "lucide-react";
type TabType = "documents" | "qa";
type ViewMode = "my" | "all";
export interface DocumentItem {
  id: string;
  title: string;
  topic: {
    id: string;
    name: string;
  };
  documentType: {
    id: string;
    name: string;
  };
  fileUrl?: string;
}

export default function LecturerDocumentAndQAPage() {
  const [lecturerId, setLecturerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = getCookie("user-id") as string | undefined;
    if (id) setLecturerId(id);
  }, []);

  const [activeTab, setActiveTab] = useState<TabType>("documents");
  const [viewMode, setViewMode] = useState<ViewMode>("my");

  // === fetch dữ liệu động ===
  const { topics: lecturerTopics, isLoading: loadingTopics } = useTopicsByLecturer(lecturerId);
  const { data: documentTypeData, isLoading: loadingDocTypes } = useDocumentTypes(1, 50);
  const publishDocument = usePublishDocument();
  const unpublishDocument = useUnpublishDocument();
  // === Document States ===
  const [docPage, setDocPage] = useState(1);
  const docPageSize = 10;

  // === Q&A States ===
  const [qaPage, setQAPage] = useState(1);
  const qaPageSize = 10;
  const [qaTopicId, setQATopicId] = useState<string>("");
  const [qaDocumentId, setQADocumentId] = useState("");
  const [qaKeyword, setQAKeyword] = useState("");
  // === Upload States ===
  const [uploadTopicId, setUploadTopicId] = useState<string>("");
  const [uploadDocTypeId, setUploadDocTypeId] = useState<string>("");
  const [uploadTitle, setUploadTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = useState("");
  const [editingDocTypeId, setEditingDocTypeId] = useState("");
  const [editingFile, setEditingFile] = useState<File | null>(null);

  const [editingTitle, setEditingTitle] = useState("");
  // === API Hooks ===
  const { data: allDocs, isLoading: loadingAllDocs } = useDocumentsAll(docPage, docPageSize);
  const { data: myDocs, isLoading: loadingMyDocs } = useDocumentsByLecturer(lecturerId || "", docPage, docPageSize);
  const uploadMutation = useUploadDocument();
  const [editingQAId, setEditingQAId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState("");
  const [editingAnswer, setEditingAnswer] = useState("");
  const updateQAMutation = useUpdateQAPair();
  const deleteQAMutation = useDeleteQAPair();
  // Modal tạo DocumentType
  const [isDocTypeModalOpen, setIsDocTypeModalOpen] = useState(false);
  const [newDocTypeName, setNewDocTypeName] = useState("");
  const createDocTypeMutation = useCreateDocumentType();

  const handleCreateDocType = () => {
    if (!newDocTypeName.trim()) return;
    createDocTypeMutation.mutate(newDocTypeName.trim(), {
      onSuccess: () => {
        toast({ title: "Created!", description: "Document type added successfully." });
        setIsDocTypeModalOpen(false);
        setNewDocTypeName("");
      },
      onError: () => {
        toast({ title: "Failed!", description: "Cannot create document type." });
      },
    });
  };

  const { data: qaAllData } = useQAPairs({
    topicId: qaTopicId || undefined,
    documentId: qaDocumentId || undefined,
    status: "Active",
    keyword: qaKeyword || undefined,
    page: qaPage,
    pageSize: qaPageSize,
  });

  const { data: qaMyData } = useQAPairsByLecturer(lecturerId || "", {
    page: qaPage,
    pageSize: qaPageSize,
    topicId: qaTopicId || undefined,
  });

  // === Derived Data for Q&A ===
  const qaData = viewMode === "my" ? qaMyData : qaAllData;
  const qaPairs = qaData?.qaPairs || [];
  const qaPagination = qaData?.pagination;
  const [qaList, setQAList] = useState(qaPairs || []);

  const createQAMutation = useCreateQAPair();

  // === Derived Data ===
  const docPagination = viewMode === "my" ? myDocs?.pagination : allDocs?.pagination;
  const isLoadingDocs = viewMode === "my" ? loadingMyDocs : loadingAllDocs;

  // === set default values khi data về ===
  useEffect(() => {
    if (!uploadTopicId && lecturerTopics.length > 0) {
      setUploadTopicId(lecturerTopics[0].id);
    }
  }, [lecturerTopics, uploadTopicId]);

  useEffect(() => {
    if (!uploadDocTypeId && documentTypeData?.items?.length) {
      setUploadDocTypeId(documentTypeData.items[0].id);
    }
  }, [documentTypeData, uploadDocTypeId]);

  useEffect(() => {
    if (activeTab === "qa") {
      setQATopicId("");
    }
  }, [activeTab]);
  useEffect(() => {
    const filtered = (qaData?.qaPairs || []).filter((qa) => qa.status !== "Inactive");
    const start = (qaPage - 1) * qaPageSize;
    const end = qaPage * qaPageSize;
    setQAList(filtered.slice(start, end));
  }, [qaData, qaPage]);
  useEffect(() => {
    setQAPage(1);
  }, [qaTopicId, qaDocumentId, qaKeyword]);

  useEffect(() => {
    setDocPage(1);
  }, [viewMode]);

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
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const formData = new FormData();
    if (qaTopicId) formData.append("TopicId", qaTopicId);
    if (qaDocumentId) formData.append("DocumentId", qaDocumentId);
    formData.append("QuestionText", newQuestion.trim());
    formData.append("AnswerText", newAnswer.trim());

    createQAMutation.mutate(formData, {
      onSuccess: () => {
        setNewQuestion("");
        setNewAnswer("");
      },
    });
  };
  const allDocuments = (viewMode === "my" ? myDocs?.documents || [] : allDocs?.documents || []).filter(
    (doc) => doc.status !== "Inactive"
  );

  const documents = allDocuments.slice((docPage - 1) * docPageSize, docPage * docPageSize);

  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();

  const handleDeleteDocument = (docId: string) => {
    toast({
      title: "Confirm delete",
      description: "Are you sure you want to delete this document?",
      action: (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              deleteDocument.mutate(docId, {
                onSuccess: () => {
                  toast({ title: "Deleted successfully", description: "Document removed." });
                },
                onError: () => {
                  toast({ title: "Delete failed", description: "Cannot delete document." });
                },
              });
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Confirm
          </button>
          <button onClick={() => {}} className="bg-gray-300 text-black px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      ),
    });
  };
  const startEditDocument = (doc: DocumentItem) => {
    setEditingDocId(doc.id);
    setEditingTitle(doc.title);
    setEditingTopicId(doc.topic.id);
    setEditingDocTypeId(doc.documentType.id);
    setEditingFile(null);
  };
  useEffect(() => {
    setDocPage(1);
  }, [viewMode]);
  const cancelEditDocument = () => {
    setEditingDocId(null);
    setEditingTitle("");
  };
  const submitEditDocument = (id: string) => {
    updateDocument.mutate(
      {
        id,
        data: {
          Title: editingTitle,
          TopicId: editingTopicId,
          DocumentTypeId: editingDocTypeId,
          File: editingFile || undefined,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Cập nhật thành công", description: "Document đã được cập nhật." });
          setEditingDocId(null); // đóng form edit
          // Nếu muốn cập nhật UI ngay:
          if (viewMode === "my" && myDocs?.documents) {
          }
        },
        onError: () => {
          toast({ title: "Cập nhật thất bại", description: "Không thể cập nhật Document." });
        },
      }
    );
  };

  const startEditQA = (qa: { id: string; questionText: string; answerText: string }) => {
    setEditingQAId(qa.id);
    setEditingQuestion(qa.questionText);
    setEditingAnswer(qa.answerText);
  };

  const cancelEditQA = () => {
    setEditingQAId(null);
    setEditingQuestion("");
    setEditingAnswer("");
  };

  const submitEditQA = (id: string) => {
    if (!editingQuestion.trim() || !editingAnswer.trim()) return;

    const formData = new FormData();
    formData.append("QuestionText", editingQuestion.trim());
    formData.append("AnswerText", editingAnswer.trim());

    updateQAMutation.mutate(
      { id, formData },
      {
        onSuccess: () => {
          toast({ title: "Updated successfully", description: "Q&A updated" });
          cancelEditQA();
        },
        onError: () => {
          toast({ title: "Update failed", description: "Cannot update Q&A" });
        },
      }
    );
  };

  const handleDeleteQAWithConfirm = (qaId: string) => {
    toast({
      title: "Confirm delete",
      description: "Are you sure you want to delete this Q&A?",
      action: (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              deleteQAMutation.mutate(qaId, {
                onSuccess: () => {
                  toast({ title: "Deleted successfully", description: "Q&A removed." });
                  // Remove from UI
                  setQAList((prev) => prev.filter((qa) => qa.id !== qaId));
                },
                onError: () => {
                  toast({ title: "Delete failed", description: "Cannot delete Q&A." });
                },
              });
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Confirm
          </button>
          <button onClick={() => {}} className="bg-gray-300 text-black px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      ),
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

              {!lecturerId ? (
                <select className="border border-orange-300 rounded-lg px-3 py-2 text-gray-400" disabled>
                  <option>Loading...</option>
                </select>
              ) : (
                <select
                  value={uploadTopicId}
                  onChange={(e) => setUploadTopicId(e.target.value)}
                  className="border border-orange-300 rounded-lg px-3 py-2"
                >
                  {loadingTopics ? (
                    <option disabled>Loading topics...</option>
                  ) : lecturerTopics.length > 0 ? (
                    lecturerTopics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No topics available</option>
                  )}
                </select>
              )}

              <div className="flex gap-2">
                <select
                  value={uploadDocTypeId}
                  onChange={(e) => setUploadDocTypeId(e.target.value)}
                  className="border border-orange-300 rounded-lg px-3 py-2 flex-1"
                >
                  {loadingDocTypes ? (
                    <option>Loading types...</option>
                  ) : documentTypeData?.items?.length ? (
                    documentTypeData.items.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No types available</option>
                  )}
                </select>

                <button
                  onClick={() => setIsDocTypeModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                  title="Add new document type"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
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
                  <th className="px-4 py-3 text-left">Document Type</th>
                  <th className="px-4 py-3 text-left">Topic</th>
                  <th className="px-4 py-3 text-left">Uploader</th>
                  <th className="px-4 py-3 text-left">File</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
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
                      <td className="px-4 py-3 font-medium">
                        {editingDocId === doc.id ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="border border-orange-300 rounded px-2 py-1 text-sm"
                            />

                            <select
                              value={editingTopicId}
                              onChange={(e) => setEditingTopicId(e.target.value)}
                              className="border border-orange-300 rounded px-2 py-1 text-sm"
                            >
                              {lecturerTopics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                  {topic.name}
                                </option>
                              ))}
                            </select>

                            <select
                              value={editingDocTypeId}
                              onChange={(e) => setEditingDocTypeId(e.target.value)}
                              className="border border-orange-300 rounded px-2 py-1 text-sm"
                            >
                              {documentTypeData?.items?.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>

                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={(e) => setEditingFile(e.target.files?.[0] || null)}
                              className="text-sm"
                            />
                          </div>
                        ) : (
                          doc.title
                        )}
                      </td>
                      <td className="px-4 py-3">{doc.documentType?.name || "—"}</td>

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
                        <select
                          value={doc.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as "Draft" | "Published";
                            if (newStatus === "Published") {
                              publishDocument.mutate(doc.id, {
                                onSuccess: () => {
                                  toast({ title: "Published!", description: "Document is now visible to AI." });
                                },
                                onError: () => {
                                  toast({ title: "Failed!", description: "Cannot publish document." });
                                },
                              });
                            } else if (newStatus === "Draft") {
                              unpublishDocument.mutate(doc.id, {
                                onSuccess: () => {
                                  toast({ title: "Unpublished!", description: "Document is now draft." });
                                },
                                onError: () => {
                                  toast({ title: "Failed!", description: "Cannot unpublish document." });
                                },
                              });
                            }
                          }}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === "Draft" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        {editingDocId === doc.id ? (
                          <>
                            <button
                              onClick={() => submitEditDocument(doc.id)}
                              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition"
                            >
                              <CheckCircle2 className="h-4 w-4" /> Save
                            </button>
                            <button
                              onClick={cancelEditDocument}
                              className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditDocument(doc)}
                              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                            >
                              <FileText className="h-4 w-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                            >
                              <XCircle className="h-4 w-4" /> Delete
                            </button>
                          </>
                        )}
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
                    onClick={() => setDocPage((prev) => Math.max(1, prev - 1))}
                    disabled={!docPagination?.hasPreviousPage || docPage <= 1}
                  >
                    Previous
                  </button>
                  <button onClick={() => setDocPage((prev) => prev + 1)} disabled={!docPagination?.hasNextPage}>
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
                <option value="">All Topics</option> {/* để filter toàn bộ Q&A */}
                {loadingTopics ? (
                  <option>Loading topics...</option>
                ) : (
                  lecturerTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))
                )}
              </select>

              <select
                value={qaDocumentId}
                onChange={(e) => setQADocumentId(e.target.value)}
                className="border border-orange-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Document (optional)</option>
                {documents && documents.length > 0
                  ? documents.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))
                  : null}
              </select>

              <button
                onClick={handleCreateQA}
                disabled={createQAMutation.isPending || !newQuestion.trim() || !newAnswer.trim()}
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
                  <th className="px-4 py-3 text-left">Buton</th>
                </tr>
              </thead>
              <tbody>
                {qaList.map((qa, idx) => (
                  <tr key={qa.id} className="odd:bg-white even:bg-orange-50 hover:bg-orange-100 transition">
                    <td className="px-4 py-3">{(qaPage - 1) * qaPageSize + idx + 1}</td>

                    <td className="px-4 py-3 font-medium">
                      {editingQAId === qa.id ? (
                        <textarea
                          value={editingQuestion}
                          onChange={(e) => setEditingQuestion(e.target.value)}
                          className="border border-orange-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        qa.questionText
                      )}
                    </td>

                    <td className="px-4 py-3 max-w-xs truncate">
                      {editingQAId === qa.id ? (
                        <textarea
                          value={editingAnswer}
                          onChange={(e) => setEditingAnswer(e.target.value)}
                          className="border border-orange-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        qa.answerText
                      )}
                    </td>

                    <td className="px-4 py-3">{documents.find((d) => d.id === qa.documentId)?.title || "—"}</td>
                    <td className="px-4 py-3">{qa.createdById === lecturerId ? "You" : "Other"}</td>

                    <td className="px-4 py-3 flex gap-2">
                      {editingQAId === qa.id ? (
                        <>
                          <button
                            onClick={() => submitEditQA(qa.id)}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Save
                          </button>
                          <button
                            onClick={cancelEditQA}
                            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditQA(qa)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            <MessageSquare className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQAWithConfirm(qa.id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            <XCircle className="h-4 w-4" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
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
      {isDocTypeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-orange-600 mb-4">Add New Document Type</h3>

            <input
              type="text"
              placeholder="Document type name"
              value={newDocTypeName}
              onChange={(e) => setNewDocTypeName(e.target.value)}
              className="border border-orange-300 rounded-lg px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-orange-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDocTypeModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateDocType}
                disabled={createDocTypeMutation.isPending || !newDocTypeName.trim()}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
              >
                {createDocTypeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
