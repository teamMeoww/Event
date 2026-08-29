import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";
import DashboardRightSidebar from "@/components/dashboard/DashboardRightSidebar";

export default function DashboardPage() {
	return (
		<div className="app-body">
			<DashboardSidebar />
			<DashboardMainContent />
			<DashboardRightSidebar />
		</div>
	);
}
