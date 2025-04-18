import { apiSlice } from "../api/apiSlice";
export const reminderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNewReminder: builder.mutation({
      query: (data) => ({
        url: "/api/reminder/create-reminder",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllReminder: builder.query({
      query: (data) => ({
        url: "/api/reminder/get-all-reminders",
        method: "GET",
        body: data,
        credentials: "include",
      }),
    }),
    getSingleReminder: builder.query({
      query: (id) => ({
        url: `/api/reminder/get-single-reminder/${id}`,
        method: "GET",
        body: id,
        credentials: "include",
      }),
    }),

    updateAReminder: builder.mutation({
      query: (id) => ({
        url: `/api/reminder/update-reminder/${id}`,
        method: "PUT",
        body: updatedData,
        credentials: "include",
      }),
    }),
    deleteReminder: builder.mutation({
      query: (id) => ({
        url: `/api/reminder/delete-reminder${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateNewReminderMutation,
  useGetAllReminderQuery,
  useGetSingleReminderQuery,
  useUpdateAReminderMutation,
  useDeleteReminderMutation,
} = reminderApiSlice;
