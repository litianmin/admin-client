import request from '@/utils/request'

// export function CreateGame(name, platform, logoOrigin, logoMini, displayImgList, downloadLink, briefDesc) {
//   return request({
//     url: '/gamecreate',
//     method: 'post',
//     data: {
//       name,
//       platform,
//       logoOrigin,
//       logoMini,
//       displayImgList,
//       downloadLink,
//       briefDesc
//     }
//   })
// }

export default {
  CreateOfficialActivity (data) {
    return request({
      url: '/officialActivity/create',
      method: 'post',
      data: data
    })
  }
}




