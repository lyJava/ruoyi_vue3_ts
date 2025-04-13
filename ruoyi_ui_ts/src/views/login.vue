<template>
    
        <div class="login">
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                class="login-form"
            >
                <h3 class="title">若依后台管理系统</h3>
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        type="text"
                        auto-complete="off"
                        placeholder="账号"
                    >
                        <template #prefix>
                            <svg-icon
                                icon-class="user"
                                class="el-input__icon input-icon"
                            />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        auto-complete="off"
                        placeholder="密码"
                        @keyup.enter="handleLogin"
                    >
                        <template #prefix>
                            <svg-icon
                                icon-class="password"
                                class="el-input__icon input-icon"
                            />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input
                        v-model="loginForm.code"
                        auto-complete="off"
                        placeholder="验证码"
                        style="width: 50%"
                        @keyup.enter="handleLogin"
                    >
                        <template #prefix
                            ><svg-icon
                                icon-class="validCode"
                                class="el-input__icon input-icon"
                        /></template>
                    </el-input>
                    <div class="login-code">
                        <img
                            :src="codeUrl"
                            @click="getCode()"
                            class="login-code-img"
                            title="看不清？点击更换"
                            width="140"
                        />
                    </div>
                </el-form-item>
                <el-checkbox
                    v-model="loginForm.rememberMe"
                    style="margin: 0 0 25px 0"
                    >记住密码</el-checkbox
                >
                <el-form-item style="width: 100%">
                    <el-button
                        :loading="loading"
                        type="primary"
                        size="large"
                        style="width: 100%"
                        @click.native="handleLogin"
                    >
                        <span v-if="!loading">登 录</span>
                        <span v-else>登 录 中...</span>
                    </el-button>
                </el-form-item>
            </el-form>
            <!--  底部  -->
            <div class="el-login-footer">
                <span>Copyright © 2018-2021 ruoyi.vip All Rights Reserved.</span>
            </div>
        </div>
      
</template>

<script lang="ts" name="Login" setup>
import Login from "@/api/request/login";
const {
    loginFormRef, loginForm, loginRules, codeUrl, loading, getCode, handleLogin
} = Login();

</script>

<style lang="scss" scoped>
.login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-image: url("../assets/images/login-background.jpg");
	background-size: cover;
    overflow: hidden;
}

.title {
	margin: 0 auto 30px auto;
	text-align: center;
	color: #707070;
}

.login-form {
	border-radius: 6px;
	background: #ffffff;
	width: 400px;
	padding: 25px 25px 5px 25px;
    overflow: hidden;

	.el-input {
		height: 38px;

		input {
			height: 38px;
		}
	}

	.input-icon {
		height: 39px;
		width: 14px;
		margin-left: 2px;
	}
}

.login-tip {
	font-size: 13px;
	text-align: center;
	color: #bfbfbf;
}

.login-code {
	height: 38px;
    margin-left: 30px;
    justify-content: right;
    background: rgba(239, 236, 236, 0.35);
	img {
		cursor: pointer;
        vertical-align: middle;
	}
}

.el-login-footer {
	height: 40px;
	line-height: 40px;
	position: fixed;
	bottom: 0;
	width: 100%;
    display: inline-flex;
	text-align: center;
    justify-content: center;
    align-items: center;
	color: #fff;
	font-family: Arial;
	font-size: 12px;
	letter-spacing: 1px;
}

.login-code-img {
	height: 38px;
    box-sizing: inherit
}
</style>
