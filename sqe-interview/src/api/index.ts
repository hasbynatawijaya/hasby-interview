const BASE_URL = "https://dummyjson.com";

export async function fetchProductsApi(signal?: AbortSignal) {
  const res = await fetch(`${BASE_URL}/products`, { signal });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function searchProductsApi(q: string, signal?: AbortSignal) {
  const res = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(q)}`,
    { signal },
  );
  if (!res.ok) throw new Error("Failed to search product");
  return res.json();
}

export async function fetchCategoriesApi(signal?: AbortSignal) {
  const res = await fetch(`${BASE_URL}/products/categories`, { signal });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchProductsByCategoriesApi(
  category: string,
  signal?: AbortSignal,
) {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`,
    { signal },
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
