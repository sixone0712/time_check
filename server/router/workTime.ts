import dayjs from 'dayjs';
import express, { NextFunction, Request, Response } from 'express';
import { hrmRepository, tbWorkRepository, userRepository } from '..';
import { weekToString } from '../../common/types/constants';
import { TimeItem } from '../../common/types/time';
import { HrmData } from '../entity/timeData/HrmData';
import { WorkTime } from '../types/timeData';
import { TbWorkDay } from '../types/timesheet';
import { redmineData } from './data';

const router = express.Router();

type DateQueryParams = {
  date: string;
};

router.get(
  '/timesheet',
  async (
    req: Request<{}, {}, {}, DateQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const date = req.query.date ? req.query.date : null;
    const { id } = req.user ?? { id: null };

    if (!date) {
      return res.status(400).send('Bad Request');
    }

    if (!id) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const timeSheetData = await getTimeSheetData(id, date);
      return res.send(timeSheetData);
    } catch (e) {
      return res.status(500).send('Server errors');
    }
  }
);

router.get(
  '/redmine',
  async (
    req: Request<{}, {}, {}, DateQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { redmineKey } = req.user ?? { redmineKey: null };
    const date = req.query.date ? req.query.date : null;

    if (!date) {
      return res.status(400).send('Bad Request');
    }

    if (!redmineKey) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const redmineDate = await getRedmineData(redmineKey, date);
      return res.send(redmineDate);
    } catch (e) {
      return res.status(500).send('Server errors');
    }
  }
);

router.get(
  '/hrm',
  async (
    req: Request<{}, {}, {}, DateQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user ?? { id: null };
    const date = req.query.date ? req.query.date : null;

    if (!date) {
      return res.status(400).send('Bad Request');
    }

    if (!id) {
      return res.status(401).send('Unauthorized');
    }

    const findHrm = await hrmRepository
      .createQueryBuilder('hrm_data')
      .where('hrm_data.userToDate like :userToDate', {
        userToDate: `${id}-${date}%`,
      })
      .orderBy('date', 'ASC')
      .getMany();

    console.log('findHrm', findHrm);

    res.send(
      findHrm.map((item) => ({
        date: item.date,
        start: item.start,
        end: item.end,
        spentOnHrm: item.spentOnHrm,
        etc: item.etc,
      }))
    );
  }
);

interface PostHrmReqBody {
  date: string;
  start: string;
  end: string;
  spentOnHrm: number;
  etc: string;
}

router.post(
  '/hrm',
  async (
    req: Request<{}, {}, PostHrmReqBody[], {}>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user ?? { id: null };

    if (!id) {
      return res.status(401).send('Unauthorized');
    }

    if (!Array.isArray(req.body)) {
      return res.status(400).send('Bad Request');
    }

    const findUser = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (!findUser) {
      return res.status(404).send('Not Found');
    }

    req.body.forEach(async (item) => {
      const hrmData = new HrmData();

      hrmData.date = item.date;
      hrmData.start = item.start;
      hrmData.end = item.end;
      hrmData.spentOnHrm = item.spentOnHrm;
      hrmData.user = findUser;
      hrmData.etc = item.etc;

      await hrmRepository
        .createQueryBuilder()
        .insert()
        .into(HrmData)
        .values(hrmData)
        .orUpdate(['date', 'start', 'end', 'spentOnHrm', 'etc'], ['userToDate'])
        .execute();
    });

    res.send('ok');
  }
);

router.get(
  '/all',
  async (
    req: Request<{}, {}, {}, DateQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { id, redmineKey } = req.user ?? { id: null, redmineKey: null };
    const date = req.query.date ? req.query.date : null;

    if (!id || !redmineKey) {
      return res.status(401).send('Unauthorized');
    }

    if (!date) {
      return res.status(400).send('Bad Request');
    }

    const cur = dayjs(date);

    const newData: TimeItem[] = new Array(cur.daysInMonth())
      .fill(null)
      .map((item, idx) => {
        const curDay = cur.add(idx, 'd');
        return {
          date: curDay.format('YYYY-MM-DD'),
          week: weekToString[curDay.day()],
          start: '',
          end: '',
          spentOnHrm: 0,
          spentOnRedmine: 0,
          spentOnTimeSheet: 0,
          etc: '',
        };
      });

    try {
      const hrmData = await hrmRepository
        .createQueryBuilder('hrm_data')
        .where('hrm_data.userToDate like :userToDate', {
          userToDate: `${id}-${date}%`,
        })
        .orderBy('date', 'ASC')
        .getMany();

      hrmData.forEach((item) => {
        const index = +item.date.split('-')[2] - 1;
        newData[index].start = item.start;
        newData[index].end = item.end;
        newData[index].spentOnHrm = item.spentOnHrm;
        newData[index].etc = item.etc;
      });

      const redmine = await getRedmineData(redmineKey, date);
      redmine.forEach((item) => {
        const index = +item.date.split('-')[2] - 1;
        newData[index].spentOnRedmine = item.time;
      });

      const timeSheet = await getTimeSheetData(id, date);
      timeSheet.forEach((item) => {
        const index = +item.date.split('-')[2] - 1;
        newData[index].spentOnTimeSheet = item.time;
      });

      return res.send(newData);
    } catch (e) {
      console.error(e);
      return res.status(500).send('Server errors');
    }
  }
);

const getTimeSheetData = async (id: string, date: string) => {
  try {
    const time = await tbWorkRepository
      .createQueryBuilder('tb_work')
      .select([
        'SUM(d1)',
        'SUM(d2)',
        'SUM(d3)',
        'SUM(d4)',
        'SUM(d5)',
        'SUM(d6)',
        'SUM(d7)',
        'SUM(d8)',
        'SUM(d9)',
        'SUM(d10)',
        'SUM(d11)',
        'SUM(d12)',
        'SUM(d13)',
        'SUM(d14)',
        'SUM(d15)',
        'SUM(d16)',
        'SUM(d17)',
        'SUM(d18)',
        'SUM(d19)',
        'SUM(d20)',
        'SUM(d21)',
        'SUM(d22)',
        'SUM(d23)',
        'SUM(d24)',
        'SUM(d25)',
        'SUM(d26)',
        'SUM(d27)',
        'SUM(d28)',
        'SUM(d29)',
        'SUM(d30)',
        'SUM(d31)',
      ])

      .where('empnum = :empnum AND date = :date', {
        empnum: id,
        date,
      })
      .getRawOne<TbWorkDay>();

    const reqDay = dayjs(`${date}-01`);
    const lastDay = reqDay.daysInMonth();

    const newArray: WorkTime[] = [];

    if (time) {
      Object.entries(time).forEach((item, idx) => {
        const [key, value]: [string, number] = item;

        const time = value ? Math.ceil(+value.toFixed(2) * 10) / 10 : 0;

        if (idx + 1 <= lastDay) {
          newArray.push({
            date: `${date}-${`${idx + 1}`.padStart(2, '0')}`,
            time,
          });
        }
      });
    }

    return newArray;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getRedmineData = async (key: string, date: string) => {
  try {
    const reqDay = dayjs(`${date}-01`);
    const formDate = `${date}-01`;
    const toDate = `${date}-${reqDay.daysInMonth()}`;

    // const {
    //   data: { time_entries },
    // } = await axios.get<RedmineTimeEntry>(
    //   `http://10.1.36.3:82/time_entries.json?key=${key}&from=${formDate}&to=${toDate}&user_id=30`
    // );

    const { time_entries } = redmineData;

    return time_entries
      .map((item) => ({
        date: item.spent_on,
        time: item.hours ?? 0,
      }))
      .reverse();
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default router;
