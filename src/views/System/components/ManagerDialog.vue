<template>
  <Dialog
    :model-value="dialogVisible"
    :title="dialogProps.title"
    :fullscreen="dialogProps.fullscreen"
    :max-height="dialogProps.maxHeight"
    :cancel-dialog="cancelDialog"
    width="45%"
  >
    <div :style="'width: calc(100% - ' + dialogProps.labelWidth! / 2 + 'px)'">
      <el-form
        ref="ruleFormRef"
        label-position="right"
        :label-width="dialogProps.labelWidth + 'px'"
        :rules="rules"
        :model="dialogProps.row"
        :disabled="dialogProps.isView"
        :hide-required-asterisk="dialogProps.isView"
      >
        <el-form-item v-if="dialogProps.title !== '重置'" label="用户名" prop="account">
          <el-input id="account-input" v-model="dialogProps.row!.account" placeholder="请填写用户名（2-20字）" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="昵称" prop="nickname">
          <el-input id="nickname-input" v-model="dialogProps.row!.nickname" placeholder="请填写昵称（2-20字）" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="邮箱" prop="email">
          <el-input id="email-input" v-model="dialogProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title === '新增' || dialogProps.title === '重置'" label="密码" prop="password">
          <el-input id="password-input" v-model="dialogProps.row!.password" show-password type="password" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title === '新增' || dialogProps.title === '重置'" label="确认密码" prop="submitPassword">
          <el-input id="submitPassword-input" v-model="dialogProps.row!.submitPassword" show-password type="password" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置' && dialogProps.row!.type == 0" label="角色" prop="roleId">
          <el-select v-model="dialogProps.row!.roleId" filterable placeholder="请选择角色" class="w-full">
            <el-option v-for="item in dialogProps.roleList" :key="item.id" :label="item.name" :value="item.id" class="isabel-option" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="所属部门" prop="departId">
          <el-cascader
            v-model="dialogProps.row!.departId"
            :props="{ value: 'id', label: 'name', emitPath: false, checkStrictly: true }"
            placeholder="请选择管理员所属部门"
            :options="departmentList"
            :show-all-levels="false"
            filterable
          />
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="状态" prop="status">
          <el-radio-group v-model="dialogProps.row!.status">
            <el-radio :label="1" border>正常</el-radio>
            <el-radio :label="0" border>停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { getRoleList } from '@/api/modules/role'
import { getManagerInfoApi } from '@/api/modules/manager'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useDepartmentStore } from '@/store/modules/department'

const appStore = useAppStoreWithOut()
interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
  roleList?: any
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: { status: 1, type: 0, email: '' },
  labelWidth: 160,
  fullscreen: false,
  maxHeight: '500px'
})

const departmentStore = useDepartmentStore()
const departmentList = departmentStore.departmentList

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  const defaultRow = { status: 1, type: 0, email: '' }
  dialogProps.value = {
    ...dialogProps.value,
    ...params,
    row: { ...defaultRow, ...params.row }
  }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

// 获取角色列表
const getFormRoleList = async () => {
  const { data } = await getRoleList()
  dialogProps.value.roleList = data
}
await getFormRoleList()

// 动态校验规则
const rules = computed(() => {
  const baseRules = {
    email: [
      { required: dialogProps.value.title !== '重置', message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ]
  }

  if (dialogProps.value.title === '新增') {
    return {
      ...baseRules,
      account: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '字数为2-20个字', trigger: 'blur' }
      ],
      nickname: [
        { required: true, message: '昵称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '字数为2-20个字', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,16}$/, message: '密码应当至少8位且含有数字、大小写字母及特殊字符', trigger: 'blur' }
      ],
      submitPassword: [
        {
          required: true,
          trigger: 'blur',
          validator: (_rule: any, value: string, callback: Function) => {
            if (!value) return callback(new Error('确认密码不能为空'))
            if (value !== dialogProps.value.row.password) return callback(new Error('两次输入的密码不一致'))
            callback()
          }
        }
      ],
      roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }]
    }
  }

  if (dialogProps.value.title === '编辑') {
    return {
      ...baseRules,
      nickname: [
        { required: true, message: '昵称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '字数为2-20个字', trigger: 'blur' }
      ],
      roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }]
    }
  }

  if (dialogProps.value.title === '重置') {
    return {
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,16}$/, message: '密码应当至少8位且含有数字、大小写字母及特殊字符', trigger: 'blur' }
      ],
      submitPassword: [
        {
          required: true,
          trigger: 'blur',
          validator: (_rule: any, value: string, callback: Function) => {
            if (!value) return callback(new Error('确认密码不能为空'))
            if (value !== dialogProps.value.row.password) return callback(new Error('两次输入的密码不一致'))
            callback()
          }
        }
      ]
    }
  }

  return {}
})

const ruleFormRef = ref<FormInstance>()
const handleSubmit = async () => {
  if (!ruleFormRef.value || !dialogProps.value.api) return

  try {
    await ruleFormRef.value.validate()
    await dialogProps.value.api(dialogProps.value.row)

    if (dialogProps.value.row.id === appStore.$state.userInfo.id) {
      const res = await getManagerInfoApi()
      appStore.setUserinfo(res.data)
    }

    ElMessage.success(`${dialogProps.value.title}管理员成功！`)
    if (typeof dialogProps.value.getTableList === 'function') {
      dialogProps.value.getTableList()
    }
    cancelDialog(true)
  } catch (error) {
    console.error(`${dialogProps.value.title}失败`, error)
    ElMessage.error(`${dialogProps.value.title}管理员失败！`)
  }
}

const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  let condition = ['查看', '编辑']
  if ((condition.includes(dialogProps.value.title) || isClean) && ruleFormRef.value) {
    dialogProps.value.row = { status: 1, type: 0, email: '' }
    ruleFormRef.value.resetFields()
  }
}
</script>

<style scoped lang="less"></style>
