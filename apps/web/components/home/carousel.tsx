"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Example1 from "public/example-1.png";
import Example2 from "public/example-2.png";

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
        <div className="flex">
          <div className="relative flex-[0_0_100%]">
            <div className="absolute px-3 py-2 text-white transform -translate-x-1/2 rounded left-1/2 bottom-20 bg-zinc-900/50 backdrop-filter backdrop-blur-lg">
              ✅ Customize rules with AI-powered linting.
            </div>
            <Image alt="Demo example 1" src={Example1} />
          </div>
          <div className="relative flex-[0_0_100%]">
            <div className="absolute px-3 py-2 text-white transform -translate-x-1/2 rounded left-1/2 bottom-20 bg-zinc-900/50 backdrop-filter backdrop-blur-lg">
              🚀 Automatically create and update content.
            </div>
            <Image alt="Demo example 1" src={Example2} />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          className={`w-3.5 h-3.5 border-2 rounded-full border-zinc-900 ${
            selectedIndex === 0 ? "!bg-zinc-900" : ""
          }`}
          onClick={() => {
            scrollTo(0);
          }}
          type="button"
        />
        <button
          className={`w-3.5 h-3.5 border-2 rounded-full border-zinc-900 ${
            selectedIndex === 1 ? "!bg-zinc-900" : ""
          }`}
          onClick={() => {
            scrollTo(1);
          }}
          type="button"
        />
      </div>
    </div>
  );
}
