import { apiSlice } from "../api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteProfile: builder.mutation({
      query: () => ({
        url: "/api/profile/delete-account",
        method: "DELETE",
        credentials: "include",
      }),
    }),
    profileInformation: builder.query({
      query: () => ({
        url: "/api/profile/get-user-profile",
        method: "GET",
        credentials: "include",
      }),
    }),
    fullProfileInformation: builder.query({
      query: () => ({
        url: "/api/profile/get-full-user-information",
        method: "GET",
        credentials: "include",
      }),
    }),
    editProfileUserName: builder.mutation({
      query: (userName) => ({
        url: "/api/profile/edit-userName",
        method: "PUT",
        body: userName,
        credentials: "include",
      }),
    }),
    updateUserProfilePicture: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("profilePicture", file);
        return {
          url: "/api/profile/update-user-profile-picture",
          method: "PUT",
          body: formData,
          credentials: "include",
        };
      },
    }),

    // More admin-related endpoints
  }),
});

export const {
  useDeleteProfileMutation,
  useProfileInformationQuery,
  useFullProfileInformationQuery,
  useEditProfileUserNameMutation,
  useUpdateUserProfilePictureMutation,
} = profileApiSlice;
