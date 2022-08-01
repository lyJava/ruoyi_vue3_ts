import hljs from 'highlight.js'
// import "highlight.js/styles/github-gist.css";

/**
 * 通过highlight显示行号指令
 * https://blog.csdn.net/qq_44754016/article/details/120552145
 */
export default {
    bind(el: { querySelectorAll: (arg0: string) => any; }, binding: any, vnode: any, oldVnode: any) {
        const blocks = el.querySelectorAll('pre code');
        blocks.forEach((block: any) => {
            hljs.highlightBlock(block);
            // 从这开始是设置行号
            block.innerHTML = `<ol><li class='code'>${block.innerHTML.replace(/\n/g, `</li><li class="line">`)}</li></li></ol>`;
        });
    }
};

