import React from "react";
import AmorphousBlob from "@/components/AmorphousBlob";
import { getFloeClient } from "@/app/floe-client";
import { withFloeServerPages, FloePageProps } from "@floe/next";
import Link from "next/link";
import { redirect } from "next/navigation";
import DocItem from "./DocPage";
import NotFound from "@/app/NotFound";
import { MobileNav } from "./MobileNav";
import { generateMetadata as gm } from "@/utils/generateMetaData";
import { StackLayout } from "./StackLayout";
import { generateURL } from "@/utils/generateURL";
import { ListLayout } from "./ListLayout";

export const revalidate = 10;

// export const generateMetadata = gm("Docs");

async function DocsPage({
  isError,
  isNotFound,
  floeClient,
  params,
}: FloePageProps & {
  params: {
    subdomain: string;
    datasource: string;
    path: string[];
  };
}) {
  const datasource = await floeClient.datasource.get(params.datasource);

  if (isNotFound || isError) {
    return <NotFound />;
  }

  // const renderPostOrPosts = async () => {
  //   if (currentSection.stack) {
  //     const path = decodeURIComponent(
  //       [params.tab, ...(params.path ?? [])].join("/")
  //     );

  //     if (!isNode) {
  //       const redirectPage = getFirstTreeMatch(path, tree);
  //       redirect(
  //         generateURL(params.subdomain, params.datasource, redirectPage)
  //       );
  //     }

  //     return (
  //       <StackLayout tree={tree} params={params}>
  //         <DocItem doc={post} />
  //       </StackLayout>
  //     );
  //   }

  //   return (
  //     <ListLayout>
  //       {isNode ? (
  //         <div className="w-full">
  //           <DocItem doc={post} />
  //         </div>
  //       ) : (
  //         posts.map((post) => (
  //           <Link
  //             key={post.slug}
  //             href={post.slug}
  //             className="mb-2 no-underline"
  //           >
  //             <DocItem doc={post} />
  //           </Link>
  //         ))
  //       )}
  //     </ListLayout>
  //   );
  // };

  return (
    <div className="flex flex-col-reverse w-full max-w-screen-xl gap-8 px-6 pt-48 pb-8 mx-auto md:px-8 md:flex-row">
      {/* {await renderPostOrPosts()} */}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ params }: { params: any }) => {
  const floeClient = getFloeClient(params.subdomain);

  const path = decodeURIComponent(
    [params.tab, ...(params.path ?? [])].join("/")
  );

  return withFloeServerPages({
    Page: DocsPage,
    floeClient,
    path,
    datasourceSlug: params.datasource,
  })({ params });
};

function isSinglePage(
  page:
    | {
        title: string;
        page: string;
      }
    | {
        title: string;
        pages: any[];
      }
): page is {
  title: string;
  page: string;
} {
  return (
    (
      page as {
        title: string;
        page: string;
      }
    ).page !== undefined
  );
}

function getFlapMap(
  path: string,
  pages:
    | (
        | {
            title: string;
            page: string;
          }
        | {
            title: string;
            pages: any[];
          }
      )[]
): any {
  return pages.flatMap((page) => {
    if (isSinglePage(page)) {
      return page.page;
    }

    return getFlapMap(path, page.pages);
  });
}

function getFirstTreeMatch(
  path: string,
  pages:
    | (
        | {
            title: string;
            page: string;
          }
        | {
            title: string;
            pages: any[];
          }
      )[]
): any {
  const flatMap = getFlapMap(path, pages);

  return flatMap.find((page: string) => {
    return page.includes(path);
  });
}
