import { AudioLinesIcon } from "lucide-react";
import Link from "next/link";

export default function MobileHome() {
  return (
    <div className="overflow-x-hidden relative mb-32">
      <div className="mt-24 gap-2 justify-center w-full px-2 lg:px-0">
        <div className="flex flex-col pt-4 p-2 lg:p-0 text-center  ">
          <p className="text-3xl font-semibold mt-8 lg:mt-4 font-sfr">
            Discover Your Future Career Path
          </p>
          <p className="text-xl font-semibold font-sfr text-muted-foreground">
            The most effective way to unlock your potential with AI predictions
          </p>
        </div>
        <div>
          <div className="p-8 mt-8 rounded-lg font-medium flex font-sfr sm:w-[400px] h-[300px] mx-auto">
            <div className="flex flex-col space-y-6 my-auto">
              <span className="font-semibold">Proven Strategies</span>
              <span>Analyze your GPA and interests</span>
              <span>Explore extracurricular impacts</span>
              <span>Match skills to career opportunities</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 gap-2 justify-center w-full px-2 lg:px-0">
        <div className="flex flex-col pt-4 p-2 lg:p-0 text-center  ">
          <p className="text-3xl font-semibold mt-8 lg:mt-4 font-sfr">
            Clarity is Key
          </p>
          <p className="text-xl font-semibold font-sfr text-muted-foreground">
            Find the career path that matches your unique strengths
          </p>
        </div>
        <div className="gap-4 flex flex-col p-2 mt-8">
          <div className="grid grid-cols-2 sm:w-[400px] h-[190px] mx-auto gap-4">
            <div className="border font-sfr col-span-1 rounded-lg border-4 flex flex-col w-full p-2 border-[#61D37D]/15 mx-auto rotate-2">
              <div className="h-12 w-12 rounded-full bg-[#61D37D]/35" />
              <span className="font-bold mt-3">Academic Performance</span>
              <span className="font-semibold text-[#61D37D]">
                Leverage your GPA for career insights
              </span>
            </div>
            <div className="border font-sfr col-span-1 rounded-lg border-4 flex flex-col w-full p-2 border-[#FFBE4C]/15 mx-auto -rotate-2">
              <div className="h-12 w-12 rounded-full bg-[#FFBE4C]/35" />
              <span className="font-bold mt-3">Interests</span>
              <span className="font-semibold text-[#FFBE4C]">
                Align your passions with future careers
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:w-[400px] h-[190px] mx-auto gap-4">
            <div className="border font-sfr col-span-1 rounded-lg border-4 flex flex-col w-full p-2 border-[#FF5411]/15 mx-auto -rotate-2">
              <div className="h-12 w-12 rounded-full bg-[#FF5411]/35" />
              <span className="font-bold mt-3">Extracurriculars</span>
              <span className="font-semibold text-[#FF5411]">
                Discover how activities shape your path
              </span>
            </div>
            <div className="border font-sfr col-span-1 rounded-lg border-4 flex flex-col w-full p-2 border-[#747484]/15 mx-auto rotate-2">
              <div className="h-12 w-12 rounded-full bg-[#747484]/35" />
              <span className="font-bold mt-3">Skills</span>
              <span className="font-semibold text-[#747484]">
                Highlight your talents for career matches
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 gap-2 justify-center w-full px-2 lg:px-0">
        <div className="flex flex-col pt-4 p-2 lg:p-0 text-center  ">
          <p className="text-3xl font-semibold mt-8 lg:mt-4 font-sfr">
            Confidence at No Cost
          </p>
          <p className="text-xl font-semibold font-sfr text-muted-foreground">
            Get personalized career predictions for free with AI
          </p>
        </div>
        <div>
          <div className="mt-8 rounded-lg flex sm:w-[400px] bg-[#F7FCF7] h-[300px] mx-auto">
            <div className="flex m-auto gap-2">
              <div className="h-[90px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[40px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[80px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[120px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[60px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[90px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[100px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[80px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[120px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[60px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[80px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
              <div className="h-[100px] w-[10px] bg-[#EAEFEA] rounded-lg mt-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 gap-2 justify-center w-full px-2 lg:px-0">
        <div className="flex flex-col pt-4 p-2 lg:p-0 text-center  ">
          <p className="text-3xl font-semibold mt-8 lg:mt-4 font-sfr">
            Worried About Your Future?
          </p>
          <p className="text-xl font-semibold font-sfr text-muted-foreground">
            Don’t stress—partner with us for free career guidance
          </p>
        </div>
        <div className="mt-8 flex mx-auto justify-center gap-4 h-[250px]">
          <div>
            <span className="font-semibold text-sm font-sfr">
              $1,000+ per year
            </span>
            <div className="col-span-1 rounded-lg w-[150px] bg-[#343433] h-[200px] mb-1" />
            <span className="font-semibold text-sm font-sfr">
              Career Coaches
            </span>
          </div>
          <div className="-mb-0.5 mt-auto">
            <span className="font-semibold text-sm font-sfr">Free</span>
            <div className="col-span-1 rounded-lg flex mb-1.5 w-[150px] bg-[#44C67F] h-[50px]">
              <div className="bg- h-9 w-6 flex rounded-sm m-auto">
                <AudioLinesIcon className="h-4 w-4 text-white m-auto" />
              </div>
            </div>
            <span className="font-semibold text-sm font-sfr mt-2">
              Climb the Ladder
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto justify-center flex mt-32">
        <Link href="/predict">Get Started</Link>
      </div>
    </div>
  );
}
