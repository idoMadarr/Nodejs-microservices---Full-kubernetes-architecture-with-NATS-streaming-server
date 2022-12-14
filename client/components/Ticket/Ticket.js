import Link from 'next/link';
import styles from '../../styles/Tickets.module.css';

const Ticket = ({ title, price, createdAt, ticketId }) => {
  // const date = new Date(createdAt).toDateString();
  return (
    <div className={styles['ticket']}>
      <div>
        <p>{title}</p>
      </div>
      <p>{price} $</p>
      <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticketId}`}>
        View
      </Link>
    </div>
  );
};

export default Ticket;
