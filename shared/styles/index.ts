import css from "./index.css?raw";
export function addMainStyle(){
    const style:HTMLStyleElement = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}