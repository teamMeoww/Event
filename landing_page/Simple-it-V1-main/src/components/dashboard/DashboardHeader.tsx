export default function DashboardHeader() {
	return (
		<header className="app-header">
			<div className="app-header-logo">
				<div className="logo">
					<span className="logo-icon">
						<img src="https://assets.codepen.io/285131/almeria-logo.svg" alt="logo" />
					</span>
					<h1 className="logo-title">
						<span>EventOne</span>
						<span>Dashboard</span>
					</h1>
				</div>
			</div>
			<div className="app-header-navigation">
				<div className="tabs">
					<a href="#" className="active">
						Overview
					</a>
					<a href="#">
						Events
					</a>
					<a href="#">
						Registrations
					</a>
					<a href="#">
						System
					</a>
				</div>
			</div>
			<div className="app-header-actions">
				<button className="user-profile">
					<span>Admin User</span>
					<span>
						<img src="https://assets.codepen.io/285131/almeria-avatar.jpeg" alt="avatar" />
					</span>
				</button>
				<div className="app-header-actions-buttons">
					<button className="icon-button large">
						<i className="ph-magnifying-glass"></i>
					</button>
					<button className="icon-button large">
						<i className="ph-bell"></i>
					</button>
				</div>
			</div>
			<div className="app-header-mobile">
				<button className="icon-button large">
					<i className="ph-list"></i>
				</button>
			</div>
		</header>
	);
}
