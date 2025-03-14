// src/app/page.js

import { metadata } from './metadata';
import Head from 'next/head';
import Dashboard from './components/Dashboard';

export { metadata };

export default function HomePage() {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="stylesheet" href="globals.css" />
			</Head>
			<div className="desktop">
				{/* ...existing design structure... */}
				<div className="div flex flex-col h-screen">
					<div className="content flex-1 overflow-auto">
						<div className="overlap">
							<div className="rectangle"></div>
							<div className="rectangle-2"></div>
							<img className="group" src="img/group-1.png" alt="Group" />
							{/* ...other content that should scroll... */}
						</div>
					</div>
					<footer className="footer mt-auto">
						<img className="UCLA-luskin" src="img/ucla-luskin-latinodatahub.png" alt="UCLA Luskin" />
						<p className="THERE-IS-NO-AMERICAN">
							THERE IS NO AMERICAN AGENDA<br />WITHOUT A LATINO AGENDA
						</p>
						<img className="email-vector" src="img/email-vector.svg" alt="Email" />
						<img className="youtube-vector" src="img/youtube-vector.svg" alt="YouTube" />
						<img className="instagram-vector" src="img/instagram-vector.svg" alt="Instagram" />
						<img className="linkedin-vector" src="img/linkedin-vector.svg" alt="LinkedIn" />
						<img className="x-vector" src="img/x-vector.svg" alt="X" />
						<img className="facebook-vector" src="img/facebook-vector.svg" alt="Facebook" />
						<p className="home-impact-research">
							<span className="text-wrapper-39">Home<br /></span>
							<span className="text-wrapper-40"><br />Impact<br /></span>
							<span className="text-wrapper-41">
								Research<br />Press Coverage<br />Partners<br />Policy Toolkit
							</span>
						</p>
						<p className="about-FAQ-our-data">
							<span className="text-wrapper-40">About<br /></span>
							<span className="text-wrapper-41">
								FAQ<br />Our Data<br />Our Team<br />Contact<br /><br />
							</span>
							<span className="text-wrapper-39">Additional Resources</span>
						</p>
						<p className="contact-public">
							<span className="text-wrapper-40">Contact<br /></span>
							<span className="text-wrapper-42">
								3250 Public Affairs Building <br />Los Angeles, CA 90065 <br />(310) 206-8431<br /><br />
							</span>
							<span className="text-wrapper-41">latino@luskin.ucla.edu</span>
						</p>
						<img className="line-3" src="img/line-31.svg" alt="Line" />
					</footer>
				</div>
				<div className="vertical-navigation">
					<div className="overlap-2">
						<div className="rectangle-15"></div>
						<div className="text-wrapper-46">HOME</div>
						<div className="text-wrapper-47">IMPACT</div>
						<div className="text-wrapper-48">ABOUT</div>
						<div className="ADDITIONAL-RESOURCES">
							ADDITIONAL<br />RESOURCES
						</div>
						<div className="rectangle-16"></div>
						<div className="rectangle-17"></div>
						<div className="text-wrapper-49">CA</div>
						<div className="text-wrapper-50">LATINO</div>
						<div className="climate-health">climate &amp; health<br />dashboard</div>
						<div className="connect-with-us">
							<div className="social-media-buttons">
								<div className="email-button">
									<img className="img-2" src="img/email-vector-1.svg" alt="Email" />
								</div>
								<div className="youtube-button">
									<img className="img-2" src="img/youtube-vector-1.svg" alt="YouTube" />
								</div>
								<div className="instagram-button">
									<img className="img-3" src="img/instagram-vector-1.svg" alt="Instagram" />
								</div>
								<div className="linkedin-button">
									<img className="img-3" src="img/linkedin-vector-1.svg" alt="LinkedIn" />
								</div>
								<div className="x-button">
									<img className="x-vector-2" src="img/x-vector-1.svg" alt="X" />
								</div>
								<div className="facebook-button">
									<img className="facebook-vector-2" src="img/facebook-vector-1.svg" alt="Facebook" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}