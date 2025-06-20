import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      <Sidebar />
      <main className="flex-1"></main>
    </div>
  );
}
