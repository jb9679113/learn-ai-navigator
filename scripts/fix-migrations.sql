-- 清理生产数据库中的失败迁移记录
-- 注意：这会删除所有迁移历史，请谨慎使用

-- 删除失败的迁移记录
DELETE FROM "_prisma_migrations" WHERE migration_name = '20260520040000_init';

-- 或者，如果你想完全重置迁移历史（不推荐，除非你知道自己在做什么）
-- DELETE FROM "_prisma_migrations";
