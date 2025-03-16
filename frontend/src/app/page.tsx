'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuickAdd } from '@/components/memory/QuickAdd';
import { Timeline } from '@/components/memory/Timeline';
import type { Memory } from '@/types/memory';

const STORAGE_KEY = 'memora_memories';

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load memories from localStorage or fetch mock data
  useEffect(() => {
    const loadMemories = async () => {
      try {
        // Try to load from localStorage first
        const savedMemories = localStorage.getItem(STORAGE_KEY);
        if (savedMemories) {
          setMemories(JSON.parse(savedMemories));
          setIsLoading(false);
          return;
        }

        // If no saved memories, load mock data
        const response = await fetch('/data/memora_mock_data_varied.json');
        const data = await response.json();
        const memoriesWithPin = data.map((memory: Memory) => ({
          ...memory,
          isPinned: false,
        }));
        setMemories(memoriesWithPin);
        // Save initial mock data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memoriesWithPin));
      } catch (error) {
        console.error('Error loading memories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMemories();
  }, []);

  // Save to localStorage whenever memories change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    }
  }, [memories, isLoading]);

  const handleAddMemory = (newMemory: Omit<Memory, 'id' | 'created_at'>) => {
    const memory: Memory = {
      ...newMemory,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setMemories((prev) => [memory, ...prev]);
  };

  const handleUpdateMemory = (updatedMemory: Memory) => {
    setMemories((prev) =>
      prev.map((memory) =>
        memory.id === updatedMemory.id
          ? updatedMemory
          : memory
      )
    );
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((memory) => memory.id !== id));
  };

  const handlePinMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((memory) =>
        memory.id === id
          ? { ...memory, isPinned: !memory.isPinned }
          : memory
      )
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <QuickAdd onAdd={handleAddMemory} />
        <Timeline
          memories={memories}
          onMemoryUpdate={handleUpdateMemory}
          onMemoryDelete={handleDeleteMemory}
          onMemoryPin={handlePinMemory}
        />
      </div>
    </MainLayout>
  );
}
