import request from '@/utils/request'

export function login(u_name, pwd) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      u_name,
      pwd
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
