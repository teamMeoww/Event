export default function DashboardRightSidebar() {
	return (
		<div className="app-body-sidebar">
			<section className="payment-section">
				<h2>Quick Actions</h2>
				<div className="payment-section-header">
					<p>Manage Event Status</p>
				</div>
				<div className="payments">
					<div className="payment">
						<div className="card green">
							<span>Active</span>
							<span>Tech Conf</span>
						</div>
						<div className="payment-details">
							<h3>Revenue</h3>
							<div>
								<span>$ 2,110</span>
								<button className="icon-button">
									<i className="ph-caret-right-bold"></i>
								</button>
							</div>
						</div>
					</div>
					<div className="payment">
						<div className="card olive">
							<span>Draft</span>
							<span>Music Fest</span>
						</div>
						<div className="payment-details">
							<h3>Revenue</h3>
							<div>
								<span>$ 0</span>
								<button className="icon-button">
									<i className="ph-caret-right-bold"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="faq">
					<p>Quick Help</p>
					<div>
						<label>Search docs</label>
						<input type="text" placeholder="Type here" />
					</div>
				</div>
				<div className="payment-section-footer">
					<button className="save-button">
						New Event
					</button>
					<button className="settings-button">
						<i className="ph-gear"></i>
						<span>More settings</span>
					</button>
				</div>
			</section>
		</div>
	);
}
