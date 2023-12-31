import { useConfig } from "nextra-theme-docs";

export default {
  logo: <span>Floe Documentation</span>,
  project: {
    link: "https://github.com/Floe-dev/floe",
  },
  head: function useHead() {
    const { title } = useConfig();

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content="Floe documentation." />
        <meta name="og:description" content="Floe documentation." />

        <meta name="og:title" content={title ? title + " – Floe" : "Floe"} />
        <meta name="apple-mobile-web-app-title" content="Floe" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </>
    );
  },
};
