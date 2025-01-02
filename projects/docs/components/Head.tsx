import {assetsSlug, description} from '../';

export function Head() {
  return (
    <>
      <meta
        name="msapplication-TileColor"
        content="#fff"
      />
      <meta
        httpEquiv="Content-Language"
        content="en"
      />
      <meta
        name="description"
        content={description}
      />
      <meta
        property="og:title"
        content={description}
      />
      <meta
        property="og:description"
        content={description}
      />
      <meta
        name="apple-mobile-web-app-title"
        content={description}
      />
      <link
        rel="icon"
        type="image/x-icon"
        href={`${assetsSlug}favicon.ico`}
      />
    </>
  );
}
