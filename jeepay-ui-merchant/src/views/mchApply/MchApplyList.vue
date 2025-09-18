<template>
  <page-header-wrapper>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" class="table-head-ground">
          <div class="table-layer">
            <jeepay-text-up placeholder="申请单号" v-model:value="vdata.searchData.applyId" />
            <a-select
              v-model:value="vdata.searchData.applyState"
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
              v-model:value="vdata.searchData.channelCode"
              placeholder="申请渠道"
              class="table-head-layout"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="WXPAY">微信支付</a-select-option>
              <a-select-option value="ALIPAY">支付宝</a-select-option>
              <a-select-option value="UNIONPAY">云闪付</a-select-option>
            </a-select>
            <span class="table-page-search-submitButtons" style="flex-grow: 0; flex-shrink: 0">
              <a-button type="primary" @click="queryFunc" :loading="vdata.btnLoading">
                查询
              </a-button>
              <a-button style="margin-left: 8px" @click="() => (vdata.searchData = {})">
                重置
              </a-button>
            </span>
          </div>
        </a-form>
      </div>

      <!-- 列表渲染 -->
      <JeepayTable
        @btnLoadClose="vdata.btnLoading = false"
        ref="infoTable"
        :initData="true"
        :reqTableDataFunc="reqTableDataFunc"
        :tableColumns="vdata.tableColumns"
        :searchData="vdata.searchData"
        rowKey="applyId"
      >
        <template #opRow>
          <a-button type="primary" @click="addFunc">
            新建申请
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
              v-if="record.applyState === 0"
              type="link"
              @click="editFunc(record.applyId)"
            >
              编辑
            </a-button>
            <a-button
              v-if="record.applyState === 3"
              type="link"
              @click="resubmitFunc(record.applyId)"
            >
              重新提交
            </a-button>
          </template>
        </template>
      </JeepayTable>
    </a-card>

    <!-- 详情抽屉 -->
    <MchApplyDetail ref="detailRef" />
  </page-header-wrapper>
</template>

<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { getMchApplyList } from '@/api/mchApply'
import MchApplyDetail from './MchApplyDetail.vue'

const router = useRouter()
const { $infoBox } = getCurrentInstance()!.appContext.config.globalProperties

const infoTable = ref()
const detailRef = ref()

const vdata: any = reactive({
  btnLoading: false,
  searchData: {},
  tableColumns: [
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
      width: 200,
      fixed: 'right'
    }
  ]
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

// 新建申请
const addFunc = () => {
  router.push('/mchApply/form')
}

// 编辑申请
const editFunc = (applyId: string) => {
  router.push(`/mchApply/form?applyId=${applyId}`)
}

// 查看详情
const detailFunc = (applyId: string) => {
  detailRef.value.show(applyId)
}

// 重新提交
const resubmitFunc = (applyId: string) => {
  router.push(`/mchApply/form?applyId=${applyId}&resubmit=true`)
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