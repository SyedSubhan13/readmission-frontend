
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AccountType = 'personal' | 'organization';

interface AccountTypeSelectorProps {
  selectedType: AccountType;
  onChange: (type: AccountType) => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({
  selectedType,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 animate-scale-in">
      <Button
        type="button"
        variant="outline"
        className={cn(
          'h-auto py-6 flex flex-col items-center justify-center border-2 transition-all duration-300',
          selectedType === 'personal'
            ? 'bg-primary/10 border-primary'
            : 'hover:bg-secondary'
        )}
        onClick={() => onChange('personal')}
      >
        <User
          size={24}
          className={cn(
            'mb-2 transition-all duration-300',
            selectedType === 'personal' ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <span className="font-medium">Personal</span>
        <span className="text-xs text-muted-foreground mt-1">Individual use</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        className={cn(
          'h-auto py-6 flex flex-col items-center justify-center border-2 transition-all duration-300',
          selectedType === 'organization'
            ? 'bg-primary/10 border-primary'
            : 'hover:bg-secondary'
        )}
        onClick={() => onChange('organization')}
      >
        <Building2
          size={24}
          className={cn(
            'mb-2 transition-all duration-300',
            selectedType === 'organization' ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <span className="font-medium">Organization</span>
        <span className="text-xs text-muted-foreground mt-1">Hospitals, clinics</span>
      </Button>
    </div>
  );
};

export default AccountTypeSelector;
