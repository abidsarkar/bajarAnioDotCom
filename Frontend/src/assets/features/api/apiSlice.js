import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BACKEND_URL; // dynamic env-based backend

export const apiSlice = createApi({
  reducerPath: "api", // optional: can be renamed, but "api" is fine
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include', // sends cookies on cross-origin requests
  }),
  endpoints: (builder) => ({}), // extend this in other slices
});
