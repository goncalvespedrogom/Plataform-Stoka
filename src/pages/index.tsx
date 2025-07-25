import Sidebar from "../components/Sidebar";
import PlatformLayout from "../components/PlatformLayout";

function HomePage() {
  return <div className="flex-1"></div>;
}

HomePage.getLayout = function getLayout(page: React.ReactNode) {
  return <PlatformLayout>{page}</PlatformLayout>;
};

export default HomePage;
