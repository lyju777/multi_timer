import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);

  const { data, error } = await client
    .from("records")
    .insert([
      {
        user_id: user.id,
        duration_minutes: body.durationMinutes,
        timer_mark: body.timerMark,
        content: body.content,
        completed_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return data;
});
