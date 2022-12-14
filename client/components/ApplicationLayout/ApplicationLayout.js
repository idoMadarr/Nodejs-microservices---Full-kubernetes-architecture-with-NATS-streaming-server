import Navbar from '../Navbar/Navbar';
import styles from '../../styles/ApplicationLayout.module.css';

const ApplicationLayout = ({ children, currentUser }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Navbar currentUser={currentUser} />
        {children}
      </main>
      <footer className={styles.footer}>
        <p className={styles['desc-text']}>
          <span>Microservices Project -</span>
          Built from the ground up with Docker & Kubernetes Architecture, as
          long as NodeJS, Next, MongoDB and much more. Ido Adar
        </p>
      </footer>
    </div>
  );
};

export default ApplicationLayout;
