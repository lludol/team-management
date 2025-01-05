import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";

export const metadata: Metadata = {
	title: "Team management",
	description: "Exmaple of a team management webapp",
};

export default function RootLayout({
	children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-screen">
			<body
				className="min-h-full flex"
			>
				<Menu/>
				<div className="flex items-stretch justify-stretch flex-1 px-8 py-4 ">
					{children}
				</div>
			</body>
		</html>
	);
}
