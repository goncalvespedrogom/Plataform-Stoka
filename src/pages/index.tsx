import Sidebar from "../components/Sidebar";
import PlatformLayout from "../components/PlatformLayout";
import { useSEO } from "../hooks/useSEO";

function HomePage() {
  const { SEOHead } = useSEO();

  return (
    <>
      <SEOHead />
      <div className="flex-1"></div>
    </>
  );
}

HomePage.getLayout = function getLayout(page: React.ReactNode) {
  return <PlatformLayout>{page}</PlatformLayout>;
};

export default HomePage;
