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
                "cat-6748193_1280_20250411234354A004.jpg", 
                "222_20250411234354A002.png", 
                "test123_20250411234354A003.jpg", 
                "thunderstorm-3625405_960_720_20250411234354A001.jpg"
            ]);
            console.log("删除结果:", result);
        }

        return {
            doDelete
        }

    }
})
</script>
