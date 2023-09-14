import I from "next/image";

export const Image = ({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) => (
  <div className="relative m-0 mt-2">
    <I
      src={src}
      alt={alt ?? ""}
      width="0"
      height="0"
      sizes="100vw"
      className="w-auto h-auto mx-auto rounded-xl"
    />
    <p className="-mt-4 text-center gray-500 dark:text-gray-400">{caption}</p>
  </div>
);
