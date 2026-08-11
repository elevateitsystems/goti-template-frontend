import mainApi from "./mainApi";

export type ParticipantType = "player" | "team";
export type PlayPublicationStatus = "draft" | "scheduled" | "published" | "archived";
export type PlayResult = "pending" | "win" | "loss" | "push";
export type ContentAccessLevel = "free" | "members_only";
export type PlayContentType = "straight" | "parlay" | "avoid";

export interface ParlayLeg {
  id?: string;
  participantName: string;
  sport: string;
  league: string;
  market: string;
  betType: string;
  line?: number | null;
  odds?: number | null;
  sportsbook?: string | null;
  result: PlayResult;
}

export interface PlayUpdate {
  id: string;
  message: string;
  previousLine: number | null;
  newLine: number | null;
  previousOdds: number | null;
  newOdds: number | null;
  createdAt: string;
}

export interface Play {
  id: string;
  participantType: ParticipantType | null;
  participantName: string | null;
  team: string | null;
  opponent: string | null;
  sport: string | null;
  league: string | null;
  market: string | null;
  betType: string | null;
  line: number | null;
  odds: number | null;
  originalLine: number | null;
  originalOdds: number | null;
  sportsbook: string | null;
  confidence: number | null;
  projection: number | null;
  edge: number | null;
  hitRate: number | null;
  hitFraction: string | null;
  analysis: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  isTopPlay: boolean;
  isFeatured: boolean;
  isBestBet: boolean;
  isCurrentFree: boolean;
  freeOnDate: string | null;
  accessLevel: ContentAccessLevel;
  contentType: PlayContentType;
  displayOrder: number;
  cardId: string | null;
  parlayLegs: ParlayLeg[];
  updates?: PlayUpdate[];
  publicationStatus: PlayPublicationStatus;
  result: PlayResult;
  publishedAt: string | null;
  scheduledAt: string | null;
  settledAt: string | null;
  latestUpdateNote: string | null;
  finalResultDetail: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface ResponseMeta {
  requestId: string;
  timestamp: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta: ResponseMeta;
}

export interface PaginatedPlayResponse extends ApiResponse<Play[]> {
  meta: ResponseMeta & { pagination: PaginationMeta };
}

export interface PlayOption {
  sport: string;
  leagues: string[];
}

export interface AdminPlayFilters {
  page?: number;
  limit?: number;
  search?: string;
  sport?: string;
  league?: string;
  publicationStatus?: PlayPublicationStatus | "";
  result?: PlayResult | "";
  isTopPlay?: boolean;
  isFeatured?: boolean;
}

export const playApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPlays: builder.query<PaginatedPlayResponse, AdminPlayFilters>({
      query: (filters) => ({ url: "admin/plays", params: filters }),
      providesTags: (result) => [
        { type: "play", id: "LIST" },
        ...(result?.data.map(({ id }) => ({ type: "play" as const, id })) ?? []),
      ],
    }),
    getMemberPlays: builder.query<PaginatedPlayResponse, { result?: PlayResult; contentType?: PlayContentType } | void>({
      query: (params) => ({ url: "member/plays", params: params || undefined }),
      providesTags: [{ type: "play", id: "MEMBER" }],
    }),
    getPlayOptions: builder.query<ApiResponse<PlayOption[]>, void>({
      query: () => "admin/plays/options",
      providesTags: [{ type: "play", id: "OPTIONS" }],
    }),
    createPlay: builder.mutation<ApiResponse<Play>, FormData>({
      query: (body) => ({ url: "admin/plays", method: "POST", body }),
      invalidatesTags: [
        { type: "play", id: "LIST" },
        { type: "play", id: "OPTIONS" },
      ],
    }),
    updatePlay: builder.mutation<
      ApiResponse<Play>,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `admin/plays/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "play", id },
        { type: "play", id: "LIST" },
        { type: "play", id: "OPTIONS" },
      ],
    }),
    deletePlay: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `admin/plays/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "play", id: "LIST" },
        { type: "play", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreatePlayMutation,
  useDeletePlayMutation,
  useGetAdminPlaysQuery,
  useGetMemberPlaysQuery,
  useGetPlayOptionsQuery,
  useUpdatePlayMutation,
} = playApi;
