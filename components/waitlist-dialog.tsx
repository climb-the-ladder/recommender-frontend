import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { WaitlistForm } from "./waitlist-form";

export function WaitlistDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/*     <DialogHeader className="space-y-0.5">
          <DialogTitle className="text-sm font-medium">
            Edit profile
          </DialogTitle>
          <DialogDescription className="text-xs">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader> */}
        <div className="mt-4 gap-6 flex flex-col w-full max-w-md mx-auto pt-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Join Our Waitlist</h2>
          </div>
          <WaitlistForm />
          {/*     <Button
            //onClick={() => setShowForm(false)}
            variant="ghost"
            size="sm"
            className="mt-4 mx-auto block"
          >
            ← Back
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
