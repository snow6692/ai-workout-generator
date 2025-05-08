import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background overflow-hidden">
      <section className="relative z-10 py-16 md:py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <div>
                  <span className="text-blue-600">Transform</span>
                </div>
                <div>
                  <span className="text-orange-500">Your Body</span>
                </div>
                <div className="pt-1">
                  <span className="text-blue-600">With AI</span>
                </div>
                <div className="pt-1">
                  <span className="text-orange-500">Technology</span>
                </div>
              </h1>

              {/* SEPARATOR LINE */}
              <div className="h-px w-1/2 bg-gradient-to-r from-blue-600 to-orange-500"></div>

              <p className="text-lg text-muted-foreground md:w-3/4">
                Chat with our AI assistant to get personalized workout plans and
                diet routines tailored to your goals.
              </p>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 py-4 font-mono text-sm">
                <div className="flex flex-col">
                  <div className="text-xl text-blue-600">500+</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Active Users
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xl text-blue-600">3min</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Generation
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xl text-blue-600">100%</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Personalized
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="pt-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-5 text-base font-mono"
                >
                  <Link href="/generate-program" className="flex items-center">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-5 relative">
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600/20 to-orange-500/20">
                  <Image
                    src="/home.jpg"
                    alt="AI Fitness Coach"
                    className="size-full object-cover object-center"
                    width={500}
                    height={500}
                  />

                  {/* SCAN LINE */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),#3b82f6_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                  {/* DECORATIVE CIRCLE */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-orange-500/40 rounded-full" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                {/* TERMINAL OVERLAY */}
                <TerminalOverlay />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
