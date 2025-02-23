function LocalQuote() {
  return (
    <div className="text-center">
      <p className="text-lg font-medium text-muted-foreground px-4 md:px-0 md:w-2/3 mx-auto">
        &ldquo;The future belongs to those who
        <span className="font-pacifico text-2xl mx-2">believe</span> in the
        power of their dreams.&rdquo;
      </p>
    </div>
  );
}

export const LeadMagnet = () => {
  return (
    <section className="mt-12 w-full py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-8 mx-auto">
            <div className="relative justify-center isolate flex flex-col gap-10 px-4">
              <div className="text-center flex flex-col">
                <h2 className="text-balance text-2xl md:text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:flex-auto">
                  Ready to Find Your Future?
                </h2>
                <span className="md:mt-4 text-balance text-lg md:text-2xl font-semibold tracking-tight text-white">
                  Let AI guide you up the career ladder.
                </span>
              </div>
              <LocalQuote /> {/* Simplified Quote component below */}
              <a
                href="/predict"
                className="mx-auto inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Predict My Career Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Simplified Quote component for this context
function Quote() {
  return (
    <div className="text-center">
      <p className="text-lg font-medium text-muted-foreground px-4 md:px-0 md:w-2/3 mx-auto">
        &ldquo;The future belongs to those who
        <span className="font-pacifico text-2xl mx-2">believe</span> in the
        power of their dreams.&rdquo;
      </p>
    </div>
  );
}
