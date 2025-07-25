import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { ProductProvider } from "./sections/register/ProductContext";
import { TaskProvider } from "./sections/tasks/TaskContext";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <ProductProvider>
      <TaskProvider>
        <div className="min-h-screen bg-[#f5f6fa] flex">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </TaskProvider>
    </ProductProvider>
  );
} 