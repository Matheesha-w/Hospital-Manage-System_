export default function News() {
  const awards = [
    {
      id: 1,
      year: '2022',
      category: 'Healthcare Technology',
      title: 'Best Hospital Management System',
      description: 'Our system was recognized for its innovative approach to streamlining hospital operations.',
      badge: 'https://example.com/award-badge-1.png',
      presentedBy: 'Healthcare Technology Awards',
      location: 'New York, USA',
    },
    {
      id: 2,
      year: '2021',
      category: 'Digital Health',
      title: 'Most Innovative Healthcare Solution',
      description: 'Our platform was awarded for its ability to improve patient outcomes and reduce costs.',
      badge: 'https://example.com/award-badge-2.png',
      presentedBy: 'Digital Health Awards',
      location: 'London, UK',
    },
    {
      id: 3,
      year: '2020',
      category: 'Healthcare IT',
      title: 'Best Electronic Health Record System',
      description: 'Our EHR system was recognized for its user-friendly interface and robust features.',
      badge: 'https://example.com/award-badge-3.png',
      presentedBy: 'Healthcare IT Awards',
      location: 'Chicago, USA',
    },
  ];

  const pressHighlights = [
    {
      id: 1,
      title: 'Hospital Management System Partners with Leading Healthcare Provider',
      source: 'Healthcare Business News',
      date: 'February 10, 2023',
    },
    {
      id: 2,
      title: 'Our Approach to Data-Driven Care Delivery Featured in Healthcare Journal',
      source: 'Journal of Healthcare Management',
      date: 'January 20, 2023',
    },
    {
      id: 3,
      title: 'Hospital Management System Recognized as Top Healthcare Solution',
      source: 'Healthcare Technology Report',
      date: 'December 15, 2022',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">Press & Awards</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">Celebrating milestones in care innovation</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600">
              Here’s a glimpse at the recognition our Hospital Management System has earned through dedication to patient experience and operational excellence.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-rose-50 p-4 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l9.932-9.931Zm0 0L19.5 7.125M18 14v4.75A1.25 1.25 0 0 1 16.75 20H5.25A1.25 1.25 0 0 1 4 18.75V7.25A1.25 1.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="mt-16 grid gap-8 lg:grid-cols-3">
          {awards.map((award) => (
            <article key={award.id} className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600">
                  {award.year}
                </span>
                <p className="text-xs font-medium text-slate-500">{award.category}</p>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900 group-hover:text-rose-600">{award.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{award.description}</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={award.badge} alt="Award badge" className="h-10 w-10 rounded-full border border-slate-200 bg-white p-1" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{award.presentedBy}</p>
                  <p className="text-xs text-slate-500">{award.location}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-rose-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Recognized Excellence
                </div>
                <button className="text-xs font-semibold text-slate-500 transition hover:text-rose-500">View details</button>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-20 grid gap-10 rounded-3xl bg-white p-10 shadow-md md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">In the headlines</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Healthcare journals and technology outlets continue to highlight our approach to data-driven care delivery. With every new partnership, we share the lessons learned from building reliable infrastructure for busy hospitals.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              {pressHighlights.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400" />
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.source} · {item.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-3xl border border-rose-100 bg-rose-50 p-8">
            <h3 className="text-lg font-semibold text-rose-700">A note from the founders</h3>
            <p className="mt-4 text-sm leading-relaxed text-rose-800">
              “Awards are a nice reminder of the teams we support. Seeing hospitals reduce wait times, keep records secure, and return more time to patient conversations is the win that matters most.”
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-rose-500">The Hospital Management System Team</p>
          </aside>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-200 bg-slate-900 p-10 text-slate-100">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-400">Stay in the loop</p>
              <h2 className="mt-2 text-2xl font-semibold">Monthly digest from the frontlines of digital health</h2>
              <p className="mt-3 max-w-xl text-sm text-slate-300">
                Subscribe to receive highlights about platform updates, success stories, and new research that’s shaping healthcare operations.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none"
              />
              <button type="submit" className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-400">
                Join newsletter
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
