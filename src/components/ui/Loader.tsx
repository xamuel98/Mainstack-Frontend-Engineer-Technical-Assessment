import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const loaderVariants = cva('animate-spin rounded-full border-2 border-current', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    variant: {
      default: 'border-primary border-t-transparent',
      secondary: 'border-secondary border-t-transparent',
      muted: 'border-muted-foreground border-t-transparent',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  text?: string;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, variant, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-2', className)}
        {...props}
      >
        <div className={cn(loaderVariants({ size, variant }))} />
        {text && (
          <span className="text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }
);

Loader.displayName = 'Loader';

// Full page loader component
export interface PageLoaderProps {
  text?: string;
  className?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ text = 'Loading...', className }) => {
  return (
    <div className={cn('flex min-h-screen items-center justify-center', className)}>
      <Loader size="lg" text={text} />
    </div>
  );
};

// Inline loader for smaller sections
export interface InlineLoaderProps {
  text?: string;
  className?: string;
  size?: VariantProps<typeof loaderVariants>['size'];
}

const InlineLoader: React.FC<InlineLoaderProps> = ({ 
  text = 'Loading...', 
  className,
  size = 'default'
}) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Loader size={size} text={text} />
    </div>
  );
};

export { Loader, PageLoader, InlineLoader, loaderVariants };