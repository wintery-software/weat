import { AdminLayoutWrapper } from "@/components/pages/admin/admin-sidebar-wrapper";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;

export default AdminLayout;
