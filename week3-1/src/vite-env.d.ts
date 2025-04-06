/// <reference types="vite/client" />
// 아래의 형태는 공식 문서에 있음
interface ImportMetaEnv {
  readonly VITE_TMDB_KEY: string; //readonly=절대 변경될 수 없다
}

interface ImportMeta {
  readonly env: ImportMeta;
}