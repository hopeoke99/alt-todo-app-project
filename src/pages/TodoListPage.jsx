import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTodos } from '@/api/todos';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { DeleteTaskDialog } from '@/components/DeleteTaskDialog';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { EditTaskDialog } from '@/components/EditTaskDialog';

export default function TodoListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse all filters from URL
  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'DESC';

  // Local state for search input (for debouncing)
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500); // 500ms debounce

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
      params.set('page', '1'); // Reset to first page on search
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, [debouncedSearch]);

  // Prepare filters for API
  const filters = {
    page,
    limit: 10,
    status: status || undefined,
    priority: priority || undefined,
    search: search || undefined,
    sort,
  };

  const { data, isLoading, error } = useTodos(filters);

  // Handle filter changes
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to first page when filter changes
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({}); // Clear all filters
    setSearchInput('');
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
  };

  // Status options mapping to display labels
  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
  ];

  // Check if any filters are active
  const hasActiveFilters = status || priority || search || sort !== 'DESC';

  if (isLoading)
    return <div className="text-center py-10">Loading tasks...</div>;
  if (error)
    return (
      <div className="text-center text-red-600">Error: {error.message}</div>
    );

  const todos = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1, page: 1 };

  return (
    <div className="space-y-6">
      {/* Header with title and create button */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {meta.total} {meta.total === 1 ? 'task' : 'tasks'} total
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search tasks..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8"
                aria-label="Search tasks"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status || 'all'}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority filter */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority || 'all'}
              onValueChange={(value) => updateFilter('priority', value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort order */}
          <div className="space-y-2">
            <Label htmlFor="sort">Sort</Label>
            <Select
              value={sort}
              onValueChange={(value) => updateFilter('sort', value)}
            >
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Newest first</SelectItem>
                <SelectItem value="ASC">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters and clear button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-2 flex-wrap">
              {status && (
                <Badge variant="outline" className="bg-blue-50">
                  Status:{' '}
                  {statusOptions.find((s) => s.value === status)?.label ||
                    status}
                </Badge>
              )}
              {priority && (
                <Badge variant="outline" className="bg-blue-50">
                  Priority: {priority}
                </Badge>
              )}
              {search && (
                <Badge variant="outline" className="bg-blue-50">
                  Search: "{search}"
                </Badge>
              )}
              {sort !== 'DESC' && (
                <Badge variant="outline" className="bg-blue-50">
                  Sort: {sort === 'ASC' ? 'Oldest first' : 'Newest first'}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" /> Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Task List */}
      {todos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {hasActiveFilters
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {todos.map((todo) => (
            <Card
              key={todo.id}
              className="hover:border-blue-500 transition-all"
            >
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="pt-1">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        todo.status === 'DONE'
                          ? 'bg-green-500'
                          : todo.status === 'IN_PROGRESS'
                          ? 'bg-blue-500'
                          : todo.status === 'CANCELLED'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{todo.name}</CardTitle>
                      <div className="flex gap-1">
                        <Badge
                          variant="outline"
                          className={
                            todo.priority === 'HIGH'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : todo.priority === 'MEDIUM'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }
                        >
                          {todo.priority}
                        </Badge>
                        <Badge
                          className={
                            todo.status === 'DONE'
                              ? 'bg-green-100 text-green-800'
                              : todo.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : todo.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {todo.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    {todo.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      {todo.start && (
                        <span>
                          Start: {new Date(todo.start).toLocaleDateString()}
                        </span>
                      )}
                      {todo.end && (
                        <span>
                          Due: {new Date(todo.end).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <EditTaskDialog task={todo} />
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/todo/${todo.id}`}>Details</Link>
                  </Button>
                  <DeleteTaskDialog taskId={todo.id} taskTitle={todo.name} />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={!meta.hasPreviousPage}
              />
            </PaginationItem>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === meta.totalPages ||
                  (p >= meta.page - 2 && p <= meta.page + 2)
              )
              .map((p, i, arr) => {
                // Add ellipsis
                if (i > 0 && p > arr[i - 1] + 1) {
                  return (
                    <PaginationItem key={`ellipsis-${p}`}>
                      <span className="px-4">...</span>
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={meta.page === p}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={!meta.hasNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
