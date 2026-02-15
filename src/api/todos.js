import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const fetchTodos = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    search,
    sort = 'DESC',
    all = false
  } = filters;

  const params = {
    page,
    limit,
    sort,
    all: all ? true : undefined, // Only include if true
  };

  // Only add filters if they have values
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (search) params.search = search;

  const { data } = await api.get('/tasks', { params });
  return data; // Returns { data: [...], meta: {...} }
};

export const useTodos = (filters) => {
  // Create a stable query key that includes all filters
  const queryKey = ['todos', filters];
  
  return useQuery({
    queryKey,
    queryFn: () => fetchTodos(filters),
    placeholderData: (previousData) => previousData, // keep old data while loading
    // Keep previous data when filters change to prevent loading flicker
  });
};

export const fetchTodo = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

export const useTodo = (id) => {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
  });
};