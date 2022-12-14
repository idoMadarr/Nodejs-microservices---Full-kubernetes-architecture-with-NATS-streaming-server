const ButtonElement = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className={'button-element'}>
      {title}
    </button>
  );
};

export default ButtonElement;
