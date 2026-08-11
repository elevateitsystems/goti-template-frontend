import mainApi from "./mainApi";
import type { ContentAccessLevel, Play, PlayPublicationStatus } from "./playApi";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: { usage?: ReviewUsage };
}

export interface PrimeIQCard {
  id: string;
  title: string;
  summary: string | null;
  cardDate: string;
  publicationStatus: PlayPublicationStatus;
  scheduledAt: string | null;
  plays: Play[];
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  thumbnailUrl: string | null;
  accessLevel: ContentAccessLevel;
  isCurrentFree: boolean;
  publicationStatus: PlayPublicationStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
}

export interface Testimonial {
  id: string;
  displayName: string;
  rating: number;
  reviewText: string;
  experienceContext: string | null;
  headline: string | null;
  photoUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
  publicationStatus: PlayPublicationStatus;
}

export type ReviewRequestStatus = "new" | "reviewing" | "answered";
export type ReviewVerdict = "good_to_go" | "adjust" | "pass" | "need_more_info" | "adjust_line" | "remove_leg" | "leg_concern" | "consider_alternative" | "stay_away";
export interface ReviewUsage { limit: number; used: number; remaining: number; weekStart: string }
export interface ReviewRequestLeg { id: string; participant: string; bet: string; line: number | null; sportsbook: string | null; adminNote: string | null }
export interface PersonalReviewRequest {
  id: string;
  sport: string;
  game: string;
  player: string | null;
  bet: string;
  line: number | null;
  sportsbook: string;
  question: string;
  screenshotUrl: string | null;
  submissionType: "single" | "parlay";
  legs: ReviewRequestLeg[];
  status: ReviewRequestStatus;
  verdict: ReviewVerdict | null;
  response: string | null;
  answeredAt: string | null;
  createdAt: string;
  member?: { firstName: string; lastName: string; email: string };
}

export interface HomepageContent {
  freePlay: Play | null;
  freeVideo: Video | null;
  featuredTestimonial: Testimonial | null;
  testimonials: Testimonial[];
}

export interface ReviewUsageMember extends ReviewUsage { id: string; firstName: string; lastName: string; email: string }
export interface NotificationPreferences { daily_primeiq: boolean; play_updates: boolean; review_responses: boolean }

export const contentApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomepage: builder.query<ApiResponse<HomepageContent>, void>({ query: () => "homepage", providesTags: ["homepage"] }),
    getMemberCards: builder.query<ApiResponse<PrimeIQCard[]>, void>({ query: () => "member/cards", providesTags: ["card"] }),
    getAdminCards: builder.query<ApiResponse<PrimeIQCard[]>, void>({ query: () => "admin/cards", providesTags: ["card"] }),
    createCard: builder.mutation<ApiResponse<PrimeIQCard>, Partial<PrimeIQCard>>({ query: (body) => ({ url: "admin/cards", method: "POST", body }), invalidatesTags: ["card"] }),
    updateCard: builder.mutation<ApiResponse<PrimeIQCard>, { id: string; body: Partial<PrimeIQCard> }>({ query: ({ id, body }) => ({ url: `admin/cards/${id}`, method: "PATCH", body }), invalidatesTags: ["card", "homepage"] }),
    deleteCard: builder.mutation<void, string>({ query: (id) => ({ url: `admin/cards/${id}`, method: "DELETE" }), invalidatesTags: ["card"] }),
    getMemberVideos: builder.query<ApiResponse<Video[]>, void>({ query: () => "member/videos", providesTags: ["video"] }),
    getAdminVideos: builder.query<ApiResponse<Video[]>, void>({ query: () => "admin/videos", providesTags: ["video"] }),
    createVideo: builder.mutation<ApiResponse<Video>, FormData>({ query: (body) => ({ url: "admin/videos", method: "POST", body }), invalidatesTags: ["video", "homepage"] }),
    updateVideo: builder.mutation<ApiResponse<Video>, { id: string; body: FormData }>({ query: ({ id, body }) => ({ url: `admin/videos/${id}`, method: "PATCH", body }), invalidatesTags: ["video", "homepage"] }),
    deleteVideo: builder.mutation<void, string>({ query: (id) => ({ url: `admin/videos/${id}`, method: "DELETE" }), invalidatesTags: ["video", "homepage"] }),
    getAdminTestimonials: builder.query<ApiResponse<Testimonial[]>, void>({ query: () => "admin/testimonials", providesTags: ["testimonial"] }),
    createTestimonial: builder.mutation<ApiResponse<Testimonial>, FormData>({ query: (body) => ({ url: "admin/testimonials", method: "POST", body }), invalidatesTags: ["testimonial", "homepage"] }),
    updateTestimonial: builder.mutation<ApiResponse<Testimonial>, { id: string; body: FormData }>({ query: ({ id, body }) => ({ url: `admin/testimonials/${id}`, method: "PATCH", body }), invalidatesTags: ["testimonial", "homepage"] }),
    deleteTestimonial: builder.mutation<void, string>({ query: (id) => ({ url: `admin/testimonials/${id}`, method: "DELETE" }), invalidatesTags: ["testimonial", "homepage"] }),
    getMyRequests: builder.query<ApiResponse<PersonalReviewRequest[]>, void>({ query: () => "member/review-requests", providesTags: ["reviewRequest"] }),
    createReviewRequest: builder.mutation<ApiResponse<PersonalReviewRequest>, FormData>({ query: (body) => ({ url: "member/review-requests", method: "POST", body }), invalidatesTags: ["reviewRequest"] }),
    getAdminRequests: builder.query<ApiResponse<PersonalReviewRequest[]>, ReviewRequestStatus | void>({ query: (status) => ({ url: "admin/review-requests", params: status ? { status } : undefined }), providesTags: ["reviewRequest"] }),
    getAdminReviewUsage: builder.query<ApiResponse<ReviewUsageMember[]>, void>({ query: () => "admin/review-usage", providesTags: ["reviewRequest"] }),
    answerRequest: builder.mutation<ApiResponse<PersonalReviewRequest>, { id: string; status: ReviewRequestStatus; verdict?: ReviewVerdict; response?: string; legNotes?: Array<{ id: string; adminNote: string | null }> }>({ query: ({ id, ...body }) => ({ url: `admin/review-requests/${id}`, method: "PATCH", body }), invalidatesTags: ["reviewRequest"] }),
    getNotificationPreferences: builder.query<ApiResponse<NotificationPreferences>, void>({ query: () => "member/notification-preferences", providesTags: ["notificationPreference"] }),
    updateNotificationPreferences: builder.mutation<ApiResponse<NotificationPreferences>, Partial<NotificationPreferences>>({ query: (body) => ({ url: "member/notification-preferences", method: "PATCH", body }), invalidatesTags: ["notificationPreference"] }),
  }),
});

export const {
  useAnswerRequestMutation, useCreateCardMutation, useCreateReviewRequestMutation,
  useCreateTestimonialMutation, useCreateVideoMutation, useDeleteCardMutation,
  useDeleteTestimonialMutation, useDeleteVideoMutation, useGetAdminCardsQuery,
  useGetAdminRequestsQuery, useGetAdminTestimonialsQuery, useGetAdminVideosQuery,
  useGetAdminReviewUsageQuery, useGetNotificationPreferencesQuery,
  useGetHomepageQuery, useGetMemberCardsQuery, useGetMemberVideosQuery,
  useGetMyRequestsQuery, useUpdateCardMutation, useUpdateTestimonialMutation,
  useUpdateNotificationPreferencesMutation, useUpdateVideoMutation,
} = contentApi;
