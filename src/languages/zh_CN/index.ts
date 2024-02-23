export default {
  common: {
    backHome: '回到首页',
    creating: '已加入任务队列制作中...',
    queuing: '排队中',
    hasQueueNum: '还有{number}位',
    submit: '提交',
    useScriptCreate: '使用该剧本生成视频',
    useAllScriptCreate: '直接生成该故事下所有剧本的所有视频',
    leftTime: '还剩{time}秒',
    waitNum: '您仍然需要等待 {number} 用户'
  },

  home: {
    title: '使用Limino.ai将您的故事变成影片。',
    smallTitle:
      '创新使用 AI 从文本生成动漫视频的过程。我们聚合整个工作流程，为B方和C方提供端到端的AI动漫生成服务。这使任何人都可以成为动漫制作人。',
    startBtn: '开始创作',
    selectStyle: '选择您喜欢的风格',
    pieceTit: '标题或故事标题',
    creator: '创作者',
    authorNamePlaceholder: '作者姓名',
    chooseStyleTit: '选择绘图样式',
    noContent: '目前没有作品',
    yourPieces: '您的作品',
    community: '社区',
    pieceIptPlaceholder: '为您的作品命名',
    realistic: '写实',
    anime: '动漫'
  },
  login: {
    title: '一键生成串行化',
    title2: '来自文本内容的漫画和动漫视频。',
    brandTit: 'LiminoAI',
    loginToLimino: '登录到Limino',
    signToGoogle: '使用谷歌账户登录',
    inputEmail: '输入您的邮箱地址',
    emailTit: '填写邮箱地址申请加入白名单',
    loginIn: '登录到 LiminoAI',
    logout: '登出'
  },
  workbench: {
    brandTit: 'limino.ai',
    components: {
      mergeVideo: '合成',
      step: {
        story: '故事',
        character: '角色',
        paragraph: '剧本',
        post: '发布'
      },
      free: '免费',
      freeDesc: '您当前使用的是免费版本',
      claim: '领取奖励',
      starter: '开始',
      current: '目前',
      startTip1: '1200 Token',
      startTip2: 'Al 故事生成',
      startTip3: '上传图片以供参考',
      startTip4: '成分控制',
      startTip5: '区域修改',
      startTip6: '定制品格训练',
      pro: 'PRO',
      proTip1: '4500 代币（每月充值）',
      proTip2: '入门包中的所有功能',
      proTip3: '4K超分辨率成像',
      proBtn: '$ 15 /月',
      history: {
        tit: '最近的更改历史记录',
        label: '每日奖励'
      },
      noVideo: '该剧本还没有生成视频'
    },
    views: {
      character: {
        newCharacter: '新增',
        characters: '所有角色',
        history: '历史',
        like: '喜欢',
        dislike: '不喜欢',
        character: '角色',
        name: '名称',
        prompt: '外观提示词',
        generate: '生成',
        confirmDetete: '你确定删除角色吗？',
        placeholderIpt: '1女孩，长发，卷发，棕色头发，棕色眼睛，绿色背心，刺绣背心，蓝色短裤，短裤'
      },
      story: {
        newStoryTit: '新故事',
        newChapter: '新增',
        tellAStory: '讲一个故事',
        iptContent: '输入的内容最好在1000字以内',
        storyText: '故事文本',
        skipStory: '跳过故事，直接从皮肤开始？',
        clickStep: '点击跳过',
        deleteConfirm: '你确定删除故事吗？',
        enterAstory: '输入你的故事...',
        placeSeletedData: '请选择一个故事',
        addContent: '添加内容',
        tip: '故事内容录入完成后，会自动创建角色，并转换为剧本。',
        generateRoleStory: '生成角色与剧本',
        generateStolyContent: '生成故事内容'
      },
      cover: {
        pageTit: '封面',
        prompt: '封面提示词',
        placeholder: '输入提示词'
      },
      next: '下一步',
      storyTit: '故事',
      characterDesign: '人物设计',
      piece: '作品',
      panel: '剧本',
      newPanel: '剧本',
      imgDescription: '剧本详情',
      panelList: '剧本列表',
      download: '下载',
      share: '分享',
      setMainVideo: '设为主视频',
      createVideo: '生成视频',
      recreateVideo: '重新生成视频',
      nextStoryboarding: '下一批分镜',
      creating: '生成中',
      fenjing: '分镜'
    }
  },
  components: {
    noData: {
      defaultMsg: '没有记录'
    },
    theModal: {
      confirmText: '确认',
      cancelText: '取消'
    },
    theHeader: {
      companyTit: 'Limino',
      signIn: '登录'
    }
  },
  warnMessage: {
    chooseStyle: '最少选择一个风格!',
    enterStoryAuthor: '请输入作者名称',
    enterStoryName: '请输入故事标题',
    enterStoryCoverPrompt: '请输入封面提示词',
    enterRolePrompt: '请输入外观提示词',
    chooseRole: '请选择一个角色',
    chooseFenjing: '请选择分镜',
    hasQueueWorking: '您当前有任务正在运行，请稍后再试',
    enterStoryText: '请输入故事内容',
    hasFejingQueueWorking: '您当前有分镜生成任务正在运行，请稍后再试',
    noFenjing: '该剧本没有分镜数据',
    chooseMergeVideos: '请选择要合并的视频',
    emailError: '邮箱地址不符合规则',
    duplicateEmail: '您已提交过申请，请耐心等待',
    createAllVideoWarn: '该故事已在队列中，请稍后再试',
    pleaseCreateStory: '请先创建故事'
  },
  successMessage: {
    createSuccess: '已经提交到任务队列，请耐心等待',
    deleteVideoSuccess: '故事删除成功',
    roleUpdateSuccess: '该角色已加入重绘队列，请耐心等待',
    storyCoverUpdateSuccess: '该故事封面已加入重绘队列，请耐心等待',
    setMainVideoSuccess: '设为主视频成功',
    mergeSuccess: '合并成功',
    chooseStyle: '请选择风格',
    emailSuccess: '已提交申请加入白名单，请耐心等待',
    loginSuccess: '登录成功',
    createAllVideosSuccess: '该故事的所有剧本已加入生成视频队列，请耐心等待'
  },
  errorMessage: {
    createStoryFailed: '创建故事失败',
    setMainVideoFailed: '设为主视频失败',
    createFailed: '创建失败',
    loadFailed: '加载失败'
  },
  loadingMessage: {
    loadFFmpeg: '加载视频处理组件,请稍等...',
    loaded: '加载完毕',
    mergeVideoing: '合并视频中...'
  }
}
