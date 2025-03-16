export interface Memory {
  id: string;
  content: string;
  created_at: string;
  category: string;
  ai_tags: string[];
  isPinned?: boolean;
}

export interface MemoryCardProps {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}

export interface TimelineProps {
  memories: Memory[];
  onMemoryUpdate: (memory: Memory) => void;
  onMemoryDelete: (id: string) => void;
  onMemoryPin: (id: string) => void;
}

export interface QuickAddProps {
  onAdd: (memory: Omit<Memory, 'id' | 'created_at'>) => void;
} 