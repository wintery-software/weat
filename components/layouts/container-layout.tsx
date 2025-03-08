import { ReactNode } from "react";

const ContainerLayout = ({ children }: { children: ReactNode }) => <div className="container mx-auto">{children}</div>;

export default ContainerLayout;
