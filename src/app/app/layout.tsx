import { requireUser } from "@/lib/auth";
import { signOut } from "@/lib/auth-actions";
import { Container } from "@/components/site/Container";

// Wraps every /app route. Requires a logged-in user (redirects to /login
// otherwise) and renders the shared authenticated shell: email, role, logout.
// Per-route role authorization lives in each page (requireRole).
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div>
      <div className="border-b-4 border-brand-ink bg-brand-ink text-brand-paper">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-mono text-brand-paper/80">{user.email}</span>
            <span className="border-2 border-brand-yellow bg-brand-yellow px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-ink">
              {user.role}
            </span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="border-2 border-brand-paper px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-paper transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              Log out
            </button>
          </form>
        </Container>
      </div>
      {children}
    </div>
  );
}
