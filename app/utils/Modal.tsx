function Modal({ children, onClose }:any) {
  return (
    <div className="position-fixed t-0 l-0 w-full h-screen bg-opacity-50 bg-black" onClick={onClose}>
      <dialog
        className="position-fixed h-screen-1/4 w-96"
        open
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </dialog>
    </div>
  );
}

export default Modal;
