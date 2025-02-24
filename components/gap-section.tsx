export const GapSection = () => {
  return (
    <section className="mt-32 relative flex items-center w-full flex-col gap-8 max-w-7xl mx-auto">
      <div className="relative z-10">
        <h2 className="mx-auto max-w-4xl text-balance text-center text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Too Many Choices, Too Little Clarity
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-400 sm:text-xl/8">
          High school students face overwhelming options and limited guidance
          when planning their futures.
        </p>
      </div>

      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto py-12 flex flex-col items-center gap-5 md:gap-7 px-4 md:px-0">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
            Counselors are stretched thin. Online advice is generic.{" "}
            <span className="text-white">
              Students are left guessing about their career paths.
            </span>
          </p>
          <div className="border border-neutral-700 p-6 rounded-xl w-full bg-black/30 backdrop-blur-md">
            <h3 className="text-xl md:text-2xl font-medium text-white">
              <b>The Hidden Problem: Why Students Struggle</b>
            </h3>
            <ul className="text-lg md:text-xl text-neutral-300 space-y-4 mt-4">
              <li>
                ✅ <span className="text-white">Limited guidance</span>—schools
                can&apos;t keep up.
              </li>
              <li>
                ✅ <span className="text-white">Overwhelming options</span>—too
                many paths, not enough direction.
              </li>
              <li>
                ✅ <span className="text-white">No personalization</span>
                —generic advice doesn&apos;t fit individual strengths.
              </li>
            </ul>
          </div>
          <p className="text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
            Most students are stuck in{" "}
            <span className="text-white">
              <b>a cycle of uncertainty without a clear plan.</b>
            </span>
          </p>
          <p className="text-primary font-medium text-xl md:text-2xl mt-2">
            Climb the Ladder changes that.
          </p>
        </div>
      </div>

      <div className="mt-24 md:mt-40 flex flex-col items-center justify-center w-full px-2 lg:px-0 text-center">
        <div className="flex flex-col pt-4 p-2 lg:p-0 max-w-3xl">
          <h2 className="text-3xl font-semibold mt-8 lg:mt-4 font-sfr leading-tight">
            The Fix: AI-Powered Career Predictions
          </h2>
          <p className="text-xl mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instead of guessing, our AI analyzes your GPA, extracurriculars, and
            interests to{" "}
            <span className="text-white font-semibold">
              predict your most likely career paths.
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="border border-neutral-700 p-6 rounded-xl bg-black/30 backdrop-blur-md">
            <h3 className="text-xl font-medium text-white">
              Personalized Insights
            </h3>
            <p className="text-neutral-300 mt-2">
              Tailored predictions based on your unique profile.
            </p>
          </div>
          <div className="border border-neutral-700 p-6 rounded-xl bg-black/30 backdrop-blur-md">
            <h3 className="text-xl font-medium text-white">
              Data-Driven Results
            </h3>
            <p className="text-neutral-300 mt-2">
              Powered by advanced machine learning models.
            </p>
          </div>
          <div className="border border-neutral-700 p-6 rounded-xl bg-black/30 backdrop-blur-md">
            <h3 className="text-xl font-medium text-white">Clear Next Steps</h3>
            <p className="text-neutral-300 mt-2">
              Guidance to start climbing toward your future.
            </p>
          </div>
        </div>

        <p className="text-primary font-medium text-xl md:text-2xl mt-12">
          The result? Confidence. Direction. A plan that works.
        </p>
      </div>
    </section>
  );
};
