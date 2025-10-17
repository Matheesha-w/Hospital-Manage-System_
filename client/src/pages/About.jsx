export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Hospital Management System</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">Streamlining care for modern hospitals</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600">
              We help hospitals deliver efficient, compassionate care by unifying critical operations in one secure platform.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-indigo-50 p-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v-6a3.75 3.75 0 0 0-7.5 0v6m11.356-3.606 1.263 1.154a1.125 1.125 0 0 1 0 1.668l-6.72 6.148a1.125 1.125 0 0 1-1.538 0l-6.72-6.148a1.125 1.125 0 0 1 0-1.668l1.263-1.154m12.452 3.606H4.5" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">What we do</h2>
            <p className="text-base leading-relaxed text-slate-600">
              Our platform empowers administrators, clinicians, and support staff with role-based access to the tools they need most.
              From patient intake to discharge planning, every workflow is connected through reliable integrations and real-time insights.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              With automation and smart alerts, teams stay ahead of schedule and focus on what matters: delivering excellent care.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Key capabilities</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  Comprehensive patient records with controlled access.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  Automated scheduling and notifications for staff and patients.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  Rich analytics dashboards to guide operational decisions.
                </li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Who we support</h3>
              <p className="mt-4 text-sm text-slate-600">
                Hospitals, clinics, and specialized care centers rely on the platform to simplify coordination and improve outcomes.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Our mission</h3>
              <p className="mt-4 text-sm text-slate-600">
                We believe technology should make healthcare more human. By removing friction from everyday processes,
                our system supports teams in spending more time with patients.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-indigo-600 p-6 text-indigo-50 shadow-sm">
              <h3 className="text-lg font-semibold">Built for security</h3>
              <p className="mt-3 text-sm">
                End-to-end encryption, audit trails, and granular permissions keep sensitive records safe around the clock.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-20 rounded-3xl bg-white p-10 shadow-md">
          <h2 className="text-2xl font-semibold text-slate-900">Our story</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-indigo-600">2015</p>
              <p className="mt-2 text-sm text-slate-600">Founded by hospital administrators and engineers.</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">350+</p>
              <p className="mt-2 text-sm text-slate-600">Organizations now trust the platform worldwide.</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">24/7</p>
              <p className="mt-2 text-sm text-slate-600">Specialist support team ensures continuous uptime.</p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-200 bg-indigo-50 p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-indigo-900">Ready to see it in action?</h2>
              <p className="mt-2 max-w-xl text-sm text-indigo-800">
                Schedule a walkthrough with our team to learn how the Hospital Management System can support your workflows and goals.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">
                Book a demo
              </button>
              <button className="rounded-full border border-indigo-200 px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-white">
                Explore features
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


