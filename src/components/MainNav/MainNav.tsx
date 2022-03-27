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
import React from 'react';

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

  // if (status === 'unauthenticated' && router.route !== '/login') {
  //   router.push('/login');
  // }

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
            `}
          >
            LOGO
          </Typography>

          <div>
            <Button
              css={css`
                font-weight: bold;
                color: black;
              `}
              onClick={() => router.push('/login')}
            >
              SIGN IN
            </Button>
            <Button
              css={css`
                font-weight: bold;
                color: black;
              `}
              onClick={() => router.push('/login')}
            >
              SIGN OUT
            </Button>

            {false && (
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
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
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
          width: 1440px;
          min-height: calc(100vh - 48px);
        `}
      >
        {appProps}
      </div>
    </div>
  );
};

export default MainNav;
