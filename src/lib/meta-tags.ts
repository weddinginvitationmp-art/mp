/**
 * Idempotent meta tag setter. Finds existing <meta> by property/name, or creates one.
 * Used to rewrite OG / Twitter / description tags based on current guest + language.
 */
type MetaKey = { property?: string; name?: string };

function setOne({ property, name }: MetaKey, content: string): void {
  const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (property) el.setAttribute("property", property);
    if (name) el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export interface MetaInput {
  title: string;
  description: string;
  ogImage: string;
  url: string;
}

export function applyMetaTags({ title, description, ogImage, url }: MetaInput): void {
  if (typeof document === "undefined") return;
  document.title = title;
  setOne({ name: "description" }, description);
  setOne({ property: "og:title" }, title);
  setOne({ property: "og:description" }, description);
  setOne({ property: "og:image" }, ogImage);
  setOne({ property: "og:url" }, url);
  setOne({ property: "og:type" }, "website");
  setOne({ name: "twitter:card" }, "summary_large_image");
  setOne({ name: "twitter:title" }, title);
  setOne({ name: "twitter:description" }, description);
  setOne({ name: "twitter:image" }, ogImage);
}
