import Link from "next/link";

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Career Path Predictor
      </h1>
      <Link href="/predict">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Predict my career now
        </a>
      </Link>
    </div>
  );
};
