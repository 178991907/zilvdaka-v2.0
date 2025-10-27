'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser, User } from '@/lib/data';
import { Avatars } from '@/lib/placeholder-images';
import Link from 'next/link';
import { CreditCard, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from './app-sidebar';
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

export function UserNav() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleProfileUpdate = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    // Initial load
    handleProfileUpdate();

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const selectedAvatar = user ? Avatars.find(img => img.id === user.avatar) : null;

  if (!user) {
    return (
        <div className="relative h-10 w-full flex items-center justify-start gap-2 px-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
            </div>
        </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-full justify-start gap-2 px-2"
        >
          <Avatar className="h-8 w-8 bg-card p-1">
            {selectedAvatar ? (
              <div dangerouslySetInnerHTML={{ __html: selectedAvatar.svg }} className="w-full h-full" />
            ) : (
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
           <div className="flex flex-col items-start truncate">
              <span className="font-semibold text-sm truncate">{user.name}</span>
               <span className="text-xs text-muted-foreground">
                <ClientOnlyT tKey="user.level" tOptions={{ level: user.level }} />
               </span>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.name.toLowerCase().replace(' ', '.')}@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <UserIcon className="mr-2 h-4 w-4" />
              <span><ClientOnlyT tKey='user.menu.profile' /></span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <CreditCard className="mr-2 h-4 w-4" />
              <span><ClientOnlyT tKey='user.menu.billing' /></span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span><ClientOnlyT tKey='user.menu.settings' /></span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            <span><ClientOnlyT tKey='user.menu.logout' /></span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
