/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FormModal,
  type FormField,
} from "@/app/(admin)/admin/components/form-modal";
import { useToast } from "@/hooks/use-toast";

import { useDomains } from "@/hooks/useDomain";
import {
  useMasterTopics,
  useCreateMasterTopic,
  useUpdateMasterTopic,
} from "@/hooks/useMasterTopic";
import { useCreateDomain, useUpdateDomain } from "@/hooks/useDomain";
import { useCreateTopic, useUpdateTopic } from "@/hooks/useTopic";
import useLecturers from "@/hooks/useLecturer";
import { useSemesters } from "@/hooks/useSemester";

import type { Domain } from "@/lib/api/services/fetchDomain";
import type { MasterTopic } from "@/lib/api/services/fetchMasterTopic";

interface TopicFormModalProps {
  open: boolean;
  selectedItem: any;
  activeTab: "domains" | "master-topics" | "topics";
  onOpenChange: (open: boolean) => void;
}

export function TopicFormModal({
  open,
  selectedItem,
  activeTab,
  onOpenChange,
}: TopicFormModalProps) {
  const { toast } = useToast();

  const { lecturers, isLoading: loadingLecturers } = useLecturers();
  const { semesters, isLoading: loadingSemesters } = useSemesters();
  const { domains, isLoading: loadingDomains } = useDomains();
  const { masterTopics, isLoading: loadingMasterTopics } = useMasterTopics();

  // mutation hooks
  const createDomain = useCreateDomain();
  const updateDomain = useUpdateDomain();
  const createMasterTopic = useCreateMasterTopic();
  const updateMasterTopic = useUpdateMasterTopic();
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();

  const [loading, setLoading] = useState(false);

  const domainOptions = useMemo(
    () => (domains ?? []).map((d: Domain) => ({ value: d.id, label: d.name })),
    [domains]
  );

  const semesterOptions = useMemo(
    () =>
      (semesters ?? []).map((s) => ({
        value: s.id,
        label: `${s.code}`,
      })),
    [semesters]
  );

  const lecturerOptions = useMemo(
    () =>
      (lecturers ?? []).map((l) => ({
        value: l.lecturerId,
        label: l.fullName,
      })),
    [lecturers]
  );

  const masterTopicOptions = useMemo(
    () =>
      (masterTopics ?? []).map((mt: MasterTopic) => ({
        value: mt.id,
        label: mt.name,
      })),
    [masterTopics]
  );

  const domainFields: FormField[] = [
    { name: "Name", label: "Name", type: "text", required: true },
    { name: "Description", label: "Description", type: "textarea" },
  ];

  const masterTopicFields: FormField[] = [
    { name: "Name", label: "Name", type: "text", required: true },
    {
      name: "DomainId",
      label: "Domain",
      type: "select",
      required: true,
      options: domainOptions,
      placeholder: "Select",
    },
    {
      name: "SemesterId",
      label: "Semester",
      type: "select",
      required: true,
      options: semesterOptions,
      placeholder: "Select",
    },
    {
      name: "LecturerId",
      label: "Lecturers",
      type: "select",
      required: true,
      options: lecturerOptions,
      placeholder: "Select",
    },
    {
      name: "Description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
    },
  ];

  const topicFields: FormField[] = [
    {
      name: "Name",
      label: "Topic Name",
      type: "text",
      required: true,
    },
    {
      name: "MasterTopicId",
      label: "Master Topic",
      type: "select",
      required: true,
      options: masterTopicOptions,
      placeholder: "Select",
    },
    {
      name: "Description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
    },
  ];

  const getFields = () => {
    if (activeTab === "domains") return domainFields;
    if (activeTab === "master-topics") return masterTopicFields;
    return topicFields;
  };

  const getTitle = () => {
    const action = selectedItem ? "Edit" : "Add";
    if (activeTab === "domains") return `${action} Domain`;
    if (activeTab === "master-topics") return `${action} Master Topic`;
    return `${action} Topic`;
  };

  const getInitialData = () => {
    if (!selectedItem) return undefined;

    if (activeTab === "domains") {
      return {
        Name: selectedItem.name,
        Description: selectedItem.description,
      };
    }

    if (activeTab === "master-topics") {
      return {
        Name: selectedItem.name,
        Description: selectedItem.description,
        DomainId: selectedItem.domain?.id,
        SemesterId: selectedItem.semester?.id,
        LecturerId: selectedItem.lecturers?.[0]?.lecturerId,
      };
    }

    if (activeTab === "topics") {
      return {
        Name: selectedItem.name,
        Description: selectedItem.description,
        MasterTopicId: selectedItem.masterTopic?.id,
      };
    }

    return undefined;
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      setLoading(true);
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach((v) => form.append(key, v));
        else form.append(key, value);
      });

      if (activeTab === "domains") {
        if (selectedItem)
          await updateDomain.mutateAsync({
            id: selectedItem.id,
            formData: form,
          });
        else await createDomain.mutateAsync(form);
      } else if (activeTab === "master-topics") {
        if (selectedItem)
          await updateMasterTopic.mutateAsync({
            id: selectedItem.id,
            formData: form,
          });
        else await createMasterTopic.mutateAsync(form);
      } else {
        if (selectedItem)
          await updateTopic.mutateAsync({
            id: selectedItem.id,
            formData: form,
          });
        else await createTopic.mutateAsync(form);
      }

      toast({
        description: `${getTitle()} successfully.`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  return (
    <FormModal
      open={open}
      title={getTitle()}
      fields={getFields()}
      initialData={getInitialData()}
      onSubmit={handleSubmit}
      onOpenChange={onOpenChange}
      loading={
        loading ||
        loadingLecturers ||
        loadingSemesters ||
        loadingDomains ||
        loadingMasterTopics ||
        createDomain.isPending ||
        updateDomain.isPending ||
        createMasterTopic.isPending ||
        updateMasterTopic.isPending ||
        createTopic.isPending ||
        updateTopic.isPending
      }
    />
  );
}
