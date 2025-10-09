# MongoDB 常用查询命令

## 基本连接和查看

```bash
# 连接到数据库
mongosh adboost

# 查看所有数据库
show dbs

# 查看当前数据库的所有集合
show collections

# 查看集合中的文档数量
db.merchants.countDocuments()
db.ads.countDocuments()
db.transactions.countDocuments()
```

## 商户(Merchants)查询

```javascript
// 查看所有商户
db.merchants.find().pretty()

// 查看特定商户
db.merchants.findOne({username: "techstore_owner"})

// 查看积分大于500的商户
db.merchants.find({credits: {$gt: 500}})

// 按积分排序
db.merchants.find({}, {username: 1, credits: 1}).sort({credits: -1})
```

## 广告(Ads)查询

```javascript
// 查看所有广告
db.ads.find().pretty()

// 查看活跃的广告
db.ads.find({status: "active"})

// 查看特定商户的广告
db.ads.find({merchantId: ObjectId("68e7a200600945b716863871")})

// 查看点击率最高的广告
db.ads.find({}, {title: 1, "metrics.clicks": 1, "metrics.impressions": 1}).sort({"metrics.clicks": -1})

// 按广告类型统计
db.ads.aggregate([
  {$group: {_id: "$type", count: {$sum: 1}}}
])
```

## 交易(Transactions)查询

```javascript
// 查看最新的10条交易
db.transactions.find().sort({createdAt: -1}).limit(10)

// 查看特定商户的交易
db.transactions.find({merchantId: ObjectId("68e7a200600945b716863871")})

// 查看积分充值记录
db.transactions.find({type: "CREDIT_RECHARGE"})

// 统计交易类型
db.transactions.aggregate([
  {$group: {_id: "$type", count: {$sum: 1}, totalAmount: {$sum: "$amount"}}}
])
```

## 复杂查询示例

```javascript
// 查看商户及其广告信息
db.merchants.aggregate([
  {
    $lookup: {
      from: "ads",
      localField: "_id",
      foreignField: "merchantId",
      as: "ads"
    }
  },
  {
    $project: {
      username: 1,
      credits: 1,
      adCount: {$size: "$ads"},
      activeAds: {
        $size: {
          $filter: {
            input: "$ads",
            cond: {$eq: ["$$this.status", "active"]}
          }
        }
      }
    }
  }
])

// 查看广告性能统计
db.ads.aggregate([
  {
    $match: {status: "active"}
  },
  {
    $group: {
      _id: "$type",
      totalImpressions: {$sum: "$metrics.impressions"},
      totalClicks: {$sum: "$metrics.clicks"},
      avgCTR: {
        $avg: {
          $divide: ["$metrics.clicks", "$metrics.impressions"]
        }
      }
    }
  }
])
```

## 快捷命令

```bash
# 使用npm脚本快速查看数据
npm run view-db

# 重置数据库
npm run setup-db
npm run seed-db

# 单行命令查看数据
mongosh adboost --eval "db.merchants.find({}, {username:1, credits:1})"
mongosh adboost --eval "db.ads.find({status:'active'}, {title:1, type:1})"
mongosh adboost --eval "db.transactions.find().sort({createdAt:-1}).limit(5)"
```

## 数据导出

```bash
# 导出集合到JSON文件
mongoexport --db=adboost --collection=merchants --out=merchants.json --pretty
mongoexport --db=adboost --collection=ads --out=ads.json --pretty
mongoexport --db=adboost --collection=transactions --out=transactions.json --pretty
```

## 实用查询模板

```javascript
// 检查数据完整性
db.merchants.find({$or: [{username: null}, {email: null}, {credits: null}]})
db.ads.find({$or: [{title: null}, {type: null}, {merchantId: null}]})

// 查找异常数据
db.merchants.find({credits: {$lt: 0}}) // 负积分
db.transactions.find({amount: 0}) // 零金额交易

// 性能监控
db.ads.find({"metrics.clicks": {$gt: 100}}) // 高点击广告
db.merchants.find({credits: {$gt: 1000}}) // 高积分用户
```