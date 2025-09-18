<template>
  <page-header-wrapper>
    <a-card title="商户进件申请">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        @finish="onSubmit"
      >
        <!-- 基本信息 -->
        <a-card type="inner" title="基本信息" style="margin-bottom: 16px">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="商户名称" name="mchName">
                <a-input v-model:value="formData.mchName" placeholder="请输入商户名称" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="商户简称" name="mchShortName">
                <a-input v-model:value="formData.mchShortName" placeholder="请输入商户简称" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="商户类型" name="mchType">
                <a-select v-model:value="formData.mchType" placeholder="请选择商户类型">
                  <a-select-option value="1">个体工商户</a-select-option>
                  <a-select-option value="2">企业</a-select-option>
                  <a-select-option value="3">个人</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="行业类别" name="industryType">
                <a-select v-model:value="formData.industryType" placeholder="请选择行业类别">
                  <a-select-option value="1">餐饮</a-select-option>
                  <a-select-option value="2">零售</a-select-option>
                  <a-select-option value="3">服务业</a-select-option>
                  <a-select-option value="4">电商</a-select-option>
                  <a-select-option value="5">其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 联系信息 -->
        <a-card type="inner" title="联系信息" style="margin-bottom: 16px">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="联系人姓名" name="contactName">
                <a-input v-model:value="formData.contactName" placeholder="请输入联系人姓名" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="联系电话" name="contactPhone">
                <a-input v-model:value="formData.contactPhone" placeholder="请输入联系电话" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="联系邮箱" name="contactEmail">
                <a-input v-model:value="formData.contactEmail" placeholder="请输入联系邮箱" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="经营地址" name="businessAddress">
                <a-input v-model:value="formData.businessAddress" placeholder="请输入经营地址" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 业务信息 -->
        <a-card type="inner" title="业务信息" style="margin-bottom: 16px">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="申请渠道" name="channelCodes">
                <a-checkbox-group v-model:value="formData.channelCodes">
                  <a-row>
                    <a-col :span="8">
                      <a-checkbox value="WXPAY">微信支付</a-checkbox>
                    </a-col>
                    <a-col :span="8">
                      <a-checkbox value="ALIPAY">支付宝</a-checkbox>
                    </a-col>
                    <a-col :span="8">
                      <a-checkbox value="UNIONPAY">云闪付</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="业务描述" name="businessDesc">
                <a-textarea
                  v-model:value="formData.businessDesc"
                  placeholder="请描述您的业务内容"
                  :rows="4"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 材料上传 -->
        <a-card type="inner" title="材料上传" style="margin-bottom: 16px">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="营业执照" name="businessLicense">
                <a-upload
                  v-model:file-list="formData.businessLicenseList"
                  :action="uploadUrl"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
                  @change="handleBusinessLicenseChange"
                >
                  <div v-if="formData.businessLicenseList.length < 1">
                    <plus-outlined />
                    <div style="margin-top: 8px">上传</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="法人身份证" name="legalIdCard">
                <a-upload
                  v-model:file-list="formData.legalIdCardList"
                  :action="uploadUrl"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
                  @change="handleLegalIdCardChange"
                >
                  <div v-if="formData.legalIdCardList.length < 2">
                    <plus-outlined />
                    <div style="margin-top: 8px">上传</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="银行开户许可证" name="bankLicense">
                <a-upload
                  v-model:file-list="formData.bankLicenseList"
                  :action="uploadUrl"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
                  @change="handleBankLicenseChange"
                >
                  <div v-if="formData.bankLicenseList.length < 1">
                    <plus-outlined />
                    <div style="margin-top: 8px">上传</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="其他材料" name="otherMaterials">
                <a-upload
                  v-model:file-list="formData.otherMaterialsList"
                  :action="uploadUrl"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
                  @change="handleOtherMaterialsChange"
                  multiple
                >
                  <div v-if="formData.otherMaterialsList.length < 5">
                    <plus-outlined />
                    <div style="margin-top: 8px">上传</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 提交按钮 -->
        <div style="text-align: center">
          <a-button type="primary" html-type="submit" size="large" :loading="submitting">
            提交申请
          </a-button>
          <a-button style="margin-left: 16px" size="large" @click="resetForm">
            重置
          </a-button>
        </div>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { submitMchApply, upload } from '@/api/mchApply'

const formRef = ref()
const submitting = ref(false)
const uploadUrl = upload.material

// 表单数据
const formData = reactive({
  mchName: '',
  mchShortName: '',
  mchType: '',
  industryType: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  businessAddress: '',
  channelCodes: [],
  businessDesc: '',
  businessLicense: '',
  legalIdCard: '',
  bankLicense: '',
  otherMaterials: '',
  businessLicenseList: [],
  legalIdCardList: [],
  bankLicenseList: [],
  otherMaterialsList: []
})

// 表单验证规则
const rules = {
  mchName: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
  mchShortName: [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
  mchType: [{ required: true, message: '请选择商户类型', trigger: 'change' }],
  industryType: [{ required: true, message: '请选择行业类别', trigger: 'change' }],
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  businessAddress: [{ required: true, message: '请输入经营地址', trigger: 'blur' }],
  channelCodes: [{ required: true, message: '请选择申请渠道', trigger: 'change' }],
  businessDesc: [{ required: true, message: '请输入业务描述', trigger: 'blur' }]
}

// 文件上传前检查
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG/PDF 格式的文件!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('文件大小不能超过 2MB!')
    return false
  }
  return true
}

// 营业执照上传处理
const handleBusinessLicenseChange = (info: any) => {
  if (info.file.status === 'done') {
    formData.businessLicense = info.file.response.data.url
    message.success('营业执照上传成功')
  } else if (info.file.status === 'error') {
    message.error('营业执照上传失败')
  }
}

// 法人身份证上传处理
const handleLegalIdCardChange = (info: any) => {
  if (info.file.status === 'done') {
    const urls = formData.legalIdCardList
      .filter(file => file.status === 'done')
      .map(file => file.response.data.url)
    formData.legalIdCard = urls.join(',')
    message.success('法人身份证上传成功')
  } else if (info.file.status === 'error') {
    message.error('法人身份证上传失败')
  }
}

// 银行开户许可证上传处理
const handleBankLicenseChange = (info: any) => {
  if (info.file.status === 'done') {
    formData.bankLicense = info.file.response.data.url
    message.success('银行开户许可证上传成功')
  } else if (info.file.status === 'error') {
    message.error('银行开户许可证上传失败')
  }
}

// 其他材料上传处理
const handleOtherMaterialsChange = (info: any) => {
  if (info.file.status === 'done') {
    const urls = formData.otherMaterialsList
      .filter(file => file.status === 'done')
      .map(file => file.response.data.url)
    formData.otherMaterials = urls.join(',')
    message.success('其他材料上传成功')
  } else if (info.file.status === 'error') {
    message.error('其他材料上传失败')
  }
}

// 提交表单
const onSubmit = async () => {
  try {
    submitting.value = true
    
    // 构建提交数据
    const submitData = {
      ...formData,
      channelCodes: formData.channelCodes.join(',')
    }
    
    const response = await submitMchApply(submitData)
    
    if (response.code === 0) {
      message.success('进件申请提交成功，请等待审核')
      resetForm()
    } else {
      message.error(response.msg || '提交失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    mchName: '',
    mchShortName: '',
    mchType: '',
    industryType: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    businessAddress: '',
    channelCodes: [],
    businessDesc: '',
    businessLicense: '',
    legalIdCard: '',
    bankLicense: '',
    otherMaterials: '',
    businessLicenseList: [],
    legalIdCardList: [],
    bankLicenseList: [],
    otherMaterialsList: []
  })
}
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>