import {
  LanguageSwitchIcon,
  LanguageSwitchSelect,
} from '@/components/navbar/language_switch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  IconGhost2,
  IconMenu2,
  IconSearch,
  IconUserCircle,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

const links = ['restaurants', 'groceries', 'marketplace'];

const Navbar = () => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:shrink-0 md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <IconGhost2 size={24} />
          <span>{t('metadata.name')}</span>
        </Link>
        {links.map((link, index) => {
          const href = `/${link}`;

          return (
            <Link
              key={index}
              href={href}
              className={cn(
                'transition-colors hover:text-foreground',
                pathname === href ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {/* @ts-ignore */}
              {t(`navbar.links.${link}`)}
            </Link>
          );
        })}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <IconMenu2 size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <IconGhost2 size={24} />
              <span>{t('metadata.name')}</span>
            </Link>
            {links.map((link) => {
              const href = `/${link}`;

              return (
                <Link
                  key={link}
                  href={href}
                  className={cn(
                    'hover:text-foreground',
                    pathname === href ? '' : 'text-muted-foreground',
                  )}
                >
                  {/* @ts-ignore */}
                  {t(`navbar.links.${link}`)}
                </Link>
              );
            })}
          </nav>
          <SheetFooter className="mt-auto">
            <LanguageSwitchSelect />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('navbar.search')}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <div className="hidden md:flex">
          <LanguageSwitchIcon />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconUserCircle size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{`{user.email}`}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="hover:cursor-pointer">
              <Link href="/settings">{t('navbar.user.settings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:cursor-pointer">
              <Link href="/support">{t('navbar.user.support')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                alert('Not implemented');
              }}
            >
              <Link href="/logout">{t('navbar.user.sign_out')}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
