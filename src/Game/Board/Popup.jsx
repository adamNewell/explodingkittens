import React from 'react';
import { Modal } from 'react-bootstrap';
import './board.css'

const Popup = (props) => {
  const {
    onHide: providedOnHide,
    size,
    header,
    body,
    ...rest
  } = props;

  let hide = false;
  let onHide = () => { };
  if (providedOnHide) {
    hide = true;
    onHide = providedOnHide;
  }

  return (
    <Modal
      {...rest}
      onHide={onHide}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton={hide}>
        <Modal.Title id="contained-modal-title-vcenter">
          {header}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>

    </Modal>
  );
};
Popup.defaultProps = {
  size: 'sm',
  onHide: undefined,
};

export default Popup;
