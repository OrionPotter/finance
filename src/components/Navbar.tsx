'use client';

import { useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
            零x金融
        </Link>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.menuIcon}>{isOpen ? '✕' : '☰'}</span>
        </button>
        <ul className={`${styles.navList} ${isOpen ? styles.navListOpen : ''}`}>
          <li>
            <Link href="/market" className={styles.navLink}>
              市场
            </Link>
          </li>
          <li>
            <Link href="/news" className={styles.navLink}>
              资讯
            </Link>
          </li>
          <li>
            <Link href="/calendar" className={styles.navLink}>
              日历
            </Link>
          </li>
          <li>
            <Link href="/tools" className={styles.navLink}>
              工具
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}