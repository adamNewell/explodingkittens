import React from 'react';
import { Modal} from 'react-bootstrap';
import './board.css'

export function Popup(props) {
    let hide = false;
    let onHide = () => { };
    if (props.onHide) {
      hide = true;
      onHide = props.onHide;
    }
    return (
      <Modal
        {...props}
        onHide={onHide}
        size={props.cards ? props.cards.length > 3 ? "lg" : props.cards.length > 2 ? "md" : "sm" : "sm"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton={hide}>
          <Modal.Title id="contained-modal-title-vcenter">
           {props.header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {props.body}
        </Modal.Body>
       
      </Modal>
    );
  }
