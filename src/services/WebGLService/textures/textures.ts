import { TextureID } from './textures.types';

const SNAKE_SKIN = new Image();
SNAKE_SKIN.src = './assets/images/snake-skin.jpg';

export const TEXTURES = new Map<TextureID, HTMLImageElement>([[TextureID.SNAKE_SKIN, SNAKE_SKIN]]);
