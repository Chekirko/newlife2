import ChurchHeader from "@/components/ChurchHeader";
import ChurchFooter from "@/components/ChurchFooter";

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ChurchHeader />
      {/* pt-[92px] = top bar (44px) + main nav (~48px) — pushes content below fixed header */}
      <main className="pt-[92px]">
        {children}
      </main>
      <ChurchFooter />
    </>
  );
}
