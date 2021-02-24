export interface ICapturePhotoService {
  resume(): Promise<void>;
  stop(): void;
  takePhoto(): void;
}
