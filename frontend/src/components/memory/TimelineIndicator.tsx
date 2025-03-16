import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import type { Memory } from '@/types/memory';
import { motion } from 'framer-motion';

interface TimelineIndicatorProps {
  memories: Memory[];
  className?: string;
  selectedDate?: string | null;
  onDateSelect: (date: string | null) => void;
}

interface TimePoint {
  date: Date;
  key: string;
  label: string;
  count: number;
}

export const TimelineIndicator: React.FC<TimelineIndicatorProps> = ({
  memories,
  className = '',
  selectedDate,
  onDateSelect,
}) => {
  const timePoints = useMemo(() => {
    const points = memories.reduce((acc, memory) => {
      const date = parseISO(memory.created_at);
      const key = format(date, 'yyyy-MM');
      
      if (!acc[key]) {
        acc[key] = {
          date,
          key,
          label: format(date, 'MMM yyyy'),
          count: 0,
        };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, TimePoint>);

    return Object.values(points).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [memories]);

  return (
    <div className={`py-6 overflow-auto ${className}`}>
      <div className="space-y-6 px-4">
        {timePoints.map((point) => (
          <motion.div
            key={point.key}
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            <motion.button
              onClick={() => onDateSelect(selectedDate === point.key ? null : point.key)}
              className={`w-full flex items-center gap-3 group/item transition-colors ${
                selectedDate === point.key 
                  ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg -mx-2 px-2'
                  : ''
              }`}
            >
              <motion.div 
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedDate === point.key
                    ? 'bg-blue-500'
                    : 'bg-gray-400 group-hover/item:bg-blue-400'
                }`}
              />
              <div className="flex-1 py-1">
                <div className={`text-sm font-medium transition-colors ${
                  selectedDate === point.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-gray-100 group-hover/item:text-blue-500'
                }`}>
                  {point.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {point.count} {point.count === 1 ? 'memory' : 'memories'}
                </div>
              </div>
            </motion.button>
            {/* Vertical line connecting points */}
            <div className="absolute left-1 top-2 w-[1px] h-6 bg-gray-200 dark:bg-gray-700"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 