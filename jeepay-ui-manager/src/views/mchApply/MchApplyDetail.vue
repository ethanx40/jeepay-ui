<template>
  <a-drawer
    v-model:open="visible"
    title="进件申请详情"
    width="60%"
    :maskClosable="false"
    @close="onClose"
  >
    <div v-if="loading" style="text-align: center; padding: 50px">
      <a-spin size="large" />
    </div>

    <div v-else-if="applyData">
      <!-- 基本信息 -->
      <a-card type="inner" title="基本信息" style="margin-bottom: 16px">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="申请单号">
            {{ applyData.applyId }}
          </a-descriptions-item>
          <a-descriptions-item label="申请状态">
            <a-badge
              :status="getStateStatus(applyData.applyState)"
              :text="getStateText(applyData.applyState)"
            />
          </a-descriptions-item>
          <a-descriptions-item label="商户名称">
            {{ applyData.mchName }}
          </a-descriptions-item>
          <a-descriptions-item label="商户简称">
            {{ applyData.mchShortName }}
          </a-descriptions-item>
          <a-descriptions-item label="商户类型">
            {{ getMchTypeText(applyData.mchType) }}
          </a-descriptions-item>
          <a-descriptions-item label="行业类别">
            {{ getIndustryTypeText(applyData.industryType) }}
          </a-descriptions-item>
          <a-descriptions-item label="申请渠道" :span="2">
            <a-tag
              v-for="channel in applyData.channelCodes?.split(',')"
              :key="channel"
              :color="getChannelColor(channel)"
            >
              {{ getChannelText(channel) }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 联系信息 -->
      <a-card type="inner" title="联系信息" style="margin-bottom: 16px">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="联系人">
            {{ applyData.contactName }}
          </a-descriptions-item>
          <a-descriptions-item label="联系电话">
            {{ applyData.contactPhone }}
          </a-descriptions-item>
          <a-descriptions-item label="联系邮箱">
            {{ applyData.contactEmail }}
          </a-descriptions-item>
          <a-descriptions-item label="经营地址">
            {{ applyData.businessAddress }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 业务信息 -->
      <a-card type="inner" title="业务信息" style="margin-bottom: 16px">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="业务描述">
            {{ applyData.businessDesc }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 渠道进件状态 -->
      <a-card type="inner" title="渠道进件状态" style="margin-bottom: 16px">
        <a-table
          :columns="channelColumns"
          :data-source="channelStatusList"
          :pagination="false"
          row-key="channelCode"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'channelCode'">
              <a-tag :color="getChannelColor(record.channelCode)">
                {{ getChannelText(record.channelCode) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'channelState'">
              <a-badge
                :status="getChannelStateStatus(record.channelState)"
                :text="getChannelStateText(record.channelState)"
              />
            </template>
            <template v-if="column.key === 'operation'">
              <a-button
                v-if="record.channelState !== 2"
                type="link"
                @click="triggerChannel(record.channelCode)"
              >
                触发进件
              </a-button>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- 申请材料 -->
      <a-card type="inner" title="申请材料" style="margin-bottom: 16px">
        <a-row :gutter="16">
          <a-col :span="12" v-if="materialData.businessLicense">
            <div class="material-item">
              <div class="material-label">营业执照</div>
              <a-image
                :width="200"
                :src="materialData.businessLicense"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </div>
          </a-col>
          <a-col :span="12" v-if="materialData.legalIdCard">
            <div class="material-item">
              <div class="material-label">法人身份证</div>
              <div v-for="(url, index) in materialData.legalIdCard.split(',')" :key="index">
                <a-image
                  :width="200"
                  :src="url"
                  style="margin-right: 8px; margin-bottom: 8px"
                />
              </div>
            </div>
          </a-col>
          <a-col :span="12" v-if="materialData.bankLicense">
            <div class="material-item">
              <div class="material-label">银行开户许可证</div>
              <a-image :width="200" :src="materialData.bankLicense" />
            </div>
          </a-col>
          <a-col :span="12" v-if="materialData.otherMaterials">
            <div class="material-item">
              <div class="material-label">其他材料</div>
              <div v-for="(url, index) in materialData.otherMaterials.split(',')" :key="index">
                <a-image
                  :width="200"
                  :src="url"
                  style="margin-right: 8px; margin-bottom: 8px"
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 审核记录 -->
      <a-card type="inner" title="审核记录" v-if="applyData.auditRemark">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="审核意见">
            {{ applyData.auditRemark }}
          </a-descriptions-item>
          <a-descriptions-item label="审核时间">
            {{ applyData.auditTime }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 操作按钮 -->
      <div style="text-align: center; margin-top: 24px" v-if="applyData.applyState === 1">
        <a-button type="primary" @click="auditFunc(2)" style="margin-right: 16px">
          审核通过
        </a-button>
        <a-button danger @click="auditFunc(3)">
          审核拒绝
        </a-button>
      </div>
    </div>

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
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  getMchApplyDetail,
  getChannelApplyStatus,
  triggerChannelApply,
  auditMchApply
} from '@/api/mchApply'

const visible = ref(false)
const loading = ref(false)
const applyData = ref<any>(null)
const materialData = ref<any>({})
const channelStatusList = ref<any[]>([])

const channelColumns = [
  {
    title: '渠道',
    dataIndex: 'channelCode',
    key: 'channelCode'
  },
  {
    title: '进件状态',
    dataIndex: 'channelState',
    key: 'channelState'
  },
  {
    title: '渠道商户号',
    dataIndex: 'subMchId',
    key: 'subMchId'
  },
  {
    title: '渠道消息',
    dataIndex: 'channelMsg',
    key: 'channelMsg'
  },
  {
    title: '操作',
    key: 'operation'
  }
]

// 审核弹窗
const auditModal = reactive({
  visible: false,
  title: '',
  auditResult: 0,
  form: {
    auditRemark: ''
  }
})

// 显示详情
const show = async (applyId: string) => {
  visible.value = true
  loading.value = true
  
  try {
    const response = await getMchApplyDetail(applyId)
    if (response.code === 0) {
      applyData.value = response.data
      
      // 设置材料数据
      materialData.value = {
        businessLicense: response.data.businessLicense,
        legalIdCard: response.data.legalIdCard,
        bankLicense: response.data.bankLicense,
        otherMaterials: response.data.otherMaterials
      }
      
      // 加载渠道状态
      await loadChannelStatus(applyId, response.data.channelCodes)
    } else {
      message.error(response.msg || '加载失败')
    }
  } catch (error) {
    console.error('加载详情失败:', error)
    message.error('加载详情失败')
  } finally {
    loading.value = false
  }
}

// 加载渠道状态
const loadChannelStatus = async (applyId: string, channelCodes: string) => {
  if (!channelCodes) return
  
  const channels = channelCodes.split(',')
  const statusPromises = channels.map(async (channelCode) => {
    try {
      const response = await getChannelApplyStatus(applyId, channelCode)
      return {
        channelCode,
        channelState: response.data?.channelState || 0,
        subMchId: response.data?.subMchId || '',
        channelMsg: response.data?.channelMsg || ''
      }
    } catch (error) {
      return {
        channelCode,
        channelState: 0,
        subMchId: '',
        channelMsg: '查询失败'
      }
    }
  })
  
  channelStatusList.value = await Promise.all(statusPromises)
}

// 触发渠道进件
const triggerChannel = async (channelCode: string) => {
  try {
    const response = await triggerChannelApply(applyData.value.applyId, channelCode)
    if (response.code === 0) {
      message.success('触发进件成功')
      // 重新加载渠道状态
      await loadChannelStatus(applyData.value.applyId, applyData.value.channelCodes)
    } else {
      message.error(response.msg || '触发进件失败')
    }
  } catch (error) {
    console.error('触发进件失败:', error)
    message.error('触发进件失败')
  }
}

// 审核
const auditFunc = (auditResult: number) => {
  auditModal.auditResult = auditResult
  auditModal.title = auditResult === 2 ? '审核通过' : '审核拒绝'
  auditModal.form.auditRemark = ''
  auditModal.visible = true
}

// 提交审核
const handleAuditSubmit = async () => {
  try {
    const response = await auditMchApply(applyData.value.applyId, {
      auditResult: auditModal.auditResult,
      auditRemark: auditModal.form.auditRemark
    })
    
    if (response.code === 0) {
      message.success('审核成功')
      auditModal.visible = false
      // 重新加载详情
      await show(applyData.value.applyId)
    } else {
      message.error(response.msg || '审核失败')
    }
  } catch (error) {
    console.error('审核失败:', error)
    message.error('审核失败')
  }
}

// 关闭抽屉
const onClose = () => {
  visible.value = false
  applyData.value = null
  materialData.value = {}
  channelStatusList.value = []
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

// 获取渠道状态样式
const getChannelStateStatus = (state: number) => {
  const statusMap: any = {
    0: 'default',
    1: 'processing',
    2: 'success',
    3: 'error'
  }
  return statusMap[state] || 'default'
}

// 获取渠道状态文本
const getChannelStateText = (state: number) => {
  const textMap: any = {
    0: '未提交',
    1: '进件中',
    2: '进件成功',
    3: '进件失败'
  }
  return textMap[state] || '未知'
}

// 获取商户类型文本
const getMchTypeText = (type: string) => {
  const textMap: any = {
    '1': '个体工商户',
    '2': '企业',
    '3': '个人'
  }
  return textMap[type] || type
}

// 获取行业类别文本
const getIndustryTypeText = (type: string) => {
  const textMap: any = {
    '1': '餐饮',
    '2': '零售',
    '3': '服务业',
    '4': '电商',
    '5': '其他'
  }
  return textMap[type] || type
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

// 暴露方法
defineExpose({
  show
})
</script>

<style scoped>
.material-item {
  margin-bottom: 16px;
}

.material-label {
  font-weight: bold;
  margin-bottom: 8px;
}
</style>