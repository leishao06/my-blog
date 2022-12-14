import { ChangeEvent, useState } from 'react';
import { message } from 'antd';
import { observer } from 'mobx-react-lite';
import request from 'service/fetch';
import { useStore } from 'store/index';
import CountDown from 'components/CountDown';
import styles from './index.module.scss';
import { GithubOutlined } from '@ant-design/icons';

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();
  const { isShow = false, onClose } = props;
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '', // 手机号
    verify: '', // 验证码
  });

  const handleClose = () => {
    onClose && onClose();
  };

  // 点击获取验证码的回调
  const handleGetVerifyCode = () => {
    // setIsShowVerifyCode(true);
    // 判断是否输入手机号
    if (!form.phone) {
      message.warning('请输入手机号');
      return;
    }

    request
      .post('/api/user/sendVerifyCode', {
        to: form.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  //点击登录按钮的回调
  const handleLogin = () => {
    request
      .post('api/user/login', {
        ...form,
        identity_type: 'phone', // 登录方式
      })
      .then((res: any) => {
        if (res.code === 0) {
          // 登录成功
          store.user.setUserInfo(res?.data);
          onClose && onClose(); // 关闭登录框
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  // 点击github登录的回调
  const handleOAuthGithub = () => {
    let githubClientid;
    if (process.env.NODE_ENV == 'development') {
      githubClientid = '32f3c6810fdf2b604bf3';
    } else if (process.env.NODE_ENV == 'production') {
      githubClientid = '83bdfbabf1b8ab7d015b';
    }
    const redirectUri = 'http://localhost:3000/api/oauth/redirect';
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${githubClientid}&redirect_uri=${redirectUri}`
    );
  };

  // 表单改变的回调
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // 获取验证码倒计时结束时
  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登陆</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input
          name="phone"
          type="text"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            name="verify"
            type="text"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          <GithubOutlined style={{ color: 'black' }} />
          &nbsp; 使用 Github 登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a
            href="https://juejin.cn/user/4117039159453656/posts"
            target="_blank"
            rel="noreferrer"
          >
            隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default observer(Login);
