'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { languages as i18nLanguages } from '@/lib/i18n/i18n';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { SelectIcon } from '@radix-ui/react-select';
import { IconLanguage } from '@tabler/icons-react';
import { useLocale } from 'next-intl';
import { ReactNode } from 'react';

interface LanguageSwitchIconProps {
  icon?: ReactNode;
  languages?: Record<string, string>;
}

export const LanguageSwitchIcon = ({
  icon = <IconLanguage size={20} />,
  languages = i18nLanguages,
}: LanguageSwitchIconProps) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => router.push(pathname, { locale: value })}
        >
          {Object.entries(languages).map(([value, name], i) => (
            <DropdownMenuRadioItem key={i} value={value}>
              {name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface LanguageSwitchSelectProps {
  languages?: Record<string, string>;
}

export const LanguageSwitchSelect = ({
  languages = i18nLanguages,
}: LanguageSwitchSelectProps) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const current = languages[locale];

  return (
    <Select onValueChange={(value) => router.push(pathname, { locale: value })}>
      <SelectTrigger>
        <SelectIcon asChild>
          <IconLanguage size={16} />
        </SelectIcon>
        <SelectValue placeholder={current} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([value, name], i) => (
          <SelectItem key={i} value={value}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
