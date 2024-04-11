import {
  StandardLayout,
  StandardLayoutHeader,
} from '@/app/[locale]/layouts/standard_layout';
import { getTranslations } from 'next-intl/server';

const Page = async () => {
  const t = await getTranslations();

  return (
    <StandardLayout>
      <StandardLayoutHeader
        title={t('pages.cart.metadata.title')}
      ></StandardLayoutHeader>
    </StandardLayout>
  );
};

export default Page;
