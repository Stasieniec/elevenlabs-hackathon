import { ThumbsUp, AlertCircle, UserCircle } from 'lucide-react';

type ConversationFeedbackProps = {
  perception: string;
  strongPoints: string[];
  improvementAreas: string[];
  onClose: () => void;
};

export default function ConversationFeedback({
  perception,
  strongPoints,
  improvementAreas,
  onClose
}: ConversationFeedbackProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-8">Conversation Feedback</h2>

      {/* Perception Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <UserCircle className="w-6 h-6 text-[#F39C12]" />
          <h3 className="text-lg font-semibold text-[#2C3E50]">How You Came Across</h3>
        </div>
        <p className="text-[#34495E] bg-[#F39C12]/10 p-4 rounded-lg">
          {perception}
        </p>
      </div>

      {/* Strong Points Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <ThumbsUp className="w-6 h-6 text-[#27AE60]" />
          <h3 className="text-lg font-semibold text-[#2C3E50]">Strong Points</h3>
        </div>
        <ul className="space-y-2">
          {strongPoints.map((point, index) => (
            <li key={index} className="flex items-start space-x-2 text-[#34495E]">
              <span className="text-[#27AE60] mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-[#E74C3C]" />
          <h3 className="text-lg font-semibold text-[#2C3E50]">Areas for Improvement</h3>
        </div>
        <ul className="space-y-2">
          {improvementAreas.map((area, index) => (
            <li key={index} className="flex items-start space-x-2 text-[#34495E]">
              <span className="text-[#E74C3C] mt-1">•</span>
              <span>{area}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 bg-[#27AE60] text-white py-3 rounded-lg font-medium hover:bg-[#27AE60]/90 transition-colors"
        >
          Try Another Conversation
        </button>
      </div>
    </div>
  );
} 