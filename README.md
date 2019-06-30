# The Wandering Douban（流浪豆瓣）
---
因不能说原因，大量友邻无故被封号，多年积累付之东流，因此流浪豆瓣计划诞生，一个备份豆瓣数据的客户端。

## 功能
1. 导出为excel：
    - [x] 已看电影
        - [x] 名称
        - [x] 链接
        - [x] 简评
        - [x] 评分
        - [x] 日期
    - [x] 想看电影
        - [x] 名称
        - [x] 链接
        - [x] 日期
    - [x] 已看图书
        - [x] 书名
        - [x] 作者
        - [x] 译者
        - [x] 链接
        - [x] 简评
        - [x] 日期
    - [x] 想看图书
        - [x] 书名
        - [x] 作者
        - [x] 译者
        - [x] 链接
        - [x] 日期
    - [ ] 听过的音乐
    - [ ] 听过的游戏
    - [x] 关注
        - [x] 名称
        - [x] 链接
        - [x] 地址
        - [x] 签名
    - [x] 被关注
        - [x] 名称
        - [x] 链接

    - [ ] 广播

1. 导出为PDF：
    - [ ] 广播
    - [ ] 日记
1. 导出为图片：
    - [ ] 相册

## 友邻
---
[下载地址(开发中)](#)
安装后直接可以用

## 开发者
---
技术栈：Electron + Vue + cheerio + element-ui + superagent+ less
### Quick start
```
git clone [my repo]
cd douban
yarn
yarn electron:serve
```

#### Build
`yarn electron:build`