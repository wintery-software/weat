import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Link } from '@/lib/i18n/navigation';
import Image from 'next/image';

interface ImageGalleryItem {
  src: string;
  alt: string;
  href?: string;
}

interface ImageGalleryProps {
  images: ImageGalleryItem[];
  imageClassName?: string;
  width?: number;
  height?: number;
}

const ImageGallery = ({
  images,
  imageClassName = 'w-40 md:w-60',
  width = 240,
  height = 240,
}: ImageGalleryProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex gap-4 p-4">
        {images.map((r, index) => {
          const i = (
            <Image
              src={r.src}
              alt={r.alt}
              className="aspect-square h-fit w-fit object-cover"
              width={width}
              height={height}
            />
          );

          return (
            <figure key={index} className={`shrink-0 ${imageClassName}`}>
              <div className="overflow-hidden rounded-md">
                {r.href ? <Link href={r.href}>{i}</Link> : i}
              </div>
              <figcaption className="pt-2 text-xs hover:underline truncate">
                {r.href ? (
                  <Link key={index} href={r.href}>
                    {r.alt}
                  </Link>
                ) : (
                  <p>{r.alt}</p>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ImageGallery;
