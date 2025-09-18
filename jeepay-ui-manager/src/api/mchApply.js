/*
 * 商户进件管理相关API接口
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

/** 审核商户进件申请 **/
export function auditMchApply(applyId, data) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId + '/audit',
    method: 'POST',
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

/** 查询渠道进件状态 **/
export function getChannelApplyStatus(applyId, channelCode) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId + '/channel/' + channelCode + '/status',
    method: 'GET'
  }, true, true, false)
}

/** 手动触发渠道进件 **/
export function triggerChannelApply(applyId, channelCode) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId + '/channel/' + channelCode + '/trigger',
    method: 'POST'
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

/** 删除进件申请 **/
export function deleteMchApply(applyId) {
  return request.request({
    url: API_URL_MCH_APPLY + '/' + applyId,
    method: 'DELETE'
  }, true, true, true)
}

/** 导出进件申请数据 **/
export function exportMchApply(params) {
  return request.request({
    url: API_URL_MCH_APPLY + '/export',
    method: 'GET',
    params: params,
    responseType: 'blob'
  }, true, true, true)
}

/** 批量审核进件申请 **/
export function batchAuditMchApply(data) {
  return request.request({
    url: API_URL_MCH_APPLY + '/batchAudit',
    method: 'POST',
    data: data
  }, true, true, true)
}