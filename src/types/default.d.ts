export {};

export enum STATUS {
  active,
  pending,
}

export enum ROLE {
  admin,
  pemilik,
  karyawan,
  user,
}

declare global {
  namespace NodeJs {
    interface ProcessEnv {
      PORT: number;
      DB_NAME: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DRIVER: string;
      ACCESSTOKENSECRET: string;
      REFRESHTOKENSECRET: string;
      SALT: number;
    }
  }
}
