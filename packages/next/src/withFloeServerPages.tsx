import { FloeClientFactory, RenderedPostContent } from "@floe/server";

export interface FloePageProps {
  params: {
    [key in string]?: string[] | undefined;
  };
  searchParams: {
    [key in string]?: string[] | undefined;
  };
  isError: boolean;
  isNode: boolean;
  isNotFound: boolean;
  post: RenderedPostContent;
  posts: RenderedPostContent[];
  floeClient: FloeClientFactory;
}

export function withFloeServerPages(
  Component: ({
    params,
    isError,
    isNode,
    post,
    posts,
  }: FloePageProps) => Promise<JSX.Element> | JSX.Element,
  floeClient: FloeClientFactory,
  basePath = ""
) {
  // eslint-disable-next-line react/display-name
  return async ({ params }: { params: FloePageProps["params"] }) => {
    let postOrPosts: Awaited<
      ReturnType<typeof floeClient["post"]["getListOrNode"]>
    >;
    let posts: RenderedPostContent[];
    let post: RenderedPostContent;
    let isError = false;

    try {
      postOrPosts = await floeClient.post.getListOrNode(
        decodeURIComponent(
          basePath + (params.slug ? `/${params.slug.join("/")}` : "")
        )
      );
    } catch (e) {
      isError = true;
    }

    if (!isError) {
      if (postOrPosts.isNode) {
        post = postOrPosts.data as RenderedPostContent;
      } else {
        posts = postOrPosts.data as RenderedPostContent[];
      }
    }

    return (
      // @ts-ignore
      <Component
        post={post}
        posts={posts}
        params={params}
        isError={isError}
        isNotFound={!post && !posts?.length}
        isNode={postOrPosts?.isNode}
        floeClient={floeClient}
      />
    );
  };
}
