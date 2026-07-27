import { useEffect, useState } from "react";
import { type ICategory, type IProduct } from "./interface";
import {
  fetchCategoriesApi,
  fetchProductsApi,
  fetchProductsByCategoriesApi,
  searchProductsApi,
} from "./api";
import { useDebounce } from "./useDebounce";

const HEADERS = ["Title", "Price", "Category", "Thumbnail", "Rating"];

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState<string>("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const fetchProducts = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const res = await fetchProductsApi(signal);

      setProducts(res.products);
      setError("");
    } catch (error) {
      if (signal?.aborted) return;
      setError((error as Error)?.message);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  const searchProducts = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const res = await searchProductsApi(debouncedQuery, signal);
      setProducts(res.products);
      setError("");
    } catch (error) {
      if (signal?.aborted) return;
      setError((error as Error)?.message);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  const fetchCategories = async (signal?: AbortSignal) => {
    try {
      const res = await fetchCategoriesApi(signal);

      setCategories(res);
      setError("");
    } catch (error) {
      if (signal?.aborted) return;
      setError((error as Error)?.message);
    }
  };

  const searchProductsByCategory = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const res = await fetchProductsByCategoriesApi(category, signal);
      setProducts(res.products);
      setError("");
    } catch (error) {
      if (signal?.aborted) return;
      setError((error as Error)?.message);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (debouncedQuery) {
      searchProducts(controller.signal);
    } else if (category) {
      searchProductsByCategory(controller.signal);
    } else fetchProducts(controller.signal);

    return () => controller.abort();
  }, [debouncedQuery, category]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <label>
        <span>category</span>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setQuery("");
          }}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option value={category.slug} key={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span> Search</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCategory("");
          }}
        />
      </label>
      <table>
        <thead>
          <tr>
            {HEADERS.map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={HEADERS.length}>Loading...</td>
            </tr>
          ) : error !== "" ? (
            <tr>
              <td colSpan={HEADERS.length} style={{ color: "red" }}>
                {error}
              </td>
            </tr>
          ) : (
            <>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <img src={product.thumbnail} />
                  </td>
                  <td>{product.rating}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
