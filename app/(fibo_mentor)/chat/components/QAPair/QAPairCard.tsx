import { QAPair } from "@/lib/api/services/fetchQAPair";

interface QAPairCardProps {
  qaPair: QAPair;
  onUsePrompt: (question: string) => void;
}

export default function QAPairCard({ qaPair, onUsePrompt }: QAPairCardProps) {
  // Truncate text for preview

  return (
    <div className="bg-white  rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
      {/* Question Title */}
      <h3 className="font-semibold text-gray-900 text-[15px] mb-2.5 leading-snug">{qaPair.questionText}</h3>

      {/* Answer Preview */}
      {/* <p className="text-gray-500 text-[13px] mb-3 leading-relaxed">
        {displayAnswer}
        {shouldTruncate && !isExpanded && "..."}
      </p> */}

      {/* Show more/less button */}
      {/* {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 text-[13px] hover:underline mb-3 block"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )} */}

      {/* Use Prompt Button */}
      <button
        onClick={() => onUsePrompt(qaPair.questionText)}
        className="w-full bg-[#f8fafc] hover:bg-gray-50 text-gray-700 text-[13px] py-2.5 px-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors font-medium"
      >
        Sử Dụng Câu Hỏi
      </button>
    </div>
  );
}
