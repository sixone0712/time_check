import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import next from 'next';
import { getToken } from 'next-auth/jwt';
import { DataSource, Repository } from 'typeorm';
import { HrmData } from './entity/timeData/HrmData';
import { User } from './entity/timeData/User';
import { TbWork } from './entity/timeSheet/TbWork';
import { authToken } from './middleware/auth';
import user from './router/user';
import workTime from './router/workTime';
import { UserToken } from './types/common';

const dev = process.env.NODE_ENV !== 'production';
const port = +(process.env.PORT || 3000);
const hostname = 'localhost';
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

export let tbWorkRepository: Repository<TbWork>;
export let userRepository: Repository<User>;
export let hrmRepository: Repository<HrmData>;

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserToken;
  }
}

const timeSheetDataSource = new DataSource({
  name: 'timesheet',
  type: 'mysql',
  host: 'localhost',
  port: 3310,
  username: 'admin',
  password: 'ckbsckbs',
  database: 'timesheet',
  entities: [__dirname + '/entity/timeSheet/**/*.{js,ts}'],
  logging: true,
  synchronize: false,
});

const timeDataSource = new DataSource({
  name: 'timedata',
  type: 'mysql',
  host: 'localhost',
  port: 3311,
  username: 'admin',
  password: 'ckbsckbs',
  database: 'timedata',
  entities: [__dirname + '/entity/timeData/**/*.{js,ts}'],
  logging: true,
  synchronize: true,
});

(async () => {
  try {
    await timeSheetDataSource.initialize();
    await timeDataSource.initialize();

    tbWorkRepository = timeSheetDataSource.getRepository(TbWork);
    userRepository = timeDataSource.getRepository(User);
    hrmRepository = timeDataSource.getRepository(HrmData);

    await app.prepare();
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());

    server.use(async (req: Request, res: Response, next: NextFunction) => {
      // console.log(req.cookies);
      const token = await getToken({ req, secret: 'chpark' });
      // console.log('JSON Web Token', token);

      return next();
    });

    server.use('/api/server/user', user);
    server.use('/api/db/work', authToken, workTime);

    server.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
