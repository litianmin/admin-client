import request from '@/utils/request'

export default {
  NewArticle (data) {
    return request({
      url: '/article/create',
      method: 'post',
      data: data
    })
  }
}




