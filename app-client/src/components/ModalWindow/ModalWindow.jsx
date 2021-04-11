import React, {Component} from 'react';
import style from './ModalWindow.module.css';

export function TextAlert(props) {
    return (
        <div id='alert' className={style.alert} onClick={() => {
            document.getElementById('alert').style.display = 'none'
        }}>
            <div className={style.window}>
                <span className={style.close} onClick={function () {
                    document.getElementById('alert').style.display = 'none'
                }}>x</span>
                <div className={style.header}>
                    <label>Learn and Create</label>
                </div>
                <br/>
                <label>{props.text}</label>
                <br/>
                <button className={style.btn} onClick={function () {
                    document.getElementById('alert').style.display = 'none'
                }}>Окей
                </button>
            </div>
        </div>
    )

}

class VideoWindow extends Component {
    constructor(props) {
        super(props);
        this.closeWindow = this.closeWindow.bind(this);
    }

    closeWindow = (event) => {
        const target = event.target;
        if (target.id === this.props.id + "video_alert" || target.localName === "span") {
            document.getElementById(this.props.id + 'video_alert').style.display = 'none'
            const alert_video = document.getElementById(this.props.id + "alert");
            alert_video.pause();
            document.getElementById(this.props.id + "h").style.display = 'flex';
            document.getElementById(this.props.id + "main").currentTime = alert_video.currentTime;

        }

    }

    render() {
        return (
            <div>
                <div id={this.props.id + "video_alert"} className={style.alert} onClick={this.closeWindow}>
                    <div id={this.props.id + "window"} className={style.video_window}>
                        <video id={this.props.id + "alert"} poster={this.props.img} src={this.props.video}
                               className={style.video}
                               controls={false} onLoadedData={this.props.loadedData}/>
                        <span className={style.close} onClick={this.closeWindow}>x</span>
                    </div>
                </div>
                <video id={this.props.id + "main"} poster={this.props.img} src={this.props.video}
                       className={style.video}
                       controls={false} onLoadedData={this.props.loadedData}/>
            </div>
        )
    }
}

export default VideoWindow;