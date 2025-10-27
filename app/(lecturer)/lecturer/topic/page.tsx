"use client";

import React, { useState, useMemo } from "react";
import { Search, FolderOpen, Clock, Archive, Info, PlusCircle, BookOpen, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// import CreateDomainDialog from "./CreateDomainDialog";
import CreateMasterTopicDialog from "./CreateMasterTopicDialog";
import CreateTopicDialog from "./CreateTopicDialog";
import EditDomainDialog from "./EditDomainDialog";
import EditMasterTopicDialog from "./EditMasterTopicDialog";
import EditTopicDialog from "./EditTopicDialog";

import { Topic } from "@/hooks/services/fetchTopic";
import { useDomains } from "@/hooks/useDomains";
import { useMasterTopics } from "@/hooks/useMasterTopics";
import { useTopics } from "@/hooks/useTopics";
import { Domain } from "@/hooks/services/fetchDomains";
import { MasterTopic } from "@/hooks/services/fetchMasterTopics";

type FlattenedRow = {
  domain: string;
  masterTopic: string;
  topic: string;
};

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("topics");
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<FlattenedRow | null>(null);

  const [openCreateDomain, setOpenCreateDomain] = useState(false);
  const [openCreateMasterTopic, setOpenCreateMasterTopic] = useState(false);
  const [openCreateTopic, setOpenCreateTopic] = useState(false);

  const [openEditDomain, setOpenEditDomain] = useState(false);
  const [openEditMasterTopic, setOpenEditMasterTopic] = useState(false);
  const [openEditTopic, setOpenEditTopic] = useState(false);

  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [editingMasterTopic, setEditingMasterTopic] = useState<MasterTopic | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const { data: domainData, refetch: refetchDomains } = useDomains();
  const { data: masterTopicData, refetch: refetchMasterTopics } = useMasterTopics();
  const { data: topicData, refetch: refetchTopics } = useTopics();

  const domains = domainData?.data.items || [];
  const masterTopics = masterTopicData?.data.items || [];
  const topics = topicData?.data.items || [];

  const renderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">Pending</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-700 border border-gray-300">Archived</Badge>;
      default:
        return null;
    }
  };

  const renderIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <FolderOpen className="h-4 w-4 text-emerald-600 mr-2" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600 mr-2" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8 p-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-2xl shadow-sm border border-slate-200">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-center gap-2 bg-gradient-to-r from-slate-50 to-white border border-slate-200/60 backdrop-blur-md p-2 rounded-2xl shadow-sm">
          <TabsTrigger
            value="domains"
            className="group flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-orange-500 transition-all 
    hover:text-orange-700 hover:bg-orange-100 
    data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 
    data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:scale-[1.03]"
          >
            <FolderOpen className="h-4 w-4 text-orange-500 group-data-[state=active]:text-white transition-colors" />
            Domains
          </TabsTrigger>

          <TabsTrigger
            value="masterTopics"
            className="group flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-orange-500 transition-all 
    hover:text-orange-700 hover:bg-orange-100 
    data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 
    data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:scale-[1.03]"
          >
            <BookOpen className="h-4 w-4 text-orange-500 group-data-[state=active]:text-white transition-colors" />
            Master Topics
          </TabsTrigger>

          <TabsTrigger
            value="topics"
            className="group flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-orange-500 transition-all 
    hover:text-orange-700 hover:bg-orange-100 
    data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 
    data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:scale-[1.03]"
          >
            <Archive className="h-4 w-4 text-orange-500 group-data-[state=active]:text-white transition-colors" />
            Topics
          </TabsTrigger>
        </TabsList>

        {/* ─────────────────────────────── DOMAINS ─────────────────────────────── */}
        <TabsContent value="domains">
          {/* <div className="flex justify-between mb-5">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search domains..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-slate-300 shadow-sm"
              />
            </div>
            <Button
              onClick={() => setOpenCreateDomain(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Domain
            </Button>
          </div> */}

          <Card className="shadow-md border border-orange-200 rounded-xl">
            <CardHeader className="bg-orange-50/70 border-b border-orange-200 rounded-t-xl">
              <CardTitle className="text-orange-700">Domains</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-orange-100/80">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains
                    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
                    .map((d) => (
                      <TableRow key={d.id} className="hover:bg-orange-50 transition">
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>{d.description}</TableCell>
                        <TableCell>{renderStatus(d.status)}</TableCell>
                        {/* <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingDomain(d);
                              setOpenEditDomain(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-orange-600" />
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ───────────────────────────── MASTER TOPICS ───────────────────────────── */}
        <TabsContent value="masterTopics">
          {/* <div className="flex justify-between mb-5">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search master topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-slate-300 shadow-sm"
              />
            </div>
            <Button
              onClick={() => setOpenCreateMasterTopic(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-400 text-white hover:from-orange-500 hover:to-orange-300"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Master Topic
            </Button>
          </div> */}

          <Card className="shadow-md border border-orange-200 rounded-xl">
            <CardHeader className="bg-orange-50/60 border-b border-orange-200 rounded-t-xl">
              <CardTitle className="text-orange-700">Master Topics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-orange-100/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Lecturers</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterTopics
                    .filter((mt) => mt.name.toLowerCase().includes(search.toLowerCase()))
                    .map((mt) => (
                      <TableRow key={mt.id} className="hover:bg-orange-50 transition">
                        <TableCell className="font-medium">{mt.name}</TableCell>
                        <TableCell>{mt.description}</TableCell>
                        <TableCell>{mt.domain?.name || "Unknown"}</TableCell>
                        <TableCell>{mt.semester?.code}</TableCell>
                        <TableCell>{mt.semester?.term}</TableCell>
                        <TableCell>{mt.semester?.year}</TableCell>
                        <TableCell>{mt.lecturers?.map((l) => l.fullName).join(", ") || "None"}</TableCell>
                        <TableCell>{renderStatus(mt.status)}</TableCell>
                        {/* <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingMasterTopic(mt);
                              setOpenEditMasterTopic(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-orange-600" />
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────────────────────── TOPICS ─────────────────────────────── */}
        <TabsContent value="topics">
          {/* <div className="flex justify-between mb-5">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-slate-300 shadow-sm"
              />
            </div>
            <Button
              onClick={() => setOpenCreateTopic(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-400 text-white hover:from-orange-500 hover:to-orange-300"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Topic
            </Button>
          </div> */}

          <Card className="shadow-md border border-orange-200 rounded-xl">
            <CardHeader className="bg-orange-50/60 border-b border-orange-200 rounded-t-xl">
              <CardTitle className="text-orange-700">Topics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-orange-100/50">
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics
                    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
                    .map((t) => (
                      <TableRow key={t.id} className="hover:bg-orange-50 transition">
                        <TableCell className="flex items-center font-medium">
                          {renderIcon(t.status)}
                          {t.name}
                        </TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell>{renderStatus(t.status)}</TableCell>
                        {/* <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingTopic(t);
                              setOpenEditTopic(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-orange-600" />
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Dialogs */}
      {/* <CreateDomainDialog open={openCreateDomain} onOpenChange={setOpenCreateDomain} onCreated={refetchDomains} />
      <CreateMasterTopicDialog
        open={openCreateMasterTopic}
        onOpenChange={setOpenCreateMasterTopic}
        onCreated={refetchMasterTopics}
      />
      <CreateTopicDialog open={openCreateTopic} onOpenChange={setOpenCreateTopic} onCreated={refetchTopics} /> */}

      {/* Edit Dialogs */}
      {/* <EditDomainDialog
        open={openEditDomain}
        onOpenChange={setOpenEditDomain}
        domain={editingDomain}
        onUpdated={refetchDomains}
      />
      <EditMasterTopicDialog
        open={openEditMasterTopic}
        onOpenChange={setOpenEditMasterTopic}
        masterTopic={editingMasterTopic}
        onUpdated={refetchMasterTopics}
      />
      <EditTopicDialog
        open={openEditTopic}
        onOpenChange={setOpenEditTopic}
        topic={editingTopic}
        onUpdated={refetchTopics}
      /> */}
    </div>
  );
}
