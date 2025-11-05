import { useState } from "react";
import type { Topic } from "@/lib/api/services/fetchTopic";
import { useMasterTopicById } from "@/hooks/useMasterTopic";

export function useTopicDetail() {
  const [topic, setTopic] = useState<Topic | null>(null);

  const masterTopicId = topic?.masterTopic?.id;

  // React Query tự fetch khi có id
  const { masterTopic, isLoading } = useMasterTopicById(masterTopicId);

  const openTopicDetail = (item: Topic) => {
    setTopic(item);
  };

  const closeTopicDetail = () => setTopic(null);

  return {
    isOpen: !!topic,
    topic,
    masterTopic,
    loading: isLoading,
    openTopicDetail,
    closeTopicDetail,
  };
}
