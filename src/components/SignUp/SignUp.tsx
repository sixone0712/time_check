import { css } from '@emotion/react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEventHandler, useState } from 'react';
export default function SignUp() {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [redmineKey, setRedmineKey] = useState<string>('');

  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const onChangeKey = (e: ChangeEvent<HTMLInputElement>) => {
    setRedmineKey(e.target.value);
  };

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

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
          Sign Up
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="redmineKey"
            label="Redmine API Key"
            name="redmineKey"
            autoFocus
            value={id}
            onChange={onChangeKey}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={'submit'}
          >
            Sign Up
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
