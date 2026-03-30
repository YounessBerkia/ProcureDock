interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

export const LoadingSpinner = ({ size = 'md', className = '', label = 'Laden...' }: LoadingSpinnerProps) => {
  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`} role="status" aria-label={label}>
      <div
        className={`inline-block animate-spin rounded-full border-solid border-current border-t-transparent text-blue-600 ${sizeClasses[size]}`}
      >
        <span className="sr-only">{label}</span>
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
};

interface LoadingStateCardProps {
  label?: string;
  className?: string;
}

export const LoadingStateCard = ({
  label = 'Daten werden geladen...',
  className = '',
}: LoadingStateCardProps) => {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white px-6 py-16 shadow-sm ${className}`}>
      <div className="flex items-center justify-center">
        <LoadingSpinner size="lg" label={label} />
      </div>
    </div>
  );
};

// Full-page loading state
export const FullPageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" label="Wird geladen..." />
    </div>
  );
};

// Loading overlay for components
export const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
      <LoadingSpinner size="lg" label="Bitte warten..." />
    </div>
  );
};
