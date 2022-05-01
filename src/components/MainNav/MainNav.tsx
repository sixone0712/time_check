import { css } from '@emotion/react';
import { AccountCircle } from '@mui/icons-material';
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { signOut } from 'next-auth/react';

type MainNavProps = {
  appProps: any;
};
export const MainNav = ({ appProps }: MainNavProps) => {
  const { status } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/signin' });
  }, []);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        width: auto;
      `}
    >
      <AppBar position="static" color="default">
        <Toolbar
          variant="dense"
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            css={css`
              font-weight: bold;
              display: flex;
              width: 9rem;
            `}
          >
            Time Check
          </Typography>

          <div
            css={css`
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
            `}
          >
            {status !== 'authenticated' && (
              <div>
                <Button
                  css={css`
                    font-weight: bold;
                    color: black;
                  `}
                  onClick={() => router.push('/signin')}
                >
                  SIGN IN
                </Button>
                <Button
                  css={css`
                    font-weight: bold;
                    color: black;
                  `}
                  onClick={() => router.push('/signup')}
                >
                  SIGN UP
                </Button>
              </div>
            )}

            {status === 'authenticated' && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleSignOut}>Log Out</MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div
        // css={tw`container border-solid max-width[1440px] height[calc(100vh-48px)]`}
        css={css`
          border: 1px solid black;
          width: 90rem; //1440px;
          min-height: calc(100vh - 48px);
          padding-left: 3rem;
          padding-right: 3rem;
        `}
      >
        {appProps}
      </div>
    </div>
  );
};

export default MainNav;
