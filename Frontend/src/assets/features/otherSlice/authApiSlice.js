// authApiSlice.js
import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userRegistration: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/register",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    verifyEmailWithOtp: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/verify-email",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    requestPasswordReset: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/request-password-reset",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    verifyOtpForForgetPass: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/verify-reset-otp",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    resetPasswordForgetPass: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/change-password",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    logout: builder.query({
      query: (credentials) => ({
        url: "/api/auth/logout",
        method: "GET",
        body: credentials,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUserRegistrationMutation,
  useVerifyEmailWithOtpMutation,
  useLoginUserMutation,
  useRequestPasswordResetMutation,
  useVerifyOtpForForgetPassMutation,
  useResetPasswordForgetPassMutation,
  useChangePasswordMutation,
  useLazyLogoutQuery,
} = authApiSlice;
