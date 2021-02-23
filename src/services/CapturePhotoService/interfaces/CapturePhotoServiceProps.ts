import { ImageFormat } from '../../../common/Enums/ImageFormat';

export interface CapturePhotoServiceProps {
  width: number;
  photoFormat: ImageFormat;

  displayWrapper?: HTMLElement;
}
