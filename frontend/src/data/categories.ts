export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'tech',
    name: 'Tech',
    description: 'Technology-related memories and learnings',
    color: 'blue',
  },
  {
    id: 'work',
    name: 'Work',
    description: 'Work-related tasks and projects',
    color: 'green',
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Personal thoughts and reflections',
    color: 'purple',
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Research findings and insights',
    color: 'yellow',
  },
  {
    id: 'ideas',
    name: 'Ideas',
    description: 'Creative ideas and brainstorms',
    color: 'pink',
  },
]; 