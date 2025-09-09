import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

const avatars = [
  { id: 'default-avatar.png', emoji: '⚽', color: 'bg-blue-500' },
  { id: 'goalkeeper.png', emoji: '🥅', color: 'bg-green-500' },
  { id: 'player1.png', emoji: '👤', color: 'bg-purple-500' },
  { id: 'player2.png', emoji: '🏃', color: 'bg-orange-500' },
  { id: 'player3.png', emoji: '⭐', color: 'bg-yellow-500' },
  { id: 'player4.png', emoji: '🔥', color: 'bg-red-500' },
  { id: 'player5.png', emoji: '⚡', color: 'bg-cyan-500' },
  { id: 'player6.png', emoji: '🎯', color: 'bg-pink-500' },
];

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className,
  fallback
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl',
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if src matches one of our predefined avatars
  const selectedAvatar = avatars.find(avatar => avatar.id === src);

  if (selectedAvatar) {
    return (
      <div className={cn(
        'relative inline-flex items-center justify-center rounded-full font-medium overflow-hidden',
        sizes[size],
        selectedAvatar.color,
        className
      )}>
        <span>
          {selectedAvatar.emoji}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium overflow-hidden',
      sizes[size],
      className
    )}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="uppercase">
          {fallback || alt?.charAt(0) || '?'}
        </span>
      )}
    </div>
  );
};
