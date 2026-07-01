export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')).transform(obj => ({ ...obj })),
  }),

  主线: z.object({
    章节: z.coerce.number().transform(v => _.clamp(v, 0, 4)),
    路线: z.enum(['未选择', '救赎', '制裁']),
    第一章_任务完成数: z.coerce.number().transform(v => _.clamp(v, 0, 3)),
    第二章_下水道调查完成: z.boolean(),
    第三章_真相揭露: z.boolean(),
    第四章_完成: z.boolean(),
    关键flag: z.record(z.string(), z.boolean()).transform(obj => ({ ...obj })),
  }),

  主角: z.object({
    属性: z.object({
      攻击力: z.coerce.number(),
      防御力: z.coerce.number(),
      魔力: z.coerce.number(),
      生命值: z.coerce.number(),
    }),
    金钱: z.coerce.number(),
    物品栏: z.record(z.string(), z.object({
      描述: z.string(),
      数量: z.coerce.number(),
    })).transform(data => _.pickBy({ ...data }, ({ 数量 }) => 数量 > 0)),
    打屁股统计: z.object({
      总次数: z.coerce.number(),
      菲尔: z.coerce.number(),
      艾莉西亚: z.coerce.number(),
      赛拉: z.coerce.number(),
      艾琳: z.coerce.number(),
      米莉: z.coerce.number(),
      露露: z.coerce.number(),
      拉拉: z.coerce.number(),
    }),
    成就: z.record(z.string(), z.boolean()).transform(obj => ({ ...obj })),
  }),

  菲尔: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean() }),
    专属flag: z.object({
      日记被发现: z.boolean(),
      特训完成: z.boolean(),
      生日已过: z.boolean(),
    }),
  }),

  艾莉西亚: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean(), SQ4: z.boolean() }),
    专属flag: z.object({
      夜间来访发现: z.boolean(),
      赛拉的药水收到: z.boolean(),
      教会祈祷目睹: z.boolean(),
      咒语净化完成: z.boolean(),
      已公开道歉: z.boolean(),
    }),
  }),

  赛拉: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean(), SQ4: z.boolean() }),
    专属flag: z.object({
      下水道初次交手: z.boolean(),
      木剑训练完成: z.boolean(),
      已断绝关系: z.boolean(),
      已成工会教官: z.boolean(),
    }),
  }),

  米莉: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean() }),
    专属flag: z.object({
      三重任务完成: z.boolean(),
      情报网建立: z.boolean(),
      大冒险完成: z.boolean(),
      远程任务解锁: z.boolean(),
    }),
  }),

  艾琳: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean() }),
    专属flag: z.object({
      看店任务完成: z.boolean(),
      离家出走救援: z.boolean(),
      独家情报获得: z.boolean(),
    }),
  }),

  露露拉拉: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean() }),
    选择分支: z.enum(['未选择', '帮助露露', '帮助拉拉']),
    专属flag: z.object({
      姐妹争吵目睹: z.boolean(),
      父亲救援完成: z.boolean(),
    }),
  }),

  哈尼: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean(), SQ4: z.boolean() }),
    专属flag: z.object({
      问卷完成: z.boolean(),
      消费金额: z.coerce.number(),
      真相之板已赠送: z.boolean(),
    }),
  }),

  玛丽亚: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    支线完成: z.object({ SQ1: z.boolean(), SQ2: z.boolean(), SQ3: z.boolean() }),
    专属flag: z.object({
      废弃教会秘密: z.boolean(),
      考试通过: z.boolean(),
      瘟疫事件完成: z.boolean(),
    }),
  }),
});

export type Schema = z.output<typeof Schema>;
