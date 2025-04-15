"use client";
import React, { useState } from "react";
import styles from "./SidebarNavigation.module.css";

export default function SidebarNavigation({ sidebarOpen, activeItem, setActiveItem }) {
  // Added local state for collapsible sections
  const [impactOpen, setImpactOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleNavigation = (item) => {
    setActiveItem(item);
  };

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-[4px_0px_0px_rgba(25,73,88,0.50)]
        flex flex-col justify-between transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:static sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-hidden bg-white">
        <a
          href="https://latinoclimatehealth.org/"
          className="flex items-center ps-2.5 mb-5"
          onClick={() => handleNavigation("Home")}
        >
            <img
              src="./static/img/ucla_lppi_dashboard_logo.svg"
              alt="UCLA Luskin"
              className="w-[798px] h-auto object-cover mb-4"
            />
          <span className="self-center text-xl font-bold whitespace-nowrap uppercase"></span>
        </a>
        <ul className="space-y-2 font-medium">
          {/* Home */}
          <li>
            <a
              href="#"
              onClick={() => handleNavigation("Home")}
              className={`${styles.menuItem} ${
                activeItem === "Home" ? styles.menuItemActive : ""
              } text-xl font-bold uppercase`}
            >
              <span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group">HOME</span>
            </a>
          </li>
		{/* Impact Section */}
		<li>
		  <button
			type="button"
			onClick={() => { setImpactOpen((prev) => !prev); setAboutOpen(false); }}
			className={`${styles.menuItem} ${
			  activeItem === "Impact" ? styles.menuItemActive : ""
			} text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group`}
		  >
			<span className="flex-1 ms-0 text-left whitespace-nowrap">IMPACT</span>
			<svg
			  className={`w-3 h-3 transform transition-transform duration-300 ${
				impactOpen ? "rotate-0" : "rotate-180"
			  }`}
			  aria-hidden="true"
			  xmlns="http://www.w3.org/2000/svg"
			  fill="none"
			  viewBox="0 0 10 6"
			>
			  <path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m1 1 4 4 4-4"
			  />
			</svg>
		  </button>
		  <ul
			id="impact-menu"
			className={`${impactOpen ? "block" : "hidden"} py-2 space-y-2`}
		  >
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("Research"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  Research
				</span>
			  </a>
			</li>
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("PressCoverage"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  PRESS COVERAGE
				</span>
			  </a>
			</li>
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("Partners"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  PARTNERS
				</span>
			  </a>
			</li>
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("PolicyToolkit"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  POLICY TOOLKIT
				</span>
			  </a>
			</li>
		  </ul>
		</li>
		{/* About Section */}
		<li>
		  <button
			type="button"
			onClick={() => { setAboutOpen((prev) => !prev); setImpactOpen(false); }}
			className={`${styles.menuItem} ${
			  activeItem === "About" ? styles.menuItemActive : ""
			} text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group`}
		  >
			<span className="flex-1 ms-0 text-left whitespace-nowrap">ABOUT</span>
			<svg
			  className={`w-3 h-3 transform transition-transform duration-300 ${
				aboutOpen ? "rotate-0" : "rotate-180"
			  }`}
			  aria-hidden="true"
			  xmlns="http://www.w3.org/2000/svg"
			  fill="none"
			  viewBox="0 0 10 6"
			>
			  <path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m1 1 4 4 4-4"
			  />
			</svg>
		  </button>
		  <ul
			id="about-menu"
			className={`${aboutOpen ? "block" : "hidden"} py-2 space-y-2`}
		  >
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("FAQ"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  FAQ
				</span>
			  </a>
			</li>
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("OurData"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  OUR DATA
				</span>
			  </a>
			</li>
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("TechnicalDocumentation"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  TECHNICAL DOCUMENTATION
				</span>
			  </a>
			</li>
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("OurTeam"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  OUR TEAM
				</span>
			  </a>
			</li>
			<li>
			  <a
				href="#"
				onClick={() => { handleNavigation("Contact"); }}
				className={`${styles.menuItem} text-lg font-bold uppercase`}
			  >
				<span className="text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group pl-3">
				  CONTACT
				</span>
			  </a>
			</li>
		  </ul>
		</li>
          {/* Additional Resources */}
			<li>
			<a
				href="#"
				onClick={() => handleNavigation("Additional Resources")}
				className={`${styles.menuItem} ${
				activeItem === "Additional Resources" ? styles.menuItemActive : ""
				} text-xl font-bold uppercase flex items-center w-full p-2 rounded-none group`}
			>
				ADDITIONAL RESOURCES
			</a>
			</li>
          {/* ...other menu items... */}
        </ul>
      </div>

      {/* Social Section */}
      <div className="px-3 py-4 bg-white-100">
        <div className="text-center text-sm font-bold mb-2">Connect with us!</div>
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="./static/img/fb_sidebar.svg" alt="Facebook" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="./static/img/yt_sidebar.svg" alt="YouTube" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="./static/img/ig_sidebar.svg" alt="Instagram" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="./static/img/twitter_sidebar.svg" alt="Twitter" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="./static/img/linkedin_sidebar.svg" alt="LinkedIn" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="./static/img/email_sidebar.svg" alt="Email" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </aside>
  );
}