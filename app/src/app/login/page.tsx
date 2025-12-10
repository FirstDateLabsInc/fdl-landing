export default function LoginPage() {
  return (
    <div className="bg-[#fffdf6]">
      <section className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-4xl flex-col gap-8 px-4 pt-10 pb-14 sm:px-6 md:pt-12 md:pb-16 lg:px-8">
        <header className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.35em] text-slate-500 uppercase">
            Login
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl">
            Welcome back
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Authentication experience coming soon. We&apos;ll notify early
            access customers when accounts are ready.
          </p>
        </header>
      </section>
    </div>
  );
}
