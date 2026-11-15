export {};
type ErrorResult = { status:'error'; code:'INVALID_INPUT'|'TOO_LARGE'|'IO_ERROR'|'NO_IMAGE'|'CLIPBOARD_ERROR'|'PROFILE_ERROR'; message:string; batchId?:string|null };
type Cancelled = { status:'cancelled'; code?:'CANCELLED' };
type ImageBatch = {status:'opened';files:Array<{name:string;mime:'image/png'|'image/jpeg'|'image/bmp';bytes:Uint8Array}>;batchId?:string|null};
interface PixelwerkDesktop {
  readonly initialLanguage:'de'|'en'; readonly mode:'portable'|'installed'|'development'; readonly version:string;
  openImages(input:{multiple:boolean}):Promise<ImageBatch|Cancelled|ErrorResult>;
  nextImage(batchId:string):Promise<ImageBatch|ErrorResult>;
  nextLaunchImage():Promise<ImageBatch|{status:'empty'}|ErrorResult>;
  onLaunchImageAvailable(callback:()=>void):()=>void;
  saveImage(input:{name:string;format:'png'|'jpeg'|'bmp';bytes:Uint8Array}):Promise<{status:'saved';name:string;bytes:number}|Cancelled|ErrorResult>;
  readClipboardImage():Promise<{status:'read';bytes:Uint8Array;mime:'image/png'}|ErrorResult>;
  writeClipboardImage(bytes:Uint8Array):Promise<{status:'written'}|ErrorResult>;
  getLanguage():Promise<{status:'ok';language:'de'|'en'}|ErrorResult>;
  setLanguage(language:'de'|'en'):Promise<{status:'saved';language:'de'|'en'}|ErrorResult>;
  confirmReplace():Promise<{status:'discard'|'export'}|Cancelled|ErrorResult>;
  requestClose():Promise<{status:'ok'}|ErrorResult>;
  confirmClose(input:{requestId:string;dirty:boolean}):Promise<{status:'ok'|'discard'|'export'}|Cancelled|ErrorResult>;
  onPrepareClose(callback:(requestId:string)=>void):()=>void;
  onExport(callback:()=>void):()=>void;
}
declare global { interface Window { readonly pixelwerkDesktop?:PixelwerkDesktop; } }
