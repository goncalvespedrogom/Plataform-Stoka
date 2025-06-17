import Sidebar from "../components/dashboard/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar />
      <main className="flex-1"></main>
    </div>
  );
}
