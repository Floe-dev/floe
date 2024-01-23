import Video from "next-video";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CIExample from "public/ci-example.png";
import Video1 from "videos/custom-rules.mp4";
import Video2 from "videos/review-fix.mp4";
import colors from "tailwindcss/colors";

const media = [
  {
    key: "1",
    element: (
      <Video accentColor={colors.amber[500]} className="flex" src={Video1} />
    ),
    description: "✍️ Write your own custom rules. In plain English.",
  },
  {
    key: "2",
    element: (
      <Video accentColor={colors.amber[500]} className="flex" src={Video2} />
    ),
    description: "🔧 Review and apply fixes automatically.",
  },
  {
    key: "3",
    element: (
      <Image
        alt="CI example"
        className="object-cover w-full h-full"
        src={CIExample}
      />
    ),
    description: "🔄 Run reviews in CI and apply suggestions.",
  },
];

export function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;

      setSelectedIndex(index);
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="-mx-6 md:mx-0">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {media.map((item) => (
            <div
              className="relative h-full flex-[0_0_100%] py-8 sm:px-8"
              key={item.key}
            >
              <div className="relative overflow-hidden shadow-lg sm:rounded-xl">
                <div className="absolute top-0 z-10 w-full px-3 py-2 text-sm text-center text-white sm:text-md h-fit bg-zinc-900/50 backdrop-filter backdrop-blur-lg">
                  {item.description}
                </div>
                {item.element}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {media.map((item, index) => (
          <button
            className={`w-3.5 h-3.5 border-2 rounded-full border-zinc-900 ${
              selectedIndex === index ? "!bg-zinc-900" : ""
            }`}
            key={item.key}
            onClick={() => {
              scrollTo(index);
            }}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
