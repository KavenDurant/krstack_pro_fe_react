import { get, post } from '@/service/http'

enum URL {
  base = 'nodes'
  //   物理机详情  http://192.168.1.60:8686/api/nodes/cluster/180/node/host237  GET
}

// CHECKME 获取物理机GPU列表
const getNodeList = async () => get({ url: URL.base })

const getPhysicalInfo = async (uid: string) => get({ url: `nodes/detail/${uid}` })

// 云主机列表 http://192.168.1.213:8001/nodes/vms/${uid}
const getPhysicalInfoVmList = async (uid: string) => get({ url: `nodes/vms/${uid}` })
// networkList  http://192.168.1.60:8686/api/nodes/cluster/180/node/host237/network
const getNetWorkList = async (uid: string) => get({ url: `nodes/network/${uid}` })
// usb  http://192.168.1.60:8686/api/nodes/cluster/180/node/host237/usb
const getUsbList = async (uid: string) => get({ url: `nodes/usb/${uid}` })

// gpu  http://192.168.1.60:8686/api/nodes/cluster/180/node/host237/gpu
const getGpuList = async (uid: string) => get({ url: `nodes/gpu/${uid}` })
// storage  http://192.168.1.60:8686/api//nodes/cluster/180/node/host237/storage
const getStorageList = async (node_uid: string) =>
  get({ url: `nodes/cluster/node/${node_uid}/storage` })
// setting  http://192.168.1.60:8686/api//nodes/cluster/180/node/host237/network/setting
const getSettingList = async (uid: string) => get({ url: `nodes/network/settings/${uid}` })

//  getPerformanceCpu  http://192.168.1.60:8686/api/nodes/cluster/180/node/host237/monitor/hour/cpu
const getPerformanceCpu = async (node_uid: string, time_frame: string) =>
  get({ url: `nodes/cluster/node/${node_uid}/monitor/${time_frame}/cpu` })

// getPerformanceMen http://192.168.1.60:8686/api/nodes/cluster/180/node/host237/monitor/hour/mem
const getPerformanceMem = async (node_uid: string, time_frame: string) =>
  get({ url: `nodes/cluster/node/${node_uid}/monitor/${time_frame}/mem` })

//  getPerformanceNet  http://192.168.1.60:8686/api/nodes/cluster/180/node/host237/monitor/hour/net
const getPerformanceNet = async (node_uid: string, time_frame: string) =>
  get({ url: `nodes/cluster/node/${node_uid}/monitor/${time_frame}/net` })

//  getPerformanceLoadavg  http://192.168.1.60:8686/api/nodes/cluster/180/node/host237/monitor/hour/loadavg
const getPerformanceLoadavg = async (node_uid: string, time_frame: string) =>
  get({ url: `nodes/cluster/node/${node_uid}/monitor/${time_frame}/loadavg` })

// 重启物理机  http://192.168.1.60:8686/api/nodes/cluster/182/node/host237/reboot
const rebootPhysical = async (uid: string) => {
  return post({ url: `nodes/reboot/${uid}` })
}
// 关机物理机  http://192.168.1.60:8686/api/nodes/cluster/182/node/host237/shutdown
const closePhysical = async (uid: string) => {
  return post({ url: `nodes/shutdown/${uid}` })
}
export {
  closePhysical,
  getGpuList,
  getNetWorkList,
  getNodeList,
  getPerformanceCpu,
  getPerformanceLoadavg,
  getPerformanceMem,
  getPerformanceNet,
  getPhysicalInfo,
  getPhysicalInfoVmList,
  getSettingList,
  getStorageList,
  getUsbList,
  rebootPhysical
}
