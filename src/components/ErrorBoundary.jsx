import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-700 bg-white/90 text-sm">
          <h2 className="mb-2 font-semibold">Application Error</h2>
          <pre className="whitespace-pre-wrap">{String(this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
