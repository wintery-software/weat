import { I18nProps } from '@/app/[locale]/layout';
import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
} from '@/app/[locale]/layouts/standard_layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRestaurant, getRestaurantItems } from '@/lib/data';
import { generateMetadataTitle } from '@/lib/utils';
import { isEmpty } from 'lodash';
import { Metadata } from 'next';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export const generateMetadata = async ({
  params: { id, locale },
}: {
  params: { id: string } & I18nProps;
}) => {
  const restaurant = await getRestaurant(id, locale);
  const t = await getTranslations({ locale });

  return {
    title: generateMetadataTitle(
      restaurant.name,
      t('pages.restaurant.menu.metadata.title'),
    ),
  } as Metadata;
};

const Page = async ({ params }: { params: { id: string } }) => {
  const locale = useLocale();
  const restaurant = await getRestaurant(params.id, locale);
  const items = await getRestaurantItems(params.id, locale);
  const categorizedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category.name]) {
        acc[item.category.name] = [];
      }
      acc[item.category.name].push(item);
      return acc;
    },
    {} as Record<string, typeof items>,
  );
  const t = await getTranslations();

  return (
    <StandardLayout>
      <StandardLayoutBradcrumb
        items={[
          { name: t('pages.restaurants.metadata.title'), url: '/restaurants' },
          { name: restaurant.name, url: `/restaurants/${restaurant.id}` },
          { name: t('pages.restaurant.menu.metadata.title') },
        ]}
      />
      <StandardLayoutContent>
        {isEmpty(items) ? (
          <p className="text-md py-3">
            没有数据。商家可联系
            <Link
              href={`mailto:admin@wintery.io?subject=添加餐厅菜单: ${encodeURIComponent(restaurant.name)}`}
              className="text-sky-500 hover:underline"
            >
              管理员
            </Link>
            添加。
          </p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.restaurant.menu.metadata.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Accordion
                  type="multiple"
                  defaultValue={Object.keys(categorizedItems)}
                >
                  {Object.entries(categorizedItems).map(
                    ([category, categoryItems], index) => {
                      return (
                        <AccordionItem value={category} key={index}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <p className="font-bold"> {category}</p>
                              <Badge variant="outline">
                                {categoryItems.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {categoryItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex p-3 rounded-md hover:bg-stone-100 transition-all"
                              >
                                <div className="flex-1 flex flex-col gap-1 min-w-0 pr-8">
                                  <p className="font-semibold">{item.name}</p>
                                  {item.description && (
                                    <p className="text-xs text-gray-500 break-words">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex-shrink-0">
                                  <p className="text-sm">
                                    ${item.price.toString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    },
                  )}
                </Accordion>
                <p className="text-gray-500 text-xs">
                  {t('pages.restaurant.menu.menuIncorrect')}
                  {t('lang.punctuation.questionMark')}
                  {t('lang.sentenceSeparator')}
                  <Link
                    href="mailto:support@wintery.io"
                    className="text-link hover:underline"
                  >
                    {t('pages.restaurant.menu.submitCorrections')}
                  </Link>
                  {t('lang.punctuation.period')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
