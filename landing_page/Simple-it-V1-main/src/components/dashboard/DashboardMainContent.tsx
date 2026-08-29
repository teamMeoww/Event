"use client";

import React, { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useCheckinStream } from '@/hooks/useCheckinStream';

export default function DashboardMainContent() {
	const { events, loading } = useEvents();
	
	// For demonstration, we'll connect to the first event's stream if available
	const activeEventId = events.length > 0 ? events[0].id : undefined;
	const checkins = useCheckinStream(activeEventId);

	return (
		<div className="app-body-main-content">
			<section className="service-section">
				<h2>Recent Events</h2>
				<div className="service-section-header">
					<div className="search-field">
						<i className="ph-magnifying-glass"></i>
						<input type="text" placeholder="Search events..." />
					</div>
					<div className="dropdown-field">
						<select>
							<option>All Events</option>
							<option>Upcoming</option>
							<option>Past</option>
						</select>
						<i className="ph-caret-down"></i>
					</div>
					<button className="flat-button">
						Search
					</button>
				</div>
				<div className="mobile-only">
					<button className="flat-button">
						Toggle search
					</button>
				</div>
				<div className="tiles">
					{loading ? (
						<p>Loading events...</p>
					) : events.length === 0 ? (
						<p>No events found.</p>
					) : (
						events.map((evt) => (
							<article className="tile" key={evt.id}>
								<div className="tile-header">
									<i className="ph-calendar-blank"></i>
									<h3>
										<span>{evt.name}</span>
										<span>{evt.location}</span>
									</h3>
								</div>
								<a href="#">
									<span>View details</span>
									<span className="icon-button">
										<i className="ph-caret-right-bold"></i>
									</span>
								</a>
							</article>
						))
					)}
				</div>
				<div className="service-section-footer">
					<p>Manage and track all your event metrics here.</p>
				</div>
			</section>
			<section className="transfer-section">
				<div className="transfer-section-header">
					<h2>Recent Registrations (Live)</h2>
					<div className="filter-options">
						<p>Showing latest for {events[0]?.name || "Active Event"}</p>
						<button className="icon-button">
							<i className="ph-funnel"></i>
						</button>
						<button className="icon-button">
							<i className="ph-plus"></i>
						</button>
					</div>
				</div>
				<div className="transfers">
					{checkins.length === 0 ? (
						<p style={{ padding: "1rem" }}>Waiting for real-time check-ins...</p>
					) : (
						checkins.map((checkin) => (
							<div className="transfer" key={checkin.id}>
								<div className="transfer-logo">
									<img src="https://assets.codepen.io/285131/apple.svg" alt="user" />
								</div>
								<dl className="transfer-details">
									<div>
										<dt>{checkin.participantName}</dt>
										<dd>Participant</dd>
									</div>
									<div>
										<dt>{checkin.ticketType}</dt>
										<dd>Ticket Type</dd>
									</div>
									<div>
										<dt>{checkin.timestamp.toLocaleTimeString()}</dt>
										<dd>Time</dd>
									</div>
								</dl>
								<div className="transfer-number" style={{ color: "var(--c-green)" }}>
									{checkin.status}
								</div>
							</div>
						))
					)}
				</div>
			</section>
		</div>
	);
}

