/*
 * 商户进件相关API接口
 *
 * @author CodeBuddy
 * @date 2024/01/15
 */

import request from '@/http/request'

/** 商户进件申请相关API **/
export const API_URL_MCH_APPLY = '/api/mchApply'
export const API_URL_MCH_APPLY_MATERIALS = '/api/mchApplyMaterials'

/** 通用请求对象 **/
export const req = {
  // 通用列表查询接口
  list: (url, params) => {
    return request.request({ url: url, method: 'GET', params: params }, true, true, false)
  },

  // 通用新增接口
  add: (url, data) => {
    return request.request({ url: url, method: 'POST', data: data }, true, true, false)
  },

  // 通用查询单条数据接口
  getById: (url, bizId) => {
    return request.request({ url: url + '/' + bizId, method: 'GET' }, true, true, false)
  },

  // 通用修改接口
  updateById: (url, bizId, data) => {
    return request.request({ url: url + '/' + bizId, method: 'PUT', data: data }, true, true, false)
  },

  // 通用删除接口
  delById: (url, bizId) => {
    return request.request({ url: url + '/' + bizId, method: 'DELETE' }, true, true, false)
  }
}

/** 提交商户进件申请 **/
export function submitMchApply(data) {
  return request.request({
    url: API_URL_MCH_APPLY,
    method: 'POST',
    data: data
  }, true, true, true)
}

/** 查询商户进件申请列表 **/
export function getMchApplyList(params) {
  return request.request({
    url: API_URL_MCH_APPLY,
    method: 'GET',
    params: params
  }, true, true, false)
}

/** 查询商户进件申请详情 **/
export function getMchApplyDetail(applyId) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId,
    method: 'GET'
  }, true, true, false)
}

/** 更新商户进件申请 **/
export function updateMchApply(applyId, data) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId,
    method: 'PUT',
    data: data
  }, true, true, true)
}

/** 查询进件材料列表 **/
export function getMchApplyMaterials(applyId) {
  return request.request({
    url: API_URL_MCH_APPLY_MATERIALS,
    method: 'GET',
    params: { applyId: applyId }
  }, true, true, false)
}

/** 上传进件材料 **/
export function uploadMchApplyMaterial(data) {
  return request.request({
    url: API_URL_MCH_APPLY_MATERIALS,
    method: 'POST',
    data: data
  }, true, true, true)
}

/** 删除进件材料 **/
export function deleteMchApplyMaterial(materialId) {
  return request.request({
    url: API_URL_MCH_APPLY_MATERIALS + '/' + materialId,
    method: 'DELETE'
  }, true, true, true)
}

/** 查询支持的支付渠道列表 **/
export function getSupportedChannels() {
  return request.request({
    url: '/api/payWays',
    method: 'GET',
    params: { state: 1 }
  }, true, true, false)
}

/** 查询渠道进件状态 **/
export function getChannelApplyStatus(applyId, channelCode) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId + '/channel/' + channelCode + '/status',
    method: 'GET'
  }, true, true, false)
}

/** 重新提交渠道进件 **/
export function resubmitChannelApply(applyId, channelCode) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId + '/channel/' + channelCode + '/resubmit',
    method: 'POST'
  }, true, true, true)
}

/** 上传图片/文件地址 **/
export const upload = {
  // 进件材料上传
  material: request.baseUrl + '/api/ossFiles/mchApplyMaterial'
}