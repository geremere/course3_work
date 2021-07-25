import {Alert, Button, Modal} from "react-bootstrap";
import {useState} from "react";

export function AlertInfo(props) {
    // const [show, setShow] = useState(true);
    //
    // const handleClose = () => setShow(false);
    debugger;
    return (
        <>
            <Modal show={props.show} onHide={props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.head}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.content}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}