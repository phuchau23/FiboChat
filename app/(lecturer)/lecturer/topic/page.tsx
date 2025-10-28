"use client";

import React, { useState } from "react";
import { FolderOpen, Archive, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDomains } from "@/hooks/useDomain";
import { useMasterTopics } from "@/hooks/useMasterTopic";
import { useTopics } from "@/hooks/useTopic";

import { Domain } from "@/lib/api/services/fetchDomain";
import { MasterTopic } from "@/lib/api/services/fetchMasterTopic";
import { Topic } from "@/lib/api/services/fetchTopic";

type FlattenedRow = {
  domain: string;
  masterTopic: string;
  topic: string;
};

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("topics");
  const [search, setSearch] = useState("");

  const { domains } = useDomains();
  const { masterTopics } = useMasterTopics();
  const { topics } = useTopics();

  const renderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-300">
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <FolderOpen className="h-4 w-4 text-emerald-600 mr-2" />;
      case "inactive":
        return <Archive className="h-4 w-4 text-gray-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8 p-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-2xl shadow-sm border border-slate-200">
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

        {/* DOMAINS */}
        <TabsContent value="domains">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains
                    ?.filter((d: Domain) =>
                      d.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((d: Domain) => (
                      <TableRow
                        key={d.id}
                        className="hover:bg-orange-50 transition"
                      >
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>{d.description}</TableCell>
                        <TableCell>{renderStatus(d.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MASTER TOPICS */}
        <TabsContent value="masterTopics">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterTopics
                    ?.filter((mt: MasterTopic) =>
                      mt.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((mt: MasterTopic) => (
                      <TableRow
                        key={mt.id}
                        className="hover:bg-orange-50 transition"
                      >
                        <TableCell className="font-medium">{mt.name}</TableCell>
                        <TableCell>{mt.description}</TableCell>
                        <TableCell>{mt.domain?.name || "Unknown"}</TableCell>
                        <TableCell>{mt.semester?.code}</TableCell>
                        <TableCell>{mt.semester?.term}</TableCell>
                        <TableCell>{mt.semester?.year}</TableCell>
                        <TableCell>
                          {mt.lecturers?.map((l) => l.fullName).join(", ") ||
                            "None"}
                        </TableCell>
                        <TableCell>{renderStatus(mt.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TOPICS */}
        <TabsContent value="topics">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics
                    ?.filter((t: Topic) =>
                      t.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((t: Topic) => (
                      <TableRow
                        key={t.id}
                        className="hover:bg-orange-50 transition"
                      >
                        <TableCell className="flex items-center font-medium">
                          {renderIcon(t.status)}
                          {t.name}
                        </TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell>{renderStatus(t.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
