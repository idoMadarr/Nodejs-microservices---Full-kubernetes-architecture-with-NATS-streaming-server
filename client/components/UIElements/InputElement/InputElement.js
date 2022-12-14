const InputElement = ({
  inputType,
  value,
  placeholder,
  name,
  insertFunc,
  onBlur,
}) => {
  return (
    <div className={'input-element-main'}>
      <input
        type={inputType}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={insertFunc}
        onBlur={onBlur}
        className={'input'}
      />
    </div>
  );
};

export default InputElement;
