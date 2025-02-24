"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    section: "General",
    qa: [
      {
        question: "How do I get started?",
        answer: (
          <div className="flex flex-col">
            <ul className="text-md font-medium">
              <li>1. Click Predict My Career Now on the homepage.</li>
              <br />
              <li>
                2. Fill out the form with your GPA, extracurriculars, and
                interests.
              </li>
              <br />
              <li>3. Submit to get your personalized career predictions!</li>
            </ul>
            <span className="mt-8 font-bold">
              Need help? Contact us anytime for support.
            </span>
          </div>
        ),
      },
      {
        question: "How accurate are the predictions?",
        answer: (
          <span>
            Our AI uses advanced machine learning (Random Forest, Neural
            Networks) trained on real-world data to provide reliable
            predictions. Accuracy depends on the details you provide—more info
            means better results!
          </span>
        ),
      },
      {
        question: "Who is Climb the Ladder for?",
        answer: (
          <span>
            It is designed for high school students who want clarity on their
            future careers, plus counselors and administrators looking to
            support them.
          </span>
        ),
      },
      {
        question: "How long does it take?",
        answer: (
          <span>
            Filling out the form takes about 5 minutes. Once you submit,
            predictions are generated instantly!
          </span>
        ),
      },
      {
        question: "Is there a cost?",
        answer: (
          <span>
            Climb the Ladder is free to try! We are committed to helping
            students plan their futures at no initial cost.
          </span>
        ),
      },
    ],
  },
];

export function FAQ() {
  return (
    <div className="my-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-10">
        <h3 className="text-4xl font-semibold mb-3 mt-6">
          Frequently Asked Questions
        </h3>
      </div>
      <div className="mx-auto">
        <div className="mx-auto max-w-[600px] space-y-8">
          {faqs.map((faq, idx) => (
            <section className="mt-16" key={idx} id={"faq-" + faq.section}>
              <Accordion
                type="single"
                collapsible
                className="flex w-full flex-col items-center justify-center gap-2"
              >
                {faq.qa.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={faq.question}
                    className="w-full bg-muted/50 border-none rounded-xl px-4"
                  >
                    <AccordionTrigger className="font-semibold text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
