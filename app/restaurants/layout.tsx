import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { APP_NAME } from "@/lib/constants/app";
import { type Metadata } from "next";
import { type PropsWithChildren } from "react";

const title = "发现餐厅";
const description = "发现你附近的餐厅，并查看它们的评价和评分。";

export const metadata: Metadata = {
  title: `${title} - ${APP_NAME}`,
  description,
  openGraph: { title: `${title} - ${APP_NAME}`, description, type: "website" },
  twitter: { card: "summary", title: `${title} - ${APP_NAME}`, description },
};

const Layout = ({ children }: PropsWithChildren) => (
  <NavbarLayout>{children}</NavbarLayout>
);

export default Layout;
