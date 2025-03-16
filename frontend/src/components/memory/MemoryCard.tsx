import { useState, memo } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { MemoryCardProps } from '@/types/memory';

const MemoryCardComponent: React.FC<MemoryCardProps> = ({
  memory,
  onEdit,
  onDelete,
  onPin,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const contentPreview = memory.content.slice(0, 150);
  const hasMoreContent = memory.content.length > 150;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative aspect-square bg-white dark:bg-gray-800 overflow-hidden group rounded-xl
        ${memory.isPinned ? 'border-2 border-yellow-400 dark:border-yellow-600' : 'border border-gray-200 dark:border-gray-700'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 p-4">
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 line-clamp-6 leading-relaxed">
          {contentPreview}
          {hasMoreContent && '...'}
        </p>
      </div>

      <motion.div 
        className="absolute inset-0 bg-black/50 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        initial={false}
      >
        <div className="flex justify-end gap-2">
          <motion.button
            onClick={() => onPin(memory.id)}
            className={`p-2 rounded-full bg-black/30 backdrop-blur-sm ${
              memory.isPinned 
                ? 'text-yellow-400' 
                : 'text-white hover:text-yellow-400'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {memory.isPinned ? (
              <StarIconSolid className="h-5 w-5" />
            ) : (
              <StarIcon className="h-5 w-5" />
            )}
          </motion.button>
          <motion.button
            onClick={() => onEdit(memory)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:text-blue-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <PencilIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(memory.id)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:text-red-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <TrashIcon className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="text-sm text-white/90 font-medium">
          {formatDistanceToNow(parseISO(memory.created_at), { addSuffix: true })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const MemoryCard = memo(MemoryCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.memory.id === nextProps.memory.id &&
    prevProps.memory.content === nextProps.memory.content &&
    prevProps.memory.isPinned === nextProps.memory.isPinned &&
    prevProps.memory.created_at === nextProps.memory.created_at
  );
}); 