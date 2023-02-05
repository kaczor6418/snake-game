import '@tensorflow/tfjs-backend-webgpu';
import styles from './styles/main.scss';
export { App } from './App';

const rootStyleWrapper: HTMLStyleElement = document.createElement('style');
rootStyleWrapper.innerHTML = styles;
document.head.appendChild(rootStyleWrapper);
