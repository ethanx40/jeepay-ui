<template>
  <page-header-wrapper>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" class="table-head-ground">
          <div class="table-layer">
            <jeepay-text-up placeholder="申请单号" v-model:value="searchData.applyId" />
            <jeepay-text-up placeholder="商户名称" v-model:value="searchData.mchName" />
            <a-select
              v-model:value="searchData.applyState"
              placeholder="申请状态"
              class="table-head-layout"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="0">待提交</a-select-option>
              <a-select-option value="1">审核中</a-select-option>
              <a-select-option value="2">审核通过</a-select-option>
              <a-select-option value="3">审核拒绝</a-select-option>
            </a-select>
            <a-select
              v-model:value="searchData.channelCode"
              placeholder="申请渠道"
              class="table-head-layout"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="WXPAY">微信支付</a-select-option>
              <a-select-option value="ALIPAY">支付宝</a-select-option>
              <a-select-option value="UNIONPAY">云闪付</a-select-option>
            </a-select>
            <a-range-picker
              v-model:value="searchData.createdTime"
              class="table-head-layout"
              :placeholder="['开始时间', '结束时间']"
            />
            <span class="table-page-search-submitButtons" style="flex-grow: 0; flex-shrink: 0">
              <a-button type="primary" :loading="vdata.btnLoading" @click="queryFunc">
                查询
              </a-button>
              <a-button style="margin-left: 8px" @click="searchData = {}">重置</a-button>
            </span>
          </div>
        </a-form>
      </div>

      <!-- 列表渲染 -->
      <JeepayTable
        ref="infoTable"
        :init-data="true"
        :req-table-data-func="reqTableDataFunc"
        :table-columns="tableColumns"
        :search-data="searchData"
        row-key="applyId"
        @btnLoadClose="vdata.btnLoading = false"
      >
        <template #opRow>
          <a-button type="primary" @click="batchAuditFunc" :disabled="!selectedRowKeys.length">
            批量审核
          </a-button>
          <a-button style="margin-left: 8px" @click="exportFunc">
            导出数据
          </a-button>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'applyId'">
            <b>{{ record.applyId }}</b>
          </template>

          <template v-if="column.key === 'mchName'">
            <a @click="detailFunc(record.applyId)">{{ record.mchName }}</a>
          </template>

          <template v-if="column.key === 'applyState'">
            <a-badge
              :status="getStateStatus(record.applyState)"
              :text="getStateText(record.applyState)"
            />
          </template>

          <template v-if="column.key === 'channelCodes'">
            <a-tag
              v-for="channel in record.channelCodes?.split(',')"
              :key="channel"
              :color="getChannelColor(channel)"
            >
              {{ getChannelText(channel) }}
            </a-tag>
          </template>

          <template v-if="column.key === 'operation'">
            <a-button type="link" @click="detailFunc(record.applyId)">
              查看详情
            </a-button>
            <a-button
              v-if="record.applyState === 1"
              type="link"
              @click="auditFunc(record.applyId, 2)"
            >
              通过
            </a-button>
            <a-button
              v-if="record.applyState === 1"
              type="link"
              style="color: red"
              @click="auditFunc(record.applyId, 3)"
            >
              拒绝
            </a-button>
            <a-button
              v-if="record.applyState === 2"
              type="link"
              @click="triggerChannelFunc(record.applyId)"
            >
              触发进件
            </a-button>
            <a-button
              type="link"
              style="color: red"
              @click="delFunc(record.applyId)"
              v-if="$access('ENT_MCH_APPLY_DEL')"
            >
              删除
            </a-button>
          </template>
        </template>
      </JeepayTable>
    </a-card>

    <!-- 详情抽屉 -->
    <MchApplyDetail ref="detailRef" />

    <!-- 审核弹窗 -->
    <a-modal
      v-model:open="auditModal.visible"
      :title="auditModal.title"
      @ok="handleAuditSubmit"
      @cancel="auditModal.visible = false"
    >
      <a-form :model="auditModal.form" layout="vertical">
        <a-form-item label="审核意见" name="auditRemark">
          <a-textarea
            v-model:value="auditModal.form.auditRemark"
            placeholder="请输入审核意见"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 批量审核弹窗 -->
    <a-modal
      v-model:open="batchAuditModal.visible"
      title="批量审核"
      @ok="handleBatchAuditSubmit"
      @cancel="batchAuditModal.visible = false"
    >
      <a-form :model="batchAuditModal.form" layout="vertical">
        <a-form-item label="审核结果" name="auditResult">
          <a-radio-group v-model:value="batchAuditModal.form.auditResult">
            <a-radio :value="2">通过</a-radio>
            <a-radio :value="3">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核意见" name="auditRemark">
          <a-textarea
            v-model:value="batchAuditModal.form.auditRemark"
            placeholder="请输入审核意见"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 触发进件弹窗 -->
    <a-modal
      v-model:open="triggerModal.visible"
      title="触发渠道进件"
      @ok="handleTriggerSubmit"
      @cancel="triggerModal.visible = false"
    >
      <a-form :model="triggerModal.form" layout="vertical">
        <a-form-item label="选择渠道" name="channelCode">
          <a-checkbox-group v-model:value="triggerModal.form.channelCodes">
            <a-row>
              <a-col :span="8" v-for="channel in triggerModal.channels" :key="channel">
                <a-checkbox :value="channel">
                  {{ getChannelText(channel) }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import { message } from 'ant-design-vue'
import {
  getMchApplyList,
  auditMchApply,
  batchAuditMchApply,
  triggerChannelApply,
  deleteMchApply,
  exportMchApply
} from '@/api/mchApply'
import { req } from '@/api/manage'
import MchApplyDetail from './MchApplyDetail.vue'

const { $infoBox } = getCurrentInstance()!.appContext.config.globalProperties

const infoTable = ref()
const detailRef = ref()
const selectedRowKeys = ref<string[]>([])

const vdata: any = reactive({
  btnLoading: false
})

const searchData = reactive({})

const tableColumns = [
  {
    title: '申请单号',
    dataIndex: 'applyId',
    key: 'applyId',
    width: 150
  },
  {
    title: '商户名称',
    dataIndex: 'mchName',
    key: 'mchName',
    width: 200
  },
  {
    title: '申请状态',
    dataIndex: 'applyState',
    key: 'applyState',
    width: 120
  },
  {
    title: '申请渠道',
    dataIndex: 'channelCodes',
    key: 'channelCodes',
    width: 200
  },
  {
    title: '联系人',
    dataIndex: 'contactName',
    key: 'contactName',
    width: 120
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone',
    key: 'contactPhone',
    width: 150
  },
  {
    title: '申请时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180
  },
  {
    title: '操作',
    key: 'operation',
    width: 250,
    fixed: 'right'
  }
]

// 审核弹窗
const auditModal = reactive({
  visible: false,
  title: '',
  applyId: '',
  auditResult: 0,
  form: {
    auditRemark: ''
  }
})

// 批量审核弹窗
const batchAuditModal = reactive({
  visible: false,
  form: {
    auditResult: 2,
    auditRemark: ''
  }
})

// 触发进件弹窗
const triggerModal = reactive({
  visible: false,
  applyId: '',
  channels: [],
  form: {
    channelCodes: []
  }
})

// 请求表格数据
const reqTableDataFunc = (params: any) => {
  return getMchApplyList(params)
}

// 查询
const queryFunc = () => {
  vdata.btnLoading = true
  infoTable.value.refTable()
}

// 查看详情
const detailFunc = (applyId: string) => {
  detailRef.value.show(applyId)
}

// 审核
const auditFunc = (applyId: string, auditResult: number) => {
  auditModal.applyId = applyId
  auditModal.auditResult = auditResult
  auditModal.title = auditResult === 2 ? '审核通过' : '审核拒绝'
  auditModal.form.auditRemark = ''
  auditModal.visible = true
}

// 提交审核
const handleAuditSubmit = async () => {
  try {
    const response = await auditMchApply(auditModal.applyId, {
      auditResult: auditModal.auditResult,
      auditRemark: auditModal.form.auditRemark
    })
    
    if (response.code === 0) {
      message.success('审核成功')
      auditModal.visible = false
      queryFunc()
    } else {
      message.error(response.msg || '审核失败')
    }
  } catch (error) {
    console.error('审核失败:', error)
    message.error('审核失败')
  }
}

// 批量审核
const batchAuditFunc = () => {
  if (!selectedRowKeys.value.length) {
    message.warning('请选择要审核的申请')
    return
  }
  batchAuditModal.form.auditResult = 2
  batchAuditModal.form.auditRemark = ''
  batchAuditModal.visible = true
}

// 提交批量审核
const handleBatchAuditSubmit = async () => {
  try {
    const response = await batchAuditMchApply({
      applyIds: selectedRowKeys.value,
      auditResult: batchAuditModal.form.auditResult,
      auditRemark: batchAuditModal.form.auditRemark
    })
    
    if (response.code === 0) {
      message.success('批量审核成功')
      batchAuditModal.visible = false
      selectedRowKeys.value = []
      queryFunc()
    } else {
      message.error(response.msg || '批量审核失败')
    }
  } catch (error) {
    console.error('批量审核失败:', error)
    message.error('批量审核失败')
  }
}

// 触发渠道进件
const triggerChannelFunc = async (applyId: string) => {
  // 获取申请详情，获取渠道列表
  try {
    const response = await req.getById('/api/mchApply', applyId)
    if (response.code === 0) {
      triggerModal.applyId = applyId
      triggerModal.channels = response.data.channelCodes.split(',')
      triggerModal.form.channelCodes = []
      triggerModal.visible = true
    }
  } catch (error) {
    message.error('获取申请信息失败')
  }
}

// 提交触发进件
const handleTriggerSubmit = async () => {
  if (!triggerModal.form.channelCodes.length) {
    message.warning('请选择要触发的渠道')
    return
  }
  
  try {
    const promises = triggerModal.form.channelCodes.map(channelCode =>
      triggerChannelApply(triggerModal.applyId, channelCode)
    )
    
    await Promise.all(promises)
    message.success('触发进件成功')
    triggerModal.visible = false
    queryFunc()
  } catch (error) {
    console.error('触发进件失败:', error)
    message.error('触发进件失败')
  }
}

// 删除
const delFunc = (applyId: string) => {
  $infoBox.confirmDanger('确认删除该进件申请？', '删除后无法恢复！', async () => {
    try {
      const response = await deleteMchApply(applyId)
      if (response.code === 0) {
        message.success('删除成功')
        queryFunc()
      } else {
        message.error(response.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  })
}

// 导出数据
const exportFunc = async () => {
  try {
    const response = await exportMchApply(searchData)
    // 处理文件下载
    const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `商户进件申请_${new Date().getTime()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    message.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出失败')
  }
}

// 获取状态样式
const getStateStatus = (state: number) => {
  const statusMap: any = {
    0: 'default',
    1: 'processing',
    2: 'success',
    3: 'error'
  }
  return statusMap[state] || 'default'
}

// 获取状态文本
const getStateText = (state: number) => {
  const textMap: any = {
    0: '待提交',
    1: '审核中',
    2: '审核通过',
    3: '审核拒绝'
  }
  return textMap[state] || '未知'
}

// 获取渠道颜色
const getChannelColor = (channel: string) => {
  const colorMap: any = {
    WXPAY: 'green',
    ALIPAY: 'blue',
    UNIONPAY: 'orange'
  }
  return colorMap[channel] || 'default'
}

// 获取渠道文本
const getChannelText = (channel: string) => {
  const textMap: any = {
    WXPAY: '微信支付',
    ALIPAY: '支付宝',
    UNIONPAY: '云闪付'
  }
  return textMap[channel] || channel
}
</script>