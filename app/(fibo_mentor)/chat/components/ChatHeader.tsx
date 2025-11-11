"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Topic } from "@/lib/data/api";
import UserDropdown from "./UserAvatarMenu";
import {
  useClassEnrollmentByUser,
  useGroupMembers,
} from "@/hooks/useGroupEnrollment";
import { getCookie } from "cookies-next";
import { decodeToken } from "@/utils/jwt";

type RawMember = {
  id: string;
  name: string; // "Trịnh Phương Mai"
  studentID: string;
  email: string; // "maitpss180992@fpt.edu..."
  role: string;
};

interface ChatHeaderProps {
  selectedTopic: Topic;
  setSelectedTopic: (topic: Topic) => void;
  mockTopics: Topic[];
}

function getInitials(fullName?: string) {
  if (!fullName) return "??";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function ChatHeader({
  selectedTopic,
  setSelectedTopic,
  mockTopics,
}: ChatHeaderProps) {
  const token = getCookie("auth-token");
  let userId: string | undefined;

  if (token) {
    const decoded = decodeToken(token.toString());
    userId = decoded?.nameid; // id user hiện tại
  }

  const { data: enrollment } = useClassEnrollmentByUser(userId);
  const groupId = enrollment?.group?.id;
  const { data: members } = useGroupMembers(groupId);

  const memberList: RawMember[] = members?.members ?? [];

  return (
    <header className="relative z-50 border-b border-border px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Fibo Mentor</h1>
        <span className="text-muted-foreground">/</span>

        {/* Members dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded" />
              Members
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="bg-white min-w-[280px] p-2 rounded-lg shadow-md">
              {memberList.length > 0 ? (
                memberList.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    className="flex items-center gap-3 py-2 focus:outline-none focus:ring-0 focus-visible:ring-0 hover:bg-gray-50"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-[12px]">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {member.name}
                        </span>
                        {member.id === userId && (
                          <span className="text-[10px] leading-none px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {member.email}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="text-sm text-gray-500 px-2 py-2">
                  No members found.
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        {/* Topic dropdown */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              {selectedTopic.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="bg-white">
              {mockTopics.map((topic) => (
                <DropdownMenuItem
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu> */}
      </div>

      {/* User avatar + menu */}
      <UserDropdown />
    </header>
  );
}
