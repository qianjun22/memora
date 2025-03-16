import { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format, isToday, isYesterday, parseISO, getYear, getMonth } from 'date-fns';
import { MemoryCard } from './MemoryCard';
import { TimelineIndicator } from './TimelineIndicator';
import type { TimelineProps, Memory } from '@/types/memory';
import { StarIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useVirtualizer } from '@tanstack/react-virtual';

const PAGE_SIZE = 30; // Increased page size for grid layout

interface TimeSection {
  title: string;
  memories: Memory[];
}

const groupMemoriesByTimeSection = (memories: Memory[]): [string, TimeSection][] => {
  const groups = memories.reduce((acc, memory) => {
    const date = parseISO(memory.created_at);
    const year = getYear(date);
    const month = getMonth(date);
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = {
        title: format(date, 'MMMM yyyy'),
        memories: []
      };
    }
    acc[key].memories.push(memory);
    return acc;
  }, {} as Record<string, TimeSection>);

  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
};

const formatDateHeader = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMMM d, yyyy');
};

export const Timeline: React.FC<TimelineProps> = ({
  memories,
  onMemoryUpdate,
  onMemoryDelete,
  onMemoryPin,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showPinned, setShowPinned] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: PAGE_SIZE });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMemory: Memory = {
      id: '', // Leave empty for parent component to handle
      content: inputValue,
      created_at: '', // Leave empty for parent component to handle
      isPinned: false,
      category: 'General',
      ai_tags: [],
    };
    onMemoryUpdate(newMemory);
    setInputValue('');
  };

  const filteredMemories = useMemo(() => {
    let filtered = memories;

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(memory => {
        const date = parseISO(memory.created_at);
        const key = format(date, 'yyyy-MM');
        return key === selectedDate;
      });
    }

    // Filter by pinned status
    if (showPinned) {
      filtered = filtered.filter(memory => memory.isPinned);
    }

    // Filter by search query
    if (inputValue) {
      const query = inputValue.toLowerCase();
      filtered = filtered.filter(memory => 
        memory.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [memories, inputValue, showPinned, selectedDate]);

  const visibleMemories = useMemo(() => 
    filteredMemories.slice(visibleRange.start, visibleRange.end),
    [filteredMemories, visibleRange]
  );

  // Reset visible range when filters change
  useEffect(() => {
    setVisibleRange({ start: 0, end: PAGE_SIZE });
  }, [selectedDate, showPinned, inputValue]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    
    if (scrollBottom < 500 && visibleRange.end < filteredMemories.length) {
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.end + PAGE_SIZE, filteredMemories.length)
      }));
    }
  }, [filteredMemories.length, visibleRange.end]);

  return (
    <div className="flex h-full">
      {/* Timeline indicator */}
      <TimelineIndicator 
        memories={memories} 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        className="w-48 border-r border-gray-200 dark:border-gray-700" 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search and controls */}
        <div className="flex flex-col gap-4 sticky top-0 bg-gray-50 dark:bg-gray-900 p-6 z-10 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={selectedDate 
                  ? `Search in ${format(parseISO(selectedDate + '-01'), 'MMMM yyyy')}...`
                  : "Write a new memory or search existing ones..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white shadow-sm transition-all duration-200 hover:shadow-md"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
            </div>
            <motion.button
              type="submit"
              className="px-5 py-3.5 rounded-xl transition-all duration-200 text-base font-medium flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusIcon className="h-5 w-5" />
              Save Memory
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowPinned(!showPinned)}
              className={`px-5 py-3.5 rounded-xl transition-all duration-200 text-base font-medium flex items-center gap-2 ${
                showPinned
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <StarIcon className={`h-5 w-5 ${showPinned ? 'text-yellow-600 dark:text-yellow-400' : ''}`} />
              Pinned
            </motion.button>
          </form>
          {selectedDate && (
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing memories from {format(parseISO(selectedDate + '-01'), 'MMMM yyyy')}
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Show all
              </button>
            </div>
          )}
        </div>

        {/* Memories grid */}
        <div className="flex-1 overflow-auto p-6" onScroll={handleScroll}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {visibleMemories.map((memory: Memory, index: number) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  className={memory.isPinned ? 'sm:col-span-2 sm:row-span-2' : ''}
                >
                  <MemoryCard
                    memory={memory}
                    onEdit={onMemoryUpdate}
                    onDelete={onMemoryDelete}
                    onPin={onMemoryPin}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {visibleRange.end < filteredMemories.length && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading more memories...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 