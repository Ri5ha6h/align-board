import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProviderWrapper from "@/custom-wrappers/query-provider-wrapper";

interface RootProps {
	children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Alignbits Tracking",
	description: "Multi-purpose Dashboard",
};

export default function RootLayout({ children }: Readonly<RootProps>) {
	return (
		<html
			className="mx-auto h-screen max-w-screen"
			lang="en"
			data-lt-installed="true"
			suppressHydrationWarning
		>
			<body className={`${inter.className} h-full`} cz-shortcut-listen="true">
				<QueryProviderWrapper>
					{children}
					<Toaster />
				</QueryProviderWrapper>
			</body>
		</html>
	);
}
