import Image from "next/image";
import AvatarNic from "public/avatar-nic.jpeg";

const AUTHORS = {
  nic: {
    name: "Nic Haley",
    avatar: AvatarNic,
  },
};

interface AuthorsProps {
  authors: (keyof typeof AUTHORS)[];
}

export function Authors({ authors }: AuthorsProps) {
  return (
    <div>
      <span className="text-sm font-medium text-zinc-500">Authors</span>
      <div className="flex items-center gap-2 mt-4">
        {authors.map((author) => (
          <div className="flex items-center gap-2" key={author}>
            <Image
              alt={AUTHORS[author].name}
              className="rounded-full w-7 h-7"
              src={AUTHORS[author].avatar}
            />
            <span className="text-sm font-medium text-gray-700">
              {AUTHORS[author].name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
