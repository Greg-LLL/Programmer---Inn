import Vue from 'vue'
import dayjs from 'dayjs'

// dayjs默认语言是英文，我们这里配置了中文
// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 加载处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 全局使用
dayjs.locale('zh-cn')

// 定义一个全局过滤器，然后就可以在任何组件的模板中使用
// 其实过滤器相当于一个全局可用的方法,仅供模板使用
// 参数1:过滤器名
// 参数2：过滤器函数
// 使用:{{ 表达式 | 过滤器名  }}
Vue.filter('relativeTime',value => {
    return dayjs().to(dayjs(value))
})
// dayjs().from(dayjs('1990')) // 2 years ago
