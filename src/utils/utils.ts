import i18n from '@/languages'
import type { MergeList } from '@/stores/useStoryListStore'
import type { SystemInfo, SystemName } from '@/types/utils'
import { message } from 'ant-design-vue'
import {FFmpeg} from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
// import { FFmpeg } from '@/assets/js/ffmpeg/ffmpeg/index'
// import { fetchFile, toBlobURL } from '@/assets/js/ffmpeg/utils/index'
export function debounce(fn: Function, wait: number = 500) {
  let timeout: number | null = null
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

export async function handleDownload(
  url: string,
  name: string = new Date().getTime().toString()
): Promise<void> {
  const res = await fetch(url)
  const blob = await res.blob()
  const objectUrl = window.URL.createObjectURL(blob)
  download(objectUrl, name)
}

export function download(objectUrl: string, name: string) {
  const a = document.createElement('a')
  a.download = name
  a.href = objectUrl
  a.click()
  window.URL.revokeObjectURL(objectUrl)
  a.remove()
}

export function getSystemOsName(): SystemName {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('Windows') !== -1) return 'Windows'
  if (userAgent.indexOf('X11') !== -1) return 'UNIX'
  if (userAgent.indexOf('Linux') !== -1) return 'Linux'
  if (/(iPhone|iPad|iPod|iOS)/i.test(userAgent)) return 'IOS'
  if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1) return 'Android'
  if (/macintosh|mac os x/i.test(userAgent)) return 'Mac'
  return 'Other'
}

export function getSystemInfo(): SystemInfo {
  const osName = getSystemOsName()
  const isAndroid = osName === 'Android'
  const isIOS = osName === 'IOS'
  const isWin = osName === 'Windows'
  const isMac = osName === 'Mac'
  const isPC = osName === 'IOS' || osName === 'Android' ? false : true
  return {
    osName,
    isAndroid,
    isIOS,
    isWin,
    isMac,
    isPC
  }
}

export const handleReadText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = () => {
      const content = reader.result as string
      resolve(content)
    }
    reader.onerror = (err) => {
      console.error('read file err' + JSON.stringify(err))
      reject(err)
    }
  })
}

export const createUUID = (): string => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 *
 * @param list
 * @returns
 */
export const mergerVideo = async (list: MergeList) => {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  const ffmpeg = new FFmpeg()
  ffmpeg.on('log', (e) => {
    console.log(e)
  })
  if (!ffmpeg.loaded) {
    try {
      const c = message.loading(i18n.global.t('loadingMessage.loadFFmpeg'), 0)
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      })
      c()
    } catch (err) {
      console.error(err)
      message.error(i18n.global.t('errorMessage.loadFailed'))
    }
  }
  const e = message.loading(i18n.global.t('loadingMessage.mergeVideoing'), 0)
  let concatStr = 'concat:'
  for await (const item of list) {
    const i = item.idx
    const url = item.url
    const name = `video${i}`
    concatStr += name + '.ts' + '|'
    await ffmpeg.writeFile(name + '.mp4', await fetchFile(url))
    // concat协议 适合视频MPEG格式，其他格式文件，先转码再合并
    await ffmpeg.exec([
      '-i',
      name + '.mp4',
      '-c',
      'copy',
      '-bsf:v',
      'h264_mp4toannexb',
      '-f',
      'mpegts',
      name + '.ts'
    ])
  }
  concatStr = concatStr.slice(0, concatStr.length - 1)
  await ffmpeg.exec([
    '-i',
    concatStr,
    '-c',
    'copy',
    '-bsf:a',
    'aac_adtstoasc',
    '-movflags',
    '+faststart',
    'out.mp4'
  ])
  const data = await ffmpeg.readFile('out.mp4')
  const url = URL.createObjectURL(
    new Blob([(data as unknown as Uint8Array).buffer], { type: 'video/mp4' })
  )
  download(url, 'merge_video.mp4')
  e()
  return Promise.resolve()
}

// export const mergerVideo = async (list: MergeList) => {
//   const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
//   const ffmpeg = new FFmpeg()
//   ffmpeg.on('log', (e) => {
//     console.log(e)
//   })
//   if (!ffmpeg.loaded) {
//     const c = message.loading(i18n.global.t('loadingMessage.loadFFmpeg'), 0)
//     await ffmpeg.load({
//       coreURL:  await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
//       wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
//     })
//     c()
//   }
//   const e = message.loading(i18n.global.t('loadingMessage.mergeVideoing'), 0)
//   const newList = []
//   for await (const item of list) {
//     const i = item.idx
//     const url = item.url
//     const name = `video${i}`
//     const mp4Name = name + '.mp4'
//     await ffmpeg.writeFile(mp4Name, await fetchFile(url))

//     //TODO 判断有没有音频 生成空白音轨插入该视频
//     const err = await ffmpeg.exec(['-i', mp4Name, '-vn', '-f', 'null', '-'])
//     if (err) {
//       try {
//         // 没有音频，添加空音轨
//         const res = await ffmpeg.exec([
//           '-i',
//           mp4Name,
//           '-f',
//           'lavfi',
//           '-i',
//           'anullsrc',
//           '-c:v',
//           'copy',
//           '-shortest',
//           '-map',
//           '0:v',
//           '-map',
//           '1:a',
//           '-y',
//           'blank_' + mp4Name
//         ])
//         console.warn('out blank video', res)
//         newList.push('blank_' + mp4Name)
//       } catch (err) {
//         console.error('read', err)
//       }
//     } else {
//       newList.push(mp4Name)
//     }

//     // concat协议 适合视频MPEG格式，其他格式文件，先转码再合并
//     // await ffmpeg.exec([
//     //   '-i',
//     //   name + '.mp4',
//     //   '-c',
//     //   'copy',
//     //   '-bsf:v',
//     //   'h264_mp4toannexb',
//     //   '-f',
//     //   'mpegts',
//     //   name + '.ts'
//     // ])
//   }
//   const arr: string[] = []
//   let str = ''
//   newList.forEach((path, idx) => {
//     arr.push('-i')
//     arr.push(path)

//     str += `[${idx}:v:0][${idx}:a:0]`
//   })
//   console.log('newList', newList)
//   str += `concat=n=${newList.length}:v=1:a=1[outv][outa]`
//   console.warn('-----------------------------', str)
//   console.warn('-----------------------------', arr)
//   const par = [...arr, '-filter_complex', str, '-map', '[outv]', '-map', '[outa]', 'out.mp4']
//   console.warn('par', par)
//   // for await (const item of newList) {
//   //   console.warn('url', item)
//   //   const re = await ffmpeg.readFile(item)
//   //   console.warn('decode', re)
//   //   const url = URL.createObjectURL(
//   //     new Blob([(re as unknown as Uint8Array).buffer], { type: 'video/mp4' })
//   //   )
//   //   download(url, 'merge_video.mp4')
//   // }

//   try {
//     const res = await ffmpeg.exec(par, 2000)
//     console.warn('-merge-----------', res)
//   } catch (err) {
//     console.error(err)
//   }
//   const data = await ffmpeg.readFile('out.mp4')
//   const url = URL.createObjectURL(
//     new Blob([(data as unknown as Uint8Array).buffer], { type: 'video/mp4' })
//   )
//   download(url, 'merge_video.mp4')
//   e()
//   return Promise.resolve()
// }

// export const mergerVideo = async (list: MergeList) => {
//   // @ts-ignore

//   const ffmpeg = createFFmpeg({
//     log: true
//     // corePath: '/public/ffmpeg-core.js'
//   })
//   if (!ffmpeg.isLoaded()) {
//     try {
//       const c = message.loading(i18n.global.t('loadingMessage.loadFFmpeg'))
//       await ffmpeg.load()
//       c()
//     } catch (err) {
//       message.error(i18n.global.t('errorMessage.loadFailed'))
//     }
//   }

//   const e = message.loading(i18n.global.t('loadingMessage.mergeVideoing'), 0)
//   const newList = []
//   for await (const item of list) {
//     const i = item.idx
//     const url = item.url
//     const name = `video${i}`
//     const mp4Name = name + '.mp4'
//     ffmpeg.FS('writeFile', mp4Name, await fetchFile(url))

//     //TODO 判断有没有音频 生成空白音轨插入该视频
//     const err: any = await ffmpeg.run('-i', mp4Name, '-vn', '-acodec', 'copy', '-f', 'null', '/dev/null')
//     debugger
//     // const tempRead = ffmpeg.FS('readFile', 'temp.mp4')
    
//     if (err) {
//       try {
//         // 没有音频，添加空音轨
//         debugger
//         const res = await ffmpeg.run(
//           '-i',
//           mp4Name,
//           '-f',
//           'lavfi',
//           '-i',
//           'anullsrc',
//           '-c:v',
//           'copy',
//           '-shortest',
//           '-map',
//           '0:v',
//           '-map',
//           '1:a',
//           '-y',
//           'blank_' + mp4Name
//         )
//         console.warn('out blank video', res)
//         newList.push('blank_' + mp4Name)
//       } catch (err) {
//         console.error('read', err)
//       }
//     } else {
//       newList.push(mp4Name)
//     }

//     // concat协议 适合视频MPEG格式，其他格式文件，先转码再合并
//     // await ffmpeg.exec([
//     //   '-i',
//     //   name + '.mp4',
//     //   '-c',
//     //   'copy',
//     //   '-bsf:v',
//     //   'h264_mp4toannexb',
//     //   '-f',
//     //   'mpegts',
//     //   name + '.ts'
//     // ])
//   }

//   const arr: string[] = []
//   let str = ''
//   newList.forEach((path, idx) => {
//     arr.push('-i')
//     arr.push(path)

//     str += `[${idx}:v:0][${idx}:a:0]`
//   })
//   console.log('newList', newList)
//   str += `concat=n=${newList.length}:v=1:a=1[outv][outa]`
//   console.warn('-----------------------------', str)
//   console.warn('-----------------------------', arr)
//   const par = [...arr, '-filter_complex', str, '-map', '[outv]', '-map', '[outa]', 'out.mp4']
//   console.warn('par', par)
//   // for await (const item of newList) {
//   //   console.warn('url', item)
//   //   const re = await ffmpeg.readFile(item)
//   //   console.warn('decode', re)
//   //   const url = URL.createObjectURL(
//   //     new Blob([(re as unknown as Uint8Array).buffer], { type: 'video/mp4' })
//   //   )
//   //   download(url, 'merge_video.mp4')
//   // }

//   try {
//     const res = await ffmpeg.run(
//       ...arr,
//       '-filter_complex',
//       str,
//       '-map',
//       '[outv]',
//       '-map',
//       '[outa]',
//       'out.mp4'
//     )
//     console.warn('-merge-----------', res)
//   } catch (err) {
//     console.error('merge failed', err)
//   }
//   const data = ffmpeg.FS('readFile', 'out.mp4')
//   const url = URL.createObjectURL(
//     new Blob([(data as unknown as Uint8Array).buffer], { type: 'video/mp4' })
//   )
//   download(url, 'merge_video.mp4')
//   e()
//   return Promise.resolve()
// }
