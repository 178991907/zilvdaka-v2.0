
'use client';
import { Pets, PetInfo } from '@/lib/pets';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock } from 'lucide-react';
import { useMemo } from 'react';

interface PetPickerProps {
  selectedPet: string;
  onSelectPet: (id: string) => void;
  userLevel: number;
}

export default function PetPicker({ selectedPet, onSelectPet, userLevel }: PetPickerProps) {
  
  const unlockedPetIds = useMemo(() => {
    return new Set(Pets.filter(p => userLevel >= p.unlockLevel).map(p => p.id));
  }, [userLevel]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4">
      {Pets.map((pet) => {
        const isUnlocked = unlockedPetIds.has(pet.id);
        return (
          <div
            key={pet.id}
            className={cn(
              'relative rounded-lg border-2 transition-all aspect-square w-full p-2 bg-card',
              selectedPet === pet.id ? 'border-primary' : 'border-transparent',
              isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
            onClick={() => isUnlocked && onSelectPet(pet.id)}
            role="button"
            aria-label={`Select ${pet.name} pet`}
            aria-disabled={!isUnlocked}
          >
            <div dangerouslySetInnerHTML={{ __html: pet.getSvg(0) }} className="w-full h-full" />
            
            {!isUnlocked && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center text-white">
                    <Lock className="h-6 w-6" />
                    <span className="text-xs font-bold mt-1">Lv. {pet.unlockLevel}</span>
                </div>
            )}
            
            {selectedPet === pet.id && (
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
}

    
