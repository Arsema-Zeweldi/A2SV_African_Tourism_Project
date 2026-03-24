import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiPackage {
  package_id: string;
  creator_id: string;
  itinerary_id: string;
  title: string;
  summary: string;
  description: string;
  price: number;
  status: string;
  rating_avg: number;
  reviews_count: number;
  views_count: number;
  country: string;
  location: string;
  currency: string;
  image_url: string;
  duration_days: number;
  category: string;
  group_size: string;
  created_at: string;
  updated_at: string;
}

export interface PackagesFeedResponse {
  data: ApiPackage[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    sort_by: string;
    order: string;
  };
}

export type FeedParams = Record<string, unknown>;

export const getPackagesFeed = async (params: FeedParams = {}): Promise<PackagesFeedResponse> => {
  const response = await axios.get(`${API_URL}/packages`, { params });
  return response.data;
};

export const getPackage = async (id: string): Promise<ApiPackage> => {
  const response = await axios.get(`${API_URL}/packages/${id}`);
  return response.data;
};
