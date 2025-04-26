<template>
    <div>
        表单构建 <svg-icon icon-class="build" />

        <div style="margin: 50px">
            <image-upload />

            <el-button type="primary" @click="doDelete()">删除文件</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElMessage } from "element-plus";
import { deleteFile, batchDelete } from "@/api/system/fileOptions";

export default defineComponent({
    
    setup() {

        const doDelete =  async () => {
            const result = await batchDelete([
                "ai-111_20250411235640A001.jpg", 
            ]);
            console.log("删除结果:", result);
        }

        return {
            doDelete
        }

    }
})
</script>
