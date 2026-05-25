import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterDropdown } from '@/components/layout/filter-dropdown';

export type PageHeaderProps = {
  title: string;
  subtitle: string;
  showFilters?: boolean;
  filterOptions?: string[];
  showAddButton?: boolean;
  onAddClick?: React.ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  showFilters = false,
  filterOptions = ['Categoría', 'Estado'],
  showAddButton = false,
  onAddClick,
}: PageHeaderProps) {
  return (
    <header className="flex flex-row items-end justify-between mb-8 relative z-10 w-full">
      <div className="mb-[-4px]">
        <h1 className="text-[26px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 leading-none mb-2">
          {title}
        </h1>
        <p className="text-primary text-[13px] leading-tight whitespace-pre-line">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {showFilters && (
          <FilterDropdown options={filterOptions} />
        )}
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within/input:text-primary transition-colors">
            <Search size={16} />
          </div>
          <Input
            type="text"
            placeholder="Buscar..."
            className="w-[200px] h-9 pl-9 bg-background border-input shadow-sm rounded-lg text-sm transition-shadow focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0"
          />
        </div>
        {showAddButton && (onAddClick ?? (
          <Button className="h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all font-medium text-sm flex items-center gap-2">
            <Plus size={16} />
            Agregar
          </Button>
        ))}
      </div>
    </header>
  );
}
