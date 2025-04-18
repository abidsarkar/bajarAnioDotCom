import { apiSlice } from "../api/apiSlice";
export const friendsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewFriends: builder.mutation({
      query: (email) => ({
        url: "/api/friends/send-friend-request",
        method: "POST",
        body: email,
        credentials: "include",
      }),
    }),
    deleteFriends: builder.mutation({
      query: (employeeID) => ({
        url: `/api/friends/remove/${employeeID}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    acceptFriends: builder.mutation({
      query: (updatedData) => ({
        url: "/api/friends/respond",
        method: "PUT",
        body: updatedData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAddNewFriendsMutation,
  useDeleteFriendsMutation,
  useAcceptFriendsMutation,
} = friendsApiSlice;
