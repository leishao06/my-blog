import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { User } from './user'
import { Comment } from './comment'
import { Tag } from './tags';
// PrimaryGeneratedColumn 主键的列，，Column一般的列

// 装饰器，name就是表名
@Entity({ name: 'articles' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;   // !: 在ts中是非必填的

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  views!: number; // 阅读量

  @Column()
  create_time!: Date; // 创建时间

  @Column()
  update_time!: Date; // 更新时间

  @Column()
  is_delete!: number; // 标识文章是否删除，不会真的从数据库删除

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'}) // 外键键名
  user!:User

  @ManyToMany(() => Tag, (tag) => tag?.articles, {
    cascade: true
  })
  tags!: Tag[]; // 该文章关联的标签数组 


  @OneToMany(() => Comment, (comment) => comment.article)
  comments!: Comment[] // 该文章的评论数组
}
