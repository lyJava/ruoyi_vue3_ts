<template>
	<div
		class="split-pane"
		:class="direction"
		:style="{ flexDirection: direction }"
		ref="splitPane"
	>
		<div
			class="page split-pane-left"
			:style="{ [lengthType]: paneLengthValue }"
		>
			<slot name="left"></slot>
		</div>
		<div
			class="split-pane-divider"
			:style="{ [lengthType]: triggerLengthValue }"
			@mousedown="handleMouseDown"
		>
			<div class="divider-conten">
				<i class="trigger-bar"></i>
				<i class="trigger-bar"></i>
				<i class="trigger-bar"></i>
				<i class="trigger-bar"></i>
				<i class="trigger-bar"></i>
			</div>
		</div>
		<div class="split-pane-right">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<script lang="ts">
import { computed, defineProps, ref } from 'vue'
// 定义 props 类型
interface Props {
    direction: 'row' | 'column' // 方向
    min?: number // 最小值
    max?: number, // 最大值
    paneLengthPercent?: number, // 区域1宽度 (%)
    triggerLength?: number // 滑动器宽度 （px）
}

const props = withDefaults(defineProps<Props>(), {
    direction: 'row', // Set default value to 'row'
    min: 10,
    max: 90,
    paneLengthPercent: 50,
    triggerLength: 10
})

const paneLengthPercent = ref<number>(30) // 区域1宽度 (%)

const triggerLength = ref<number>(10) // 滑动器宽度 （px）
const triggerLeftOffset = ref<number>(0)// 鼠标距滑动器左(顶)侧偏移量


const splitPane = ref<HTMLElement | null>(null) // 区域1宽度 (%)


const lengthType = computed((): 'width' | 'height' => props.direction === 'row' ? 'width' : 'height')
const paneLengthValue = computed((): string => `calc(${paneLengthPercent.value}% - ${triggerLength.value / 2 + 'px'})`)

const triggerLengthValue = computed((): string => `calc(${triggerLength.value}px)`)

const handleMouseDown = (e: MouseEvent): void => {
    const target = e.currentTarget as HTMLElement;
    triggerLeftOffset.value = props.direction === 'row'
        ? e.clientX - target.getBoundingClientRect().left
        : e.clientY - target.getBoundingClientRect().top

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp) // 监听鼠标松开事件
}
const handleMouseMove = (e: MouseEvent): void => {
    if (!splitPane.value) return
    const clientRect = splitPane.value.getBoundingClientRect()
    if (props.direction === 'row') {
        const offset = e.clientX - clientRect.left
        paneLengthPercent.value = (offset / clientRect.width) * 100
    } else {
        const offset = e.clientY - clientRect.top - triggerLeftOffset.value + triggerLength.value / 2
        paneLengthPercent.value = (offset / clientRect.height) * 100
    }
    if (paneLengthPercent.value < props.min) {
        paneLengthPercent.value = props.min
    }
    if (paneLengthPercent.value > props.max) {
        paneLengthPercent.value = props.max
    }

}
const handleMouseUp = (e: MouseEvent): void => {
    document.removeEventListener('mousemove', handleMouseMove)

}

</script>
<style>
.split-pane {
	height: 100%;
	display: flex;

	&.row {
		.split-pane-divider {
			height: 100%;
			cursor: col-resize;
			position: relative;
			user-select: none;

			.divider-conten {
				position: absolute;
				height: 40px;
				top: 50%;
				-webkit-transform: translateY(-50%);
				transform: translateY(-50%);
				width: 100%;

				.trigger-bar {
					width: 100%;
					height: 2px;
					display: block;
					background: rgba(23, 35, 61, 0.25);
					margin-top: 3px;
				}
			}
		}

		.page {
			height: 100%;
		}
	}

	&.column {
		.split-pane-divider {
			width: 100%;
			cursor: row-resize;
		}

		.page {
			width: 100%;
		}
	}

	.split-pane-right {
		flex: 1;
	}

	.split-pane-divider {
		background-color: #e3e5e7;
	}
}
</style>
