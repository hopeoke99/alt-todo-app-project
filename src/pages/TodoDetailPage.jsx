import { useParams, Link } from 'react-router-dom';
import { useTodo } from '@/api/todos';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns'; // Optional: for date formatting
import { EditTaskDialog } from '@/components/EditTaskDialog';

export default function TodoDetailPage() {
  const { id } = useParams();
  const { data: todo, isLoading, error } = useTodo(id);

  if (isLoading)
    return <div className="text-center py-10">Loading task...</div>;
  if (error)
    return (
      <div className="text-center text-red-600">Error: {error.message}</div>
    );
  if (!todo) return <div className="text-center">Task not found</div>;

  const getStatusBadge = (status) => {
    const colors = {
      TODO: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      DONE: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      HIGH: 'bg-red-50 text-red-700 border-red-200',
      MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      LOW: 'bg-green-50 text-green-700 border-green-200',
    };
    return colors[priority] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div>
      <Button asChild variant="outline" className="mb-4">
        <Link to="/">← Back to list</Link>
      </Button>
      <EditTaskDialog task={todo} /> {/* [!code ++] */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{todo.name}</CardTitle>
            <div className="flex gap-2">
              <Badge
                className={getPriorityBadge(todo.priority)}
                variant="outline"
              >
                {todo.priority}
              </Badge>
              <Badge className={getStatusBadge(todo.status)}>
                {todo.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          {todo.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-gray-900">{todo.description}</p>
            </div>
          )}

          {/* Timeline */}
          {(todo.start || todo.end || todo.duration) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todo.start && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Start Date
                  </h3>
                  <p>
                    {format
                      ? format(new Date(todo.start), 'PPP')
                      : new Date(todo.start).toLocaleDateString()}
                  </p>
                </div>
              )}
              {todo.end && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Due Date
                  </h3>
                  <p>
                    {format
                      ? format(new Date(todo.end), 'PPP')
                      : new Date(todo.end).toLocaleDateString()}
                  </p>
                </div>
              )}
              {todo.duration && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Duration
                  </h3>
                  <p>{todo.duration} minutes</p>
                </div>
              )}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task ID
              </h3>
              <p className="text-sm font-mono mt-1">{todo.id}</p>
            </div>

            {todo.owner && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </h3>
                <p className="text-sm mt-1">{todo.owner}</p>
              </div>
            )}

            {todo.parentId && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Task
                </h3>
                <Link
                  to={`/todo/${todo.parentId}`}
                  className="text-sm text-blue-600 hover:underline mt-1 block"
                >
                  View Parent
                </Link>
              </div>
            )}

            {todo.children && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Has Children
                </h3>
                <Badge variant="outline" className="mt-1">
                  Yes
                </Badge>
              </div>
            )}
          </div>

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {Array.isArray(todo.tags) ? (
                  todo.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : typeof todo.tags === 'string' ? (
                  <Badge variant="secondary" className="text-xs">
                    {todo.tags}
                  </Badge>
                ) : null}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-gray-400 pt-4 border-t">
            {todo.createdAt && (
              <p>Created: {new Date(todo.createdAt).toLocaleString()}</p>
            )}
            {todo.updatedAt && (
              <p>Last updated: {new Date(todo.updatedAt).toLocaleString()}</p>
            )}
            {todo.completedAt && (
              <p>Completed: {new Date(todo.completedAt).toLocaleString()}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
