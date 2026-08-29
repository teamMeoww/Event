import "./dashboard.css";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="app">
			<DashboardHeader />
			{children}
		</div>
	);
}
