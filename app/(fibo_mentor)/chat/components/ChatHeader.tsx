import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal, // ✅ thêm dòng này
} from "@/components/ui/dropdown-menu";
import { Team } from "@/lib/data/api";
import { Topic } from "@/lib/data/api";
import { ChevronDown } from "lucide-react";

interface ChatHeaderProps {
  selectedTeam: Team;
  setSelectedTeam: (team: Team) => void;
  mockTeams: Team[];
  selectedTopic: Topic;
  setSelectedTopic: (topic: Topic) => void;
  mockTopics: Topic[];
}

export default function ChatHeader({
  selectedTeam,
  setSelectedTeam,
  mockTeams,
  selectedTopic,
  setSelectedTopic,
  mockTopics,
}: ChatHeaderProps) {
  return (
    <header className="relative z-50 border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Fibo Mentor</h1>
        <span className="text-muted-foreground">/</span>

        {/* --- Team Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded" />
              {selectedTeam.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="bg-white">
              {mockTeams.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                >
                  {team.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        <span className="text-muted-foreground">/</span>

        {/* --- Topic Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              {selectedTopic.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className=" bg-white">
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
        </DropdownMenu>
      </div>

      <Avatar>
        <AvatarFallback className="bg-gray-200 text-gray-700">
          HL
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
