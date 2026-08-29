export default function DashboardSidebar() {
	return (
		<div className="app-body-navigation">
			<nav className="navigation">
				<a href="#" className="active">
					<i className="ph-browsers"></i>
					<span>Dashboard</span>
				</a>
				<a href="#">
					<i className="ph-check-square"></i>
					<span>Events</span>
				</a>
				<a href="#">
					<i className="ph-users"></i>
					<span>Attendees</span>
				</a>
				<a href="#">
					<i className="ph-file-text"></i>
					<span>Reports</span>
				</a>
				<a href="#">
					<i className="ph-globe"></i>
					<span>Settings</span>
				</a>
			</nav>
			<footer className="footer">
				<h1>EventOne<small>©</small></h1>
				<div>
					EventOne ©<br />
					All Rights Reserved 2026
				</div>
			</footer>
		</div>
	);
}
