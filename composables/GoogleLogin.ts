import type { Database } from "#build/types/supabase-database";

export const GoogleLogin = () => {
  const supabase = useSupabaseClient<Database>();

  const user = useSupabaseUser();

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          prompt: "consent", // 매번 동의
        },
      },
    });
    if (error) console.error("Error signing in with Google:", error.message);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
    // 로그아웃 시 기록 초기화
    const historyStore = useHistoryStore();
    historyStore.records = [];
  };

  return {
    user,
    signInWithGoogle,
    signOut,
  };
};
