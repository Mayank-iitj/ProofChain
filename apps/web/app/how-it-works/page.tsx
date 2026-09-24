import MarketingLayout from "../../components/ui/MarketingLayout";

export default function Page() {
  return (
    <MarketingLayout>
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-48 pb-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <h1 
          className="text-[4rem] md:text-[5rem] lg:text-[6rem] leading-[1.05] tracking-tight mb-8 drop-shadow-2xl"
          style={{"fontFamily": "Georgia, 'Times New Roman', Times, serif"}}
        >
          How it Works
        </h1>
        <p className="text-[18px] md:text-[20px] text-white/70 max-w-2xl mx-auto mb-14 tracking-wide font-light leading-relaxed">
          Discover the intelligent pipeline behind our verifiable fact-checking.
        </p>
      </section>
    </MarketingLayout>
  );
}
