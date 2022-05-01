import axios from 'axios';
import express, { NextFunction, Request, Response } from 'express';
import { userRepository } from '..';
import { MyAccount } from '../types/redmine';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const users = await userRepository.find();
  res.send(users);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  console.log('req.params', req.params);

  const { id } = req.params;

  if (!id) {
    return res.status(400).send('Bad Request');
  }

  const user = await userRepository.findOne({
    where: {
      id,
    },
  });
  res.send(user);
});

interface RegisterUser {
  id: string;
  redmineKey: string;
}

interface RegisterUser {
  id: string;
  redmineKey: string;
}

router.post(
  '/',
  async (
    req: Request<{}, {}, RegisterUser, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const { id, redmineKey } = req.body;

    console.log(id, redmineKey);

    if (!id || !redmineKey) {
      return res.status(500).send('Params are not correnct!');
    }

    try {
      const findUser = await userRepository.findOne({
        where: {
          id: id,
        },
      });

      if (findUser) {
        return res.status(500).send('already registered');
      }
    } catch (e) {
      return res.status(500).send('DB Connection Error');
    }

    try {
      const {
        data: { user },
      } = await axios.get<MyAccount>(
        `http://10.1.36.3:82/my/account.json?key=${redmineKey}`
      );

      const createUser = await userRepository.save({
        id: id,
        name: user.firstname,
        redmineId: user.id,
        department: user.lastname,
        redmineKey: redmineKey,
      });

      res.send(createUser);
    } catch (e) {
      console.error(e);
      res.status(500).send('Something broke!');
    }
  }
);

export default router;
