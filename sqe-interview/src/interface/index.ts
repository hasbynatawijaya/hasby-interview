export type IProduct = {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  rating: number;
  price: number;
};

export type ICategory = {
  slug: string;
  name: string;
  url: string;
};
