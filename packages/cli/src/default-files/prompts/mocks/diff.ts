export default `diff --git a/pages/index.tsx b/pages/index.tsx
index 3672ee3..12671ae 100644
--- a/pages/index.tsx
+++ b/pages/index.tsx
@@ -29,7 +29,7 @@ export async function getStaticProps() {

- // It would probably be more correct to use Webpack (like here: https://ianmitchell.dev/blog/building-a-nextjs-blog-rss)
- // But this is just a lot easier, and less code
- await generateRssFeed();`;
