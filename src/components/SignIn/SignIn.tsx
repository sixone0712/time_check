import { css } from '@emotion/react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useGetSignIn } from '@src/libs/query/hooks';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
export default function SignIn() {
  const router = useRouter();
  const [id, setId] = useState<string>('');

  const session = useSession();

  console.log('session', session);

  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setId('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        id,
      });
      console.log('result', result);
      router.replace('/time');
    } catch (e) {
      console.log('error');
      console.error(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs" css={styles}>
      <div className="paper">
        <Avatar className="avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={'form'} onSubmit={onSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="id"
            label="Employee Number"
            name="id"
            autoFocus
            value={id}
            onChange={onChangeId}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={'submit'}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}

const styles = css`
  .paper {
    margin-top: 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar {
    margin: 1rem;
  }
  .form {
    width: 100%;
    margin-top: 1rem;
  }

  .submit {
    margin: 3rem 0 2rem;
  }
`;
