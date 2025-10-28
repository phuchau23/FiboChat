/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DomainTable } from "./components/domainTable";
import { MasterTopicTable } from "./components/masterTopicTable";
import { TopicTable } from "./components/topicTable";
import { TopicFormModal } from "./components/topicModal";
import { TopicDeleteDialog } from "./components/topicDeleteDialog";

export default function TopicPage() {
  const [activeTab, setActiveTab] = useState<
    "domains" | "master-topics" | "topics"
  >("domains");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Topic Management</h1>
        <Button onClick={handleAdd}>
          Add{" "}
          {activeTab === "domains"
            ? "Domain"
            : activeTab === "master-topics"
            ? "Master Topic"
            : "Topic"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger
            value="domains"
            className="data-[state=active]:border-[#FF6B00] data-[state=active]:text-[#FF6B00] text-gray-600  transition-all px-4 py-2"
          >
            Domains
          </TabsTrigger>
          <TabsTrigger
            value="master-topics"
            className="data-[state=active]:border-[#FF6B00] data-[state=active]:text-[#FF6B00] text-gray-600  transition-all px-4 py-2"
          >
            Master Topics
          </TabsTrigger>
          <TabsTrigger
            value="topics"
            className="data-[state=active]:border-[#FF6B00] data-[state=active]:text-[#FF6B00] text-gray-600  transition-all px-4 py-2"
          >
            Topics
          </TabsTrigger>
        </TabsList>

        {/* Domains */}
        <TabsContent value="domains" className="space-y-4">
          <DomainTable onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>

        {/* Master Topics */}
        <TabsContent value="master-topics" className="space-y-4">
          <MasterTopicTable onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>

        {/* Topics */}
        <TabsContent value="topics" className="space-y-4">
          <TopicTable onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>

      {/* Form Modal */}
      <TopicFormModal
        open={isFormOpen}
        selectedItem={selectedItem}
        activeTab={activeTab}
        onOpenChange={setIsFormOpen}
      />

      {/* Delete Dialog */}
      <TopicDeleteDialog
        open={isDeleteOpen}
        activeTab={activeTab}
        selectedItem={selectedItem}
        onCancel={() => setIsDeleteOpen(false)}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
