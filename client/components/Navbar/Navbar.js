import Link from 'next/link';
import styles from '../../styles/Navbar.module.css';

const Navbar = ({ currentUser }) => {
  const links = [
    !currentUser && {
      label: 'Login',
      href: '/auth/signin',
    },
    !currentUser && {
      label: 'Register',
      href: '/auth/signup',
    },
    currentUser && {
      label: 'Sell Tickets',
      href: '/tickets/new',
    },
    currentUser && {
      label: 'My Orders',
      href: '/orders/user',
    },
    currentUser && {
      label: 'Sign out',
      href: '/auth/signout',
    },
  ];

  return (
    <nav className={styles['navbar-main']}>
      <Link href={'/'} style={{ fontSize: '1rem' }}>
        GitTix
        {currentUser && <small> Hi {currentUser.email}</small>}
      </Link>
      <ul>
        {links.map(link => {
          if (link) {
            return (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            );
          }
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
