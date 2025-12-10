import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";

interface UnsubscribeResult {
  success: boolean;
  id?: string;
  error?: string;
}

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export const metadata = {
  title: "Unsubscribe - First Date Labs",
};

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  // No token provided
  if (!token) {
    return (
      <UnsubscribeLayout>
        <StatusCard
          title="Invalid Link"
          message="This unsubscribe link is invalid or has expired."
          isError
        />
      </UnsubscribeLayout>
    );
  }

  // Call database RPC
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.rpc("waitlist_unsubscribe", {
    p_token: token,
  });

  const result = data as UnsubscribeResult | null;

  // Database error or unsubscribe failed
  if (error || !result?.success) {
    return (
      <UnsubscribeLayout>
        <StatusCard
          title="Already Unsubscribed"
          message="You've already been unsubscribed or this link has expired."
          isError
        />
      </UnsubscribeLayout>
    );
  }

  // Success
  return (
    <UnsubscribeLayout>
      <StatusCard
        title="You've Been Unsubscribed"
        message="You won't receive any more emails from First Date Labs."
      />
    </UnsubscribeLayout>
  );
}

// Layout wrapper
function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4">
      {children}
    </div>
  );
}

// Status card component
function StatusCard({
  title,
  message,
  isError = false,
}: {
  title: string;
  message: string;
  isError?: boolean;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft">
      <div
        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
          isError ? "bg-red-100" : "bg-primary/20"
        }`}
      >
        {isError ? (
          <span className="text-xl">⚠️</span>
        ) : (
          <span className="text-xl">✓</span>
        )}
      </div>
      <h1 className="mb-2 text-xl font-semibold text-foreground">{title}</h1>
      <p className="mb-6 text-muted-foreground">{message}</p>
      <Link
        href="/"
        className="inline-block rounded-full bg-primary px-6 py-2.5 font-medium text-foreground transition-colors hover:bg-primary/90"
      >
        Back to Home
      </Link>
    </div>
  );
}
