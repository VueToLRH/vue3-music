import storage from 'good-storage'

function inertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    // splice() 方法 向/从 数组 添加/删除 项目，并返回删除的项目
    arr.splice(index, 1)
  }
  // unshift() 方法将新项添加到数组的开头，并返回新的长度。
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    // pop() 方法移除数组的最后一个元素，并返回该元素。
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 缓存
export function save(item, key, compare, maxLen) {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

// 移除
export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}

export function saveAll(items, key) {
  storage.set(key, items)
}
