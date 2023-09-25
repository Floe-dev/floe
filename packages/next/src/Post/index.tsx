"use client";

import NextImage from "next/image";
import { RootProps } from "./types";
import { useRootElement, RootElementContext } from "./context";
import { useQuery, useMutation, useQueryClient } from "react-query";
import React, { useContext, useState } from "react";

export const baseURL =
  process.env.NEXT_PUBLIC_FLOE_BASE_URL ?? "https://api.floe.dev/";

async function fetchReactions(datasourceId: string, filename: string) {
  const urlSearchParams = new URLSearchParams({
    datasourceId,
    filename,
  });

  const data = await fetch(`${baseURL}v1/reactions/count?${urlSearchParams}`, {
    method: "GET",
  });

  return data.json();
}

async function postReaction(
  datasourceId: string,
  filename: string,
  type: string,
  value: boolean
) {
  const data = await fetch(`${baseURL}v1/reactions`, {
    method: "PUT",
    body: JSON.stringify({
      type,
      value,
      filename,
      datasourceId,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return data.json();
}

const Root = (props: RootProps) => (
  <RootElementContext.Provider value={{ ...props }}>
    {props.children}
  </RootElementContext.Provider>
);

const Date = ({ className }: { className?: string }) => {
  const { post } = useRootElement();

  if (!post.metadata.date) {
    return undefined;
  }

  return <div className={className}>{post.metadata.date}</div>;
};

const Title = ({ className }: { className?: string }) => {
  const { post } = useRootElement();

  if (!post.metadata.title) {
    return undefined;
  }

  return <h3 className={className}>{post.metadata.title}</h3>;
};

const SubTitle = ({ className }: { className?: string }) => {
  const { post } = useRootElement();

  if (!post.metadata.subtitle) {
    return undefined;
  }

  return <h3 className={className}>{post.metadata.subtitle}</h3>;
};

type AuthorContext = {
  name: string;
  avatar: string;
  username: string;
};

const AuthorContext = React.createContext<AuthorContext>({} as AuthorContext);
const useAuthor = () => useContext(AuthorContext);
const Author = ({
  author,
  children,
  className,
}: {
  author: AuthorContext;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <AuthorContext.Provider value={author}>{children}</AuthorContext.Provider>
    </div>
  );
};

const AuthorName = ({ className }: { className?: string }) => {
  const { name } = useAuthor();

  return <div className={className}>{name}</div>;
};

const AuthorUsername = ({ className }: { className?: string }) => {
  const { username } = useAuthor();

  return <div className={className}>{username}</div>;
};

const AuthorAvatar = ({ className }: { className?: string }) => {
  const { avatar } = useAuthor();

  return (
    <div className={className}>
      <NextImage
        fill
        alt="Avatar"
        src={avatar}
        style={{
          margin: 0,
          objectFit: "cover",
        }}
      />
    </div>
  );
};

const Content = ({ className }: { className?: string }) => {
  const { post } = useRootElement();
  return <div className={className}>{post.content}</div>;
};

type ImageContext = {
  imageError: boolean;
  imageLoaded: boolean;
};

const ImageContext = React.createContext<ImageContext>({} as ImageContext);
const useImage = () => useContext(ImageContext);

const Image = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const { post } = useRootElement();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!post.metadata.image) {
    return undefined;
  }

  return (
    <div className={className}>
      <ImageContext.Provider
        value={{
          imageError,
          imageLoaded,
        }}
      >
        {children}
      </ImageContext.Provider>
      {!imageError && (
        <NextImage
          fill
          alt="post image"
          src={post.metadata.image}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            margin: 0,
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};

const ImagePlaceholder = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { imageLoaded } = useImage();

  if (!imageLoaded) {
    return <div className={className}>{children}</div>;
  }

  return undefined;
};

const ImageError = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { imageError } = useImage();

  if (!imageError) {
    return undefined;
  }

  return <div className={className}>{children}</div>;
};

// type ReactionsContext = {
//   queryKey: any[];
//   reactions: {
//     type: keyof ReactionsProps["reactions"];
//     count: number;
//   }[];
//   userReactions: {
//     type: keyof ReactionsProps["reactions"];
//     value: boolean;
//   }[];
// };

// const ReactionsContext = React.createContext<ReactionsContext>(
//   {} as ReactionsContext
// );
// const useReactions = () => useContext(ReactionsContext);

// const Reactions = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   const { post } = useRootElement();
//   const queryKey = [
//     "reactions",
//     {
//       datasourceId: post.datasourceId,
//       filename: post.filename,
//     },
//   ];
//   const { data, isLoading, isError, error } = useQuery<ReactionsResponse>(
//     queryKey,
//     async () => {
//       const response = await fetchReactions(post.datasourceId, post.filename);

//       return response;
//     }
//   );

//   return (
//     <div className={className}>
//       <ReactionsContext.Provider
//         value={{
//           queryKey,
//           reactions: data?.data?.reactions,
//           userReactions: data?.data?.userReactions,
//         }}
//       >
//         {children}
//       </ReactionsContext.Provider>
//     </div>
//   );
// };

// type ReactionContext = {
//   count: number;
//   selected: boolean;
//   type: keyof ReactionsProps["reactions"];
// };

// const ReactionContext = React.createContext<ReactionContext>(
//   {} as ReactionContext
// );
// const useReaction = () => useContext(ReactionContext);

// const Reaction = ({
//   className,
//   type,
//   children,
// }: {
//   className?: string;
//   type: keyof ReactionsProps["reactions"];
//   children: React.ReactNode;
// }) => {
//   const { reactions, userReactions } = useReactions();

//   if (!reactions) {
//     return undefined;
//   }

//   const reaction = reactions.find((r) => r.type === type);
//   const userReaction = userReactions.find((r) => r.type === type);

//   return (
//     <div className={className}>
//       <ReactionContext.Provider
//         value={{
//           type,
//           count: reaction?.count || 0,
//           selected: userReaction?.value || false,
//         }}
//       >
//         {children}
//       </ReactionContext.Provider>
//     </div>
//   );
// };

// const ReactionCount = ({ className }: { className?: string }) => {
//   const { count } = useReaction();

//   return <div className={className}>{count}</div>;
// };

// interface ReactionTriggerProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   className?: string;
//   children: React.ReactNode;
// }

// const ReactionTrigger = ({
//   children,
//   className,
//   onClick,
//   ...nativeButtonProps
// }: ReactionTriggerProps) => {
//   const queryClient = useQueryClient();
//   const { type, selected } = useReaction();
//   const { queryKey } = useReactions();
//   const { post } = useRootElement();

//   const { mutate, isLoading } = useMutation({
//     mutationFn: () =>
//       postReaction(post.datasourceId, post.filename, type, !selected),
//     onMutate: async () => {
//       // Cancel any outgoing refetches
//       // (so they don't overwrite our optimistic update)
//       await queryClient.cancelQueries({
//         queryKey,
//       });

//       // // Snapshot the previous value
//       const previousReactions = queryClient.getQueryData(
//         queryKey
//       ) as ReactionsResponse;

//       const reactionAlreadyExists = previousReactions.data.reactions.some(
//         (r) => r.type === type
//       );

//       const newReactions = reactionAlreadyExists
//         ? previousReactions.data.reactions.map((r) =>
//             r.type === type
//               ? {
//                   type,
//                   count: selected ? r.count - 1 : r.count + 1,
//                 }
//               : r
//           )
//         : [
//             ...previousReactions.data.reactions,
//             {
//               type,
//               count: 1,
//             },
//           ];

//       const newUserReactions = previousReactions.data.userReactions.map((r) =>
//         r.type === type
//           ? {
//               type,
//               value: !selected,
//             }
//           : r
//       );

//       // // Optimistically update to the new value
//       queryClient.setQueryData(queryKey, () => ({
//         data: {
//           reactions: newReactions,
//           userReactions: newUserReactions,
//         },
//       }));

//       // // Return a context object with the snapshotted value
//       return { previousReactions };
//     },
//     onError: (err, newTodo, context: any) => {
//       queryClient.setQueryData(queryKey, context.previousReactions);
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey,
//       });
//     },
//   });

//   return (
//     <button
//       className={className}
//       onClick={(e) => {
//         mutate();
//         onClick && onClick(e);
//       }}
//       disabled={isLoading}
//       {...nativeButtonProps}
//     >
//       {children}
//     </button>
//   );
// };

// const ReactionSelectedIcon = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   const { selected } = useReaction();

//   if (!selected) {
//     return undefined;
//   }

//   return <div className={className}>{children}</div>;
// };

// const ReactionUnselectedIcon = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   const { selected } = useReaction();

//   if (selected) {
//     return undefined;
//   }

//   return <div className={className}>{children}</div>;
// };

export {
  Root,
  Date,
  Title,
  SubTitle,
  Author,
  AuthorName,
  AuthorUsername,
  AuthorAvatar,
  Content,
  Image,
  ImageError,
  ImagePlaceholder,
  // Reactions,
  // Reaction,
  // ReactionCount,
  // ReactionTrigger,
  // ReactionSelectedIcon,
  // ReactionUnselectedIcon,
};
export * from "./types";
