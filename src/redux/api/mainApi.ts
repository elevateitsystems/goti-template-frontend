import Cookies from "js-cookie";
import { URL } from "@/lib/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";

const tags = ["user", "player", "play", "card", "video", "reviewRequest", "testimonial", "homepage", "notificationPreference"];

export const mainApi = createApi({
  reducerPath: "mainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.api}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = (state as any).auth?.token || Cookies.get("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    },
  }),
  tagTypes: tags,
  endpoints: () => ({}),
});

export default mainApi;
