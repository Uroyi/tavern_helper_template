$(async () => {
  const getVars = () => getAllVariables();
  const get = (path: string) => _.get(getVars(), `stat_data.${path}`);

  injectPrompts([
    // ===== 主线章节推进 =====
    {
      id: '第一章_城门初见',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第一章·城门初见艾莉西亚】】',
      filter: () =>
        get('主线.章节') === 1 &&
        !get('主线.关键flag.见过艾莉西亚城门出场'),
      should_scan: true,
    },
    {
      id: '第一章_设施引导',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第一章·设施引导】】',
      filter: () =>
        get('主线.章节') === 1 &&
        get('主线.关键flag.见过艾莉西亚城门出场') === true &&
        get('主线.关键flag.完成冒险者登记') === true &&
        !get('主线.关键flag.完成设施引导'),
      should_scan: true,
    },
    {
      id: '第一章_初级任务',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第一章·初级任务】】',
      filter: () =>
        get('主线.章节') === 1 &&
        get('主线.第一章_任务完成数') >= 0 &&
        get('主线.第一章_任务完成数') < 3,
      should_scan: true,
    },
    {
      id: '第一章_完成过渡',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第一章→第二章·工会长委托】】',
      filter: () =>
        get('主线.章节') === 1 &&
        get('主线.第一章_任务完成数') >= 3,
      should_scan: true,
    },
    {
      id: '第二章_下水道调查',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第二章·下水道调查】】',
      filter: () =>
        get('主线.章节') === 2 &&
        !get('主线.第二章_下水道调查完成'),
      should_scan: true,
    },
    {
      id: '第二章_完成过渡',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第二章→第三章·匿名信】】',
      filter: () =>
        get('主线.章节') === 2 &&
        get('主线.第二章_下水道调查完成') === true,
      should_scan: true,
    },
    {
      id: '第三章_罗森堡旧宅',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第三章·罗森堡旧宅真相】】',
      filter: () =>
        get('主线.章节') === 3 &&
        !get('主线.第三章_真相揭露'),
      should_scan: true,
    },
    {
      id: '第四章A_救赎',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第四章A·救赎之路】】',
      filter: () =>
        get('主线.章节') === 4 &&
        get('主线.路线') === '救赎' &&
        !get('主线.第四章_完成'),
      should_scan: true,
    },
    {
      id: '第四章B_制裁',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【第四章B·制裁之路】】',
      filter: () =>
        get('主线.章节') === 4 &&
        get('主线.路线') === '制裁' &&
        !get('主线.第四章_完成'),
      should_scan: true,
    },

    // ===== 角色支线触发 =====
    {
      id: '菲尔_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【菲尔·秘密日记】】',
      filter: () =>
        get('菲尔.好感度') >= 30 &&
        !get('菲尔.支线完成.SQ1') &&
        get('世界.当前地点') === '旅店',
      should_scan: true,
    },
    {
      id: '菲尔_SQ2',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【菲尔·特训发现】】',
      filter: () =>
        get('主线.章节') >= 2 &&
        get('菲尔.好感度') >= 50 &&
        get('菲尔.支线完成.SQ1') === true &&
        !get('菲尔.支线完成.SQ2'),
      should_scan: true,
    },
    {
      id: '艾莉西亚_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【艾莉西亚·夜间来访】】',
      filter: () =>
        get('主线.章节') >= 1 &&
        get('主线.关键flag.见过艾莉西亚城门出场') === true &&
        !get('艾莉西亚.支线完成.SQ1') &&
        get('世界.当前地点') === '罗森堡旧宅',
      should_scan: true,
    },
    {
      id: '赛拉_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【赛拉·沉默的指针】】',
      filter: () =>
        get('主线.章节') >= 2 &&
        get('赛拉.专属flag.下水道初次交手') === true &&
        !get('赛拉.支线完成.SQ1'),
      should_scan: true,
    },
    {
      id: '米莉_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【米莉·三重任务】】',
      filter: () =>
        get('米莉.好感度') >= 10 &&
        !get('米莉.支线完成.SQ1') &&
        get('主角.打屁股统计.菲尔') > 0,
      should_scan: true,
    },
    {
      id: '艾琳_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【艾琳·帮忙看店】】',
      filter: () =>
        get('艾琳.好感度') >= 5 &&
        !get('艾琳.支线完成.SQ1') &&
        get('世界.当前地点') === '酒馆',
      should_scan: true,
    },
    {
      id: '露露拉拉_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【露露拉拉·姐妹争吵】】',
      filter: () =>
        get('露露拉拉.好感度') >= 5 &&
        !get('露露拉拉.支线完成.SQ1') &&
        get('世界.当前地点') === '旅店',
      should_scan: true,
    },
    {
      id: '哈尼_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【哈尼·问卷调查】】',
      filter: () =>
        !get('哈尼.支线完成.SQ1') &&
        get('世界.当前地点') === '商店',
      should_scan: true,
    },
    {
      id: '玛丽亚_SQ1',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【玛丽亚·废弃教会秘密】】',
      filter: () =>
        get('玛丽亚.好感度') >= 10 &&
        !get('玛丽亚.支线完成.SQ1'),
      should_scan: true,
    },

    // ===== 全篇完成检查 =====
    {
      id: '全篇完成',
      position: 'none',
      depth: 0,
      role: 'system',
      content: '【【全篇完成·尾声】】',
      filter: () => {
        const allChars = ['菲尔', '艾莉西亚', '赛拉', '米莉', '艾琳', '露露拉拉', '玛丽亚'];
        const allSQDone = allChars.every((name) => {
          const sq = get(`${name}.支线完成`);
          if (!sq) return false;
          return Object.values(sq as Record<string, boolean>).every((v) => v === true);
        });
        return (
          get('主线.第四章_完成') === true &&
          allSQDone &&
          get('哈尼.专属flag.真相之板已赠送') === true
        );
      },
      should_scan: true,
    },
  ]);
});
