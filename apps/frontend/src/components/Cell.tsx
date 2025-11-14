import { cn } from '@/lib/utils';

interface CellProps {
  symbol: string;
  isHead: boolean;
  index: number;
}

export function Cell({ symbol, isHead }: CellProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-16 h-16 border-2 rounded-xl font-mono text-xl font-bold transition-all duration-300',
        isHead
          ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-110 ring-2 ring-primary/30'
          : 'border-border bg-card hover:bg-accent hover:border-primary/30',
        symbol === '1' 
          ? 'text-success' 
          : 'text-muted-foreground'
      )}
    >
      <span className={cn(isHead && 'drop-shadow-lg')}>{symbol}</span>
      {isHead && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary bg-card px-2 py-1 rounded border border-primary/50 shadow-lg">
          ↑ Head
        </div>
      )}
    </div>
  );
}
