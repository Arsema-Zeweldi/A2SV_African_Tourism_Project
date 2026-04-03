'use client';

import { FormEvent, useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const inputClassName =
  "w-full rounded-2xl border border-[#E6E0DA] bg-white px-4 py-3 text-[15px] text-[#2C2825] outline-none transition-colors placeholder:text-[#9A908A] focus:border-[#F48C25]";

const SupportCenterContent = () => {
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.success("We'll get back to you soon.", {
      description: "Our support team has received your message.",
    });

    setEmail("");
    setComments("");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-[#E6E0DA] bg-white p-6 shadow-[0_18px_40px_rgba(27,20,17,0.05)] md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EDE4] text-[#F48C25]">
            <MessageSquare size={22} />
          </div>
          <div>
            <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[#201D1C]">
              Contact Support
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-[#7A716D]">
              Share what you need help with and leave the best email for a
              reply. We will review your message and follow up as soon as we
              can.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="support-email"
              className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9A908A]"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9A908A]"
              />
              <input
                id="support-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${inputClassName} pl-12`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="support-comments"
              className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9A908A]"
            >
              Comments
            </label>
            <textarea
              id="support-comments"
              required
              rows={7}
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              className={`${inputClassName} resize-none`}
              placeholder="Tell us what is going wrong, what page you were on, and anything else that would help us assist you."
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-dashed border-[#DDD2CA] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] text-[#7A716D]">
              We usually reply within 1 to 2 business days.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F48C25] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#de7b1e]"
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportCenterContent;
