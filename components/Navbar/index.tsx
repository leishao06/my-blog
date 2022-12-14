import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import request from 'service/fetch';
import { useStore } from 'store/index';
import Login from 'components/Login';
import styles from './index.module.scss';
import { navs } from './config';

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  // 点击写文章按钮的回调
  const handleGoToEditorPage = () => {
    // 判断是否登录
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };

  // 点击登陆按钮的回调
  const handleLogin = () => {
    setIsShowLogin(true);
  };

  // 当登陆弹框点击关闭时
  const handleClose = () => {
    setIsShowLogin(false);
  };

  // 点击个人主页时的回调
  const handleGoToPersonalPage = () => {
    push(`/user/${userId}`);
  };

  // 点击退出登录时的回调
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({}); // 删除全局store用户信息
      }
    });
  };

  // 该函数用于渲染antd组件Dropdown鼠标经过时的展示的内容
  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGoToPersonalPage}>
          <HomeOutlined />
          &nbsp;个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />
          &nbsp;退出登录
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGoToEditorPage}>写文章</Button>

        {/* 如果userId能取到，说明已经登录，展示头像，否则展示登录按钮 */}
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登陆
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
