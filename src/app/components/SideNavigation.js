import React from 'react';
import styles from './SideNavigation.module.css';

const SideNavigation = () => {
  return (
    <nav className={styles.sideNavContainer}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoTop}>
          <span className={styles.logoCA}>CA</span>
          <span className={styles.logoLatino}>LATINO</span>
        </div>
        <div className={styles.logoMiddle}>climate &amp; health</div>
        <div className={styles.logoBottom}>dashboard</div>
      </div>

      {/* Menu Section */}
      <div className={styles.menuSection}>
        <div className={`${styles.menuItem} ${styles.menuItemActive}`}>HOME</div>
        <div className={styles.menuItem}>IMPACT</div>
        <div className={styles.menuItem}>ABOUT</div>
        <div className={styles.menuItem}>ADDITIONAL RESOURCES</div>
      </div>

      {/* Social Media Section */}
      <div className={styles.socialSection}>
        <div className={styles.connectText}>Connect with us!</div>
        <div className={styles.socialIcons}>
          {/* Wrap icon in circle container */}
          <div className={styles.iconCircle}>
            <img src="/static/img/fb_sidebar.svg" alt="Facebook" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="/static/img/yt_sidebar.svg" alt="YouTube" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="/static/img/ig_sidebar.svg" alt="Instagram" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="/static/img/twitter_sidebar.svg" alt="Twitter" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="/static/img/linkedin_sidebar.svg" alt="LinkedIn" className={styles.socialIconImage} />
          </div>
          <div className={styles.iconCircle}>
            <img src="/static/img/email_sidebar.svg" alt="Email" className={styles.socialIconImage} />
          </div>
          {/* Add additional icons as needed */}
        </div>
      </div>
    </nav>
  );
};

export default SideNavigation;