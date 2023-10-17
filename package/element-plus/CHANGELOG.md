# @xiaohaih/condition-el-plus

## 0.1.20

### Patch Changes

- 修复初始渲染时 query 未能与 backfill 保持一致导致内部逻辑出错
- Updated dependencies
  - @xiaohaih/condition-core@0.1.20

## 0.1.19

### Patch Changes

- 单选框增加配置(选中项再次点击取消选中)
- Updated dependencies
  - @xiaohaih/condition-core@0.1.19

## 0.1.18

### Patch Changes

- 1.修复依赖发生变化时, 依赖项的请求函数未重新请求 2.下拉框增加分组
- Updated dependencies
  - @xiaohaih/condition-core@0.1.18

## 0.1.17

### Patch Changes

- 1.增加单选框组件 2.输入增加范围段类型(比如年龄段输入) 3.给条件项增加 label 字段
- Updated dependencies
  - @xiaohaih/condition-core@0.1.17

## 0.1.16

### Patch Changes

- Updated dependencies
  - @xiaohaih/condition-core@0.1.16

## 0.1.15

### Patch Changes

- 修复不存在条件中的字段值发生改变后, 触发搜索事件时, 外部仍拿到旧值的问题
- Updated dependencies
  - @xiaohaih/condition-core@0.1.15

## 0.1.14

### Patch Changes

- 修复 element-ui 版本忘记剔除额外属性引起的 bug
- Updated dependencies
  - @xiaohaih/condition-core@0.1.14

## 0.1.13

### Patch Changes

- 修复未触发重置事件, 修复 vue3 下事件不生效以及某些参数未剔除导致的 bug
- Updated dependencies
  - @xiaohaih/condition-core@0.1.13

## 0.1.12

### Patch Changes

- 调整 props 参数, 并将其导出为全局模块
- Updated dependencies
  - @xiaohaih/condition-core@0.1.12

## 0.1.11

### Patch Changes

- 暴露定义条件的返回值类型
  - @xiaohaih/condition-core@0.1.11

## 0.1.10

## 0.1.9

### Patch Changes

- 修复定义条件时写计算属性提示报错
- Updated dependencies
  - @xiaohaih/condition-core@0.1.9

## 0.1.8

## 0.1.7

### Patch Changes

- :bug: fix: 修复 vue2 版本 class, styles 属性未被继承
- Updated dependencies
  - @xiaohaih/condition-core@0.1.7
