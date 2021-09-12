import {Toast} from "react-bootstrap";
import style from "./util.module.css"
import {USER_ICO} from "../ServerAPI/utils";

export function MyToast(props) {
    console.log(props)
    return (
        <Toast
            onClick={() => {
                props.select(props.chatId)
                props.close()
            }}
            show={props.show}
            onClose={props.close}
            className={style.toast}>
            <Toast.Header>
                <img className={style.toast_img}
                     src={props.img != null ? props.img.url : USER_ICO} alt=""/>
                <strong className="me-auto">{props.title}</strong>
            </Toast.Header>
            <Toast.Body>{props.content}</Toast.Body>
        </Toast>
    )
}