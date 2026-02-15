import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EditTaskDialog({ task, onSuccess }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: task?.name || '',
      description: task?.description || '',
      priority: task?.priority || 'MEDIUM',
      status: task?.status || 'TODO',
      archived: task?.archived || false,
    },
  });

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (task && open) {
      reset({
        name: task.name || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'TODO',
        archived: task.archived || false,
      });
    }
  }, [task, open, reset]);

  const mutation = useMutation({
    mutationFn: async (updatedTask) => {
      const response = await api.patch(`/tasks/${task.id}`, updatedTask);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', task.id] });

      toast.success('Task updated successfully');
      setOpen(false);

      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Update failed:', error);

      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.error?.issues;
        if (validationErrors) {
          validationErrors.forEach((err) => {
            toast.error(`${err.path.join('.')}: ${err.message}`);
          });
        } else {
          toast.error('Validation failed');
        }
      } else {
        toast.error('Failed to update task');
      }
    },
  });

  const onSubmit = (data) => {
    // Clean payload - only send the fields we want to update
    const payload = {
      name: data.name,
      description: data.description || null,
      priority: data.priority,
      status: data.status,
      archived: Boolean(data.archived),
    };

    mutation.mutate(payload);
  };

  const priority = watch('priority');
  const status = watch('status');
  const archived = watch('archived');
  const isPending = mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task: {task?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Task Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name">Task Name *</Label>
            <Input
              id="name"
              placeholder="What needs to be done?"
              disabled={isPending}
              {...register('name', {
                required: 'Task name is required',
                maxLength: {
                  value: 500,
                  message: 'Name must be less than 500 characters',
                },
              })}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description - Optional */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add some details..."
              disabled={isPending}
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'Description must be less than 1000 characters',
                },
              })}
              rows={3}
            />
            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Priority and Status - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setValue('priority', value)}
                disabled={isPending}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value)}
                disabled={isPending}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Archive Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="archived"
              checked={archived}
              onChange={(e) => setValue('archived', e.target.checked)}
              disabled={isPending}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label
              htmlFor="archived"
              className="text-sm font-normal cursor-pointer"
            >
              Archive this task
            </Label>
          </div>

          {/* Read-only metadata */}
          <div className="text-xs text-gray-400 pt-2 border-t mt-4">
            <p>Task ID: {task?.id}</p>
            {task?.createdAt && (
              <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Updating...' : 'Update Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
