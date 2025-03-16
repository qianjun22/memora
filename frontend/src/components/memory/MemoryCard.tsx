import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { MemoryCardProps } from '@/types/memory';

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onEdit,
  onDelete,
  onPin,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-300">{memory.content}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPin(memory.id)}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            {memory.isPinned ? (
              <StarIconSolid className="h-5 w-5 text-yellow-500" />
            ) : (
              <StarIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => onEdit(memory)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(memory.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {memory.ai_tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <span className="mr-2">
          {formatDistanceToNow(parseISO(memory.created_at), { addSuffix: true })}
        </span>
        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
          {memory.category}
        </span>
      </div>
    </motion.div>
  );
}; 