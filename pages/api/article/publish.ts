// 发布文章的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { prepareConnection } from 'db/index';
import { User, Article } from 'db/entity/index';
import { EXCEPTION_ARTICLE } from 'pages/api/config/codes';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(publish, ironOptions);

// 路由处理函数
async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '' } = req.body;
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);

  // 根据session保存的当前用户的id查找出user表中对应的信息
  const user = await userRepo.findOne({
    id: session.userId,
  });

  // 新建文章数据
  const article = new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  if (user) {
    article.user = user; // 文章表外键与该用户的数据关联
  }

  // 保存新建的文章数据到数据库中
  const resArticle = await articleRepo.save(article);
  console.log(article);

  if (resArticle) {
    res.status(200).json({ data: resArticle, code: 0, msg: '发布成功' });
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED });
  }
}
