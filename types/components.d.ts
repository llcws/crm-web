// 修正后代码（与步骤1的导入路径一致）
declare module '@/components/Dialog.vue' {
  interface DialogProps {
    modelValue: boolean
    title: string
    fullscreen?: boolean
    maxHeight?: number | string
    cancelDialog: () => void
    width?: string
    top?: string
  }

  interface DialogSlots {
    default?: () => any
    footer?: () => any
  }

  const Dialog: DefineComponent<DialogProps, {}, {}, {}, {}, DialogSlots>

  export default Dialog
}
