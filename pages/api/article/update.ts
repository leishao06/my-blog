// 发布文章的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index';
import { Article, Tag } from 'db/entity/index';
import { EXCEPTION_ARTICLE } from 'pages/api/config/codes';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(update, ironOptions);

// 路由处理函数
async function update(req: NextApiRequest, res: NextApiResponse) {
  const { title = '', content = '', id = 0, tagIds = [] } = req.body;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const tagRepo = db.getRepository(Tag);

  // 找出文章的标签项数组
  const tags = await tagRepo.find({
    where: tagIds?.map((tagId: any) => ({ id: tagId })),
  });

  const newTags = tags?.map((tag) => {
    tag.article_count = tag.article_count + 1;
    return tag;
  });

  // 找出这篇文章信息
  const article = await articleRepo.findOne({
    where: {
      id,
    },
    relations: ['user', 'tags'],
  });

  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();
    article.tags = newTags;

    // 保存新建的文章数据到数据库中
    const resArticle = await articleRepo.save(article);

    if (resArticle) {
      res.status(200).json({ data: resArticle, code: 0, msg: '更新成功' });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED });
    }
  } else {
    // 如果没找到文章
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
  }
}
