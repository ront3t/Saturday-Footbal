import React from 'react';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelect }) => {
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

  return (
    <div className="grid grid-cols-4 gap-3">
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar.id)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-200 border-2 ${
            selectedAvatar === avatar.id
              ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/25'
              : 'border-slate-600 hover:border-slate-500 hover:scale-105'
          } ${avatar.color}`}
        >
          {avatar.emoji}
        </button>
      ))}
    </div>
  );
};

export default AvatarSelector;
