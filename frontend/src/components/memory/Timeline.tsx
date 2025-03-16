import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MemoryCard } from './MemoryCard';
import type { TimelineProps, Memory } from '@/types/memory';

export const Timeline: React.FC<TimelineProps> = ({
  memories,
  onMemoryUpdate,
  onMemoryDelete,
  onMemoryPin,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMemories = memories
    .filter((memory) => {
      if (filter === 'all') return true;
      if (filter === 'pinned') return memory.isPinned;
      return memory.category.toLowerCase() === filter.toLowerCase();
    })
    .filter((memory) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        memory.content.toLowerCase().includes(query) ||
        memory.title?.toLowerCase().includes(query) ||
        memory.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

  const categories = Array.from(
    new Set(memories.map((memory) => memory.category))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pinned')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pinned'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Pinned
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg ${
                filter === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search memories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onEdit={onMemoryUpdate}
              onDelete={onMemoryDelete}
              onPin={onMemoryPin}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}; 