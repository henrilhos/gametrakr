export const TITLE = "gametrakr";
export const DESCRIPTION =
  "Show everyone what games you love, share your thoughts and experiences and connect with a passionate gaming community.";

export const defaultMetadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://gametra.kr"),
};

export const twitterMetadata = {
  title: TITLE,
  description: DESCRIPTION,
  card: "summary_large_image",
  images: [`/api/og`],
};

export const ogMetadata = {
  title: TITLE,
  description: DESCRIPTION,
  card: "website",
  images: [`/api/og`],
};
