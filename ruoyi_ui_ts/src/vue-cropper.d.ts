// src/types/vue-cropper.d.ts
declare module 'vue-cropper' {
    import { DefineComponent } from 'vue'
    const VueCropper: DefineComponent<{
      img: string
      autoCrop?: boolean
      fixed?: boolean
      // 补充其他已知 Props
    }>
    export default VueCropper
  }