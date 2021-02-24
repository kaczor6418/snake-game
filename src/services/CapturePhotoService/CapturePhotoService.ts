import { CapturePhotoServiceProps } from './interfaces/CapturePhotoServiceProps';
import { ICapturePhotoService } from './interfaces/ICapturePhotoService';
import { UTILS } from '../../common/Utils/UTILS';
import { ImageFormat } from '../../common/Enums/ImageFormat';
import { CanvasService } from '../CanvasService/CanvasService';
import { CanvasContextType } from '../CanvasService/interfaces/CanvasContext';

export class CapturePhotoService implements ICapturePhotoService {
  private readonly photoFormat: ImageFormat;
  private readonly photo: HTMLImageElement;
  private readonly videoDisplay: HTMLCanvasElement;
  private readonly videoStreamer: HTMLVideoElement;

  constructor({ displayWrapper, width, photoFormat }: CapturePhotoServiceProps) {
    this.photoFormat = photoFormat;
    this.photo = document.createElement('img');
    this.videoStreamer = this.createVideoStreamer(width, displayWrapper);
    this.videoDisplay = this.createVideoDisplay();
    void this.getWebCamAccess();
  }

  public resume(): Promise<void> {
    return this.videoStreamer.play();
  }

  public stop(): void {
    this.videoStreamer.pause();
  }

  public takePhoto(): void {
    const context = new CanvasService({ canvas: this.videoDisplay }).getContext(CanvasContextType.TWO_D);
    context.drawImage(this.videoStreamer, 0, 0, this.videoStreamer.width, this.videoStreamer.height);
    this.photo.src = this.videoDisplay.toDataURL(`image/${this.photoFormat}`);
  }

  private createVideoStreamer(width: number, displayWrapper?: HTMLElement): HTMLVideoElement {
    const video = document.createElement('video');
    video.width = width;
    video.height = video.videoHeight / (video.videoWidth / width) || width / (4 / 3);
    if (UTILS.isDefined(displayWrapper)) {
      displayWrapper.appendChild(video);
    }
    return video;
  }

  private createVideoDisplay(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.videoStreamer.width;
    canvas.height = this.videoStreamer.height;
    return canvas;
  }

  private getWebCamAccess(): Promise<void> {
    return window.navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.videoStreamer.srcObject = stream;
        void this.videoStreamer.play();
      })
      .catch((err) => console.info('Can not use webcam video because of this error: ', err));
  }
}
