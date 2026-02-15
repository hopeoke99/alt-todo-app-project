import React from 'react';
import { Button } from '@/components/ui/button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <h2 className="text-2xl font-bold">Something went wrong.</h2>
          <Button onClick={() => (window.location.href = '/')}>
            Return Home
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}