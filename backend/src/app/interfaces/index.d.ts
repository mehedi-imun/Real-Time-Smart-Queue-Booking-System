declare global {
  namespace Express {
    interface User {
      userId: string;
    }
    interface Request {
      user: User;
      file?: Express.Multer.File;
     
      userId:string
    }
  }
}
