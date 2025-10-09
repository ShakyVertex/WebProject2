/**
 * MongoDB数据查看脚本
 * 用于快速查看AdBoost数据库中的数据
 */

// 数据库名称
const dbName = 'adboost';

// 切换到adboost数据库
use(dbName);

print('==================================================');
print('           AdBoost数据库数据查看器');
print('==================================================\n');

// 数据库统计信息
print('📊 数据库统计信息:');
print(`   商户数量: ${db.merchants.countDocuments()}`);
print(`   广告数量: ${db.ads.countDocuments()}`);
print(`   交易数量: ${db.transactions.countDocuments()}\n`);

// 商户信息
print('👥 商户信息:');
print('   ID                        | 用户名           | 邮箱                     | 积分  | 角色');
print('   --------------------------|------------------|--------------------------|-------|--------');
db.merchants.find({}, {username: 1, email: 1, credits: 1, role: 1}).forEach(function(doc) {
    const id = doc._id.toString().substring(18, 24);
    const username = (doc.username + '                ').substring(0, 16);
    const email = (doc.email + '                          ').substring(0, 24);
    const credits = (doc.credits + '       ').toString().substring(0, 5);
    const role = doc.role;
    print(`   ${id} | ${username} | ${email} | ${credits} | ${role}`);
});

print('\n📢 广告信息:');
print('   标题                           | 类型      | 状态    | 日费用 | 展示次数 | 点击次数');
print('   -------------------------------|-----------|---------|--------|----------|----------');
db.ads.find({}, {title: 1, type: 1, status: 1, costPerDay: 1, metrics: 1}).forEach(function(doc) {
    const title = (doc.title + '                                ').substring(0, 30);
    const type = (doc.type + '           ').substring(0, 9);
    const status = (doc.status + '         ').substring(0, 7);
    const cost = (doc.costPerDay + '        ').toString().substring(0, 6);
    const impressions = (doc.metrics?.impressions || 0 + '          ').toString().substring(0, 8);
    const clicks = (doc.metrics?.clicks || 0).toString();
    print(`   ${title} | ${type} | ${status} | ${cost} | ${impressions} | ${clicks}`);
});

print('\n💳 最近交易 (最新5条):');
print('   日期        | 类型            | 金额    | 余额    | 备注');
print('   ------------|-----------------|---------|---------|------------------');
db.transactions.find({}).sort({createdAt: -1}).limit(5).forEach(function(doc) {
    const date = doc.createdAt.toISOString().substring(0, 10);
    const type = (getTransactionTypeChinese(doc.type) + '                ').substring(0, 14);
    const amount = (doc.amount + '         ').toString().substring(0, 7);
    const balance = (doc.balanceAfter + '         ').toString().substring(0, 7);
    const note = (doc.note || '').substring(0, 18);
    print(`   ${date} | ${type} | ${amount} | ${balance} | ${note}`);
});

print('\n🔍 按状态分组的广告统计:');
const adStats = db.ads.aggregate([
    {$group: {_id: "$status", count: {$sum: 1}, totalCost: {$sum: "$costPerDay"}}},
    {$sort: {_id: 1}}
]);
adStats.forEach(function(doc) {
    print(`   ${doc._id}: ${doc.count}个广告, 日总费用: ${doc.totalCost}积分`);
});

print('\n💰 积分统计:');
const creditStats = db.merchants.aggregate([
    {$group: {_id: null, totalCredits: {$sum: "$credits"}, avgCredits: {$avg: "$credits"}}}
]);
creditStats.forEach(function(doc) {
    print(`   总积分: ${doc.totalCredits}, 平均积分: ${Math.round(doc.avgCredits)}`);
});

print('\n==================================================');
print('           数据查看完成');
print('==================================================');

// 辅助函数
function getTransactionTypeChinese(type) {
    const typeMap = {
        'CREDIT_RECHARGE': '积分充值',
        'AD_ACTIVATE': '广告激活',
        'AD_DAILY_DEBIT': '日常扣费',
        'AD_PAUSE_REFUND': '暂停退款',
        'AD_CANCEL_REFUND': '取消退款',
        'MANUAL_ADJUST': '手动调整'
    };
    return typeMap[type] || type;
}