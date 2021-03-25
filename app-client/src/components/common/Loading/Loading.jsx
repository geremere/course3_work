import style from "./Loading.module.css";
import React from "react";

export function Loading() {
    return(
        <div className={style.wrapper}>
            <div className={style.circle}></div>
            <div className={style.circle}></div>
            <div className={style.circle}></div>
            <div className={style.circle}></div>
        </div>
    )
}