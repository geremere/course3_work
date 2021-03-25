import React, {Component} from "react";
import style from "./Player.module.css"
import VideoWindow from "../ModalWindow/ModalWindow";

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlayed: false
        }
        this.StratVideo = this.StratVideo.bind(this);
        this.loadedData = this.loadedData.bind(this);
    }

    StratVideo = (event) => {
        const video = document.getElementById(this.props.id + "alert");
        video.controls = true;
        video.play();
        this.setState({
            isPlayed: true
        })
        document.getElementById(this.props.id + "h").style.display = 'none';
        document.getElementById(this.props.id + 'video_alert').style.display = 'block'
    };
    loadedData = event => {
        if (this.props.img === null)
            event.target.currentTime = 1;
    };

    render() {
        return (
            <div className={style.video_wrapper}>
                {/*<video id={this.props.id} poster={this.props.img} src={this.props.video} className={style.video}*/}
                {/*       controls={false} onLoadedData={this.loadedData}/>*/}
                <VideoWindow id={this.props.id} img={this.props.img} video={this.props.video} className={style.video}
                             loadedData={this.loadedData} isPlayed={this.state.isPlayed}/>
                <div id={this.props.id + "h"} className={style.before_start} onClick={this.StratVideo}>

                    <button onClick={this.StratVideo} className={style.play_btn}>
                        <img className={style.play_ico}
                             src="https://image.flaticon.com/icons/svg/254/254434.svg" alt=""/>
                    </button>
                </div>
            </div>
        );
    }
}

export default Player;
