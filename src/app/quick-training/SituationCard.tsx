import { 
  PhoneOff,
  Users,
  Receipt,
  DoorOpen,
  Heart,
  Shield,
  Salad,
  EyeOff,
  Rocket,
  Presentation,
  XSquare,
  Lock,
  LucideIcon
} from 'lucide-react';
import { QuickTrainingSituation, Difficulty } from './mockSituations';

interface SituationCardProps {
  situation: QuickTrainingSituation;
  onClick: () => void;
  isLocked?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  'phone-off': PhoneOff,
  users: Users,
  receipt: Receipt,
  'door-open': DoorOpen,
  heart: Heart,
  shield: Shield,
  salad: Salad,
  'eye-off': EyeOff,
  rocket: Rocket,
  presentation: Presentation,
  'briefcase-x': XSquare,
};

const difficultyColors: Record<Difficulty, { bg: string, text: string }> = {
  easy: { bg: 'bg-green-100', text: 'text-green-700' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  hard: { bg: 'bg-red-100', text: 'text-red-700' }
};

export default function SituationCard({ situation, onClick, isLocked = false }: SituationCardProps) {
  const IconComponent = iconMap[situation.icon];
  const difficultyStyle = difficultyColors[situation.difficulty];

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-200 text-left w-full
        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full bg-opacity-10 flex-shrink-0 relative
          ${isLocked ? 'bg-gray-300' : 'bg-[#3498DB]'}`}
        >
          {IconComponent && (
            <IconComponent 
              size={24} 
              className={isLocked ? 'text-gray-400' : 'text-[#3498DB]'}
            />
          )}
          {isLocked && (
            <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
              <Lock size={12} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-semibold ${isLocked ? 'text-gray-400' : 'text-[#2C3E50]'}`}>
              {situation.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
              ${isLocked ? 'bg-gray-100 text-gray-400' : `${difficultyStyle.bg} ${difficultyStyle.text}`}`}
            >
              {situation.difficulty}
            </span>
          </div>
          <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-[#7F8C8D]'}`}>
            {situation.description}
          </p>
          {isLocked && (
            <p className="text-xs text-gray-400 mt-2 italic">Coming soon</p>
          )}
        </div>
      </div>
    </button>
  );
} 