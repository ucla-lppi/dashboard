"use client";
import React, { useState } from 'react';
import styles from './SideNavigation.module.css';

const SideNavigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className={styles.sideNavContainer}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoTop}>
          <span className={styles.logoCA}>CA</span>
          <span 
            className={styles.logoLatino}
            style={{
              background: "url('./static/img/logo_background_circle.png') no-repeat center",
              backgroundSize: "contain"
            }}
          >
            LATINO
          </span>
        </div>
        <div className={styles.logoMiddle}>climate &amp; health</div>
        <div className={styles.logoBottom}>dashboard</div>
      </div>

      {/* Hamburger for small screens */}
      <button 
        className={styles.hamburgerBtn}
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <span className={styles.hamburgerIcon}>&#9776;</span>
      </button>

      {/* Menu Section */}
      <div className={`${styles.menuSection} ${menuOpen ? styles.menuOpen : ''}`}>
        <div className={`${styles.menuItem} ${styles.menuItemActive}`}>
          <div
            style={{
              position: "absolute",
              left: "-30px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "30px",
              height: "10px",
              background: "url('./static/img/selector-rectangle.png') no-repeat center",
              backgroundSize: "contain"
            }}
          />
          HOME
        </div>
        <div className={styles.menuItem}>IMPACT</div>
        <div className={styles.menuItem}>ABOUT</div>
        <div className={styles.menuItem}>ADDITIONAL RESOURCES</div>
      </div>

      {/* Social Media Section */}
      <div className={styles.socialSection}>
        <div className={styles.connectText}>Connect with us!</div>
        <div className={styles.socialIcons}>
          <div className={styles.iconCircle}>
            <img src="./static/img/fb_sidebar.svg" alt="Facebook" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="./static/img/yt_sidebar.svg" alt="YouTube" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="./static/img/ig_sidebar.svg" alt="Instagram" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="./static/img/twitter_sidebar.svg" alt="Twitter" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="./static/img/linkedin_sidebar.svg" alt="LinkedIn" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="./static/img/email_sidebar.svg" alt="Email" className={styles.socialIconImage} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNavigation;