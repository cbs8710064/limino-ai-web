export default {
  common: {
    backHome: 'Back to the home page',
    creating: 'Added to the task queue in the process of production...',
    queuing: 'In line',
    hasQueueNum: 'In front of there are {number}'
  },

  home: {
    title: 'Turn your story into an anime video with LiminoAl.',
    smallTitle:
      'Innovating the process of generating anime videos from text with AI. we aggregate the whole workflow to provide end-to-end AI anime generation services for both B and C sides. This allows anyone to become an anime producer.',
    startBtn: 'Start Creating',
    selectStyle: 'Select the style you prefer',
    pieceTit: 'Piece Title',
    creator: 'Creator',
    authorNamePlaceholder: 'Author name',
    chooseStyleTit: 'Choose A Drawing Style',
    noContent: 'No content currently',
    yourPieces: 'Your Pieces',
    pieceIptPlaceholder: 'Title your piece',
    realistic: 'Realistic',
    anime: 'Anime'
  },
  login: {
    title: 'One-click generation of serialized',
    title2: 'comics and anime videos from text content.',
    brandTit: 'LiminoAI',
    loginToLimino: 'Login to Limino',
    signToGoogle: 'Sign in with Google'
  },
  workbench: {
    brandTit: 'LiminoAI',
    components: {
      mergeVideo: 'Composite video',
      step: {
        story: 'Story',
        character: 'Character',
        paragraph: 'Paragraph',
        post: 'Post'
      },
      free: 'FREE',
      freeDesc: 'You are currently using the free version',
      claim: 'CLAIM REWARDS',
      starter: 'STARTER',
      current: 'current',
      startTip1: '1200 Token',
      startTip2: 'Al story generation',
      startTip3: 'Upload for lmage reference',
      startTip4: 'Composition Control',
      startTip5: 'Regional Modification',
      startTip6: ' Customized Character Training',
      pro: 'PRO',
      proTip1: '4500 Token (refilled every month)',
      proTip2: "All features from the Starters' Pack",
      proTip3: '4x Super-resolution Imaging',
      proBtn: '$15/MONTH',
      history: {
        tit: 'Recent change history',
        label: 'Daily Rewards'
      },
      noVideo: 'The script has not yet generated a video'
    },
    views: {
      character: {
        newCharacter: 'Add New',
        characters: 'Characters',
        history: 'History',
        like: 'Like',
        dislike: 'Dislike',
        character: 'Character',
        name: 'Name',
        prompt: 'Appearance prompt',
        generate: 'Generate',
        confirmDetete: 'Are you sure you want to remove the character?',
        placeholderIpt:
          '1girl, long hair, curly hair, brown hair, brown eyes, green tank-tops, embroidery tank-tops, blue shorts, short shorts,'
      },
      story: {
        newChapter: 'Add New',
        newStoryTit: 'NewStory',
        tellAStory: 'Tell a story',
        iptContent: 'Inputed content preferably within 1000 words',
        storyText: 'Story Text',
        skipStory: 'Skip story and start directly from the panel?',
        clickStep: 'Click to Skip',
        deleteConfirm: 'Are you sure delete the story?',
        enterAstory: 'Enter Your Story...',
        placeSeletedData: 'Please select at least one story',
        addContent: 'My story',
        tip: 'After the completion of the story content input, characters will be automatically created, and segmentation will be done in script format.',
        generateRoleStory: 'Generate characters and scripts',
        generateStolyContent: 'Generate story content'
      },
      cover: {
        pageTit: 'Cover',
        prompt: 'Cover prompt',
        placeholder: 'Input prompt words'
      },
      next: 'Next',
      storyTit: 'Story',
      characterDesign: 'Character Design',
      piece: 'Post',
      panel: 'Paragraph',
      newPanel: 'New Paragraph',
      imgDescription: 'Paragraph Description',
      panelList: 'Paragraph List',
      download: 'Download',
      share: 'Share',
      setMainVideo: 'Set as the main video',
      createVideo: 'Generate videos',
      nextStoryboarding: 'The next batch of storyboards',
      creating: 'Generating',
      fenjing: 'Storyboarding'
    }
  },
  components: {
    noData: {
      defaultMsg: 'No Records'
    },
    theModal: {
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    },
    theHeader: {
      companyTit: 'Limino',
      signIn: 'Sign in'
    }
  },
  warnMessage: {
    chooseStyle: 'Choose at least one style!',
    enterStoryAuthor: 'Please enter a title for your story.',
    enterStoryName: 'Please enter the name of the author',
    enterRolePrompt: 'Please enter a visual prompt',
    enterStoryCoverPrompt: 'Please enter a cover prompt',
    chooseRole: 'Please select a role',
    chooseFenjing: 'Please select a storyboard',
    hasQueueWorking: 'You currently have a task running, please try again later',
    enterStoryText: 'Please enter the story contents',
    hasFejingQueueWorking:
      'You currently have a storyboard generation task running, please try again later',
    noFenjing: 'There is no storyboard data for the script',
    chooseMergeVideos: 'Please select the videos you want to merge'
  },
  successMessage: {
    createSuccess: 'It has been submitted to the task queue, please be patient',
    deleteVideoSuccess: 'The story was deleted successfully',
    roleUpdateSuccess: 'The character has been added to the redraw queue, please be patient',
    storyCoverUpdateSuccess:
      'This story cover has been added to the redraw queue, please be patient',

    setMainVideoSuccess: 'Set to main video successfully',
    mergeSuccess: 'The merge was successful',
    chooseStyle: 'Please select a style'
  },
  errorMessage: {
    createStoryFailed: 'Failed to create a story',
    setMainVideoFailed: 'Failed to set as the main video',
    createFailed: 'The build failed',
    loadFailed: 'Failed to load'
  },
  loadingMessage: {
    loadFFmpeg: 'Load the video processing component, please wait...',
    loaded: 'Loaded',
    mergeVideoing: 'Merge in video...'
  }
}
