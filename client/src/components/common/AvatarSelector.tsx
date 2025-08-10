import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelect: (avatar: string) => void;
  className?: string;
}

const defaultAvatars = [
  'avatar-1.png',
  'avatar-2.png',
  'avatar-3.png',
  'avatar-4.png',
  'avatar-5.png',
  'avatar-6.png',
  'avatar-7.png',
  'avatar-8.png',
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatar,
  onAvatarSelect,
  className
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Choose Avatar
      </label>
      <div className="grid grid-cols-4 gap-3">
        {defaultAvatars.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={() => onAvatarSelect(avatar)}
            className={cn(
              'w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-lg border-2 transition-all duration-200',
              selectedAvatar === avatar
                ? 'border-blue-600 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-blue-400'
            )}
          >
            {/* In a real app, these would be actual avatar images */}
            {avatar.charAt(7)}
          </button>
        ))}
      </div>
    </div>
  );
};
