export interface Store {
  user?: {
    vkId?: string,
    VKTIFSAExists?: string,
    name?: string,
    avatar?: string,
    albumSize?: string,
    privacyVisible?: number
    privacyDownloadable?: number
    sysAccessRights?: number,
    pixArray?: [],
  },
  stockUser?: {
    vkId?: string,
    name?: string,
    avatar?: string,
    albumSize?: string,
    privacyVisible?: number
    privacyDownloadable?: number
    sysAccessRights?: number,
    pixArray?: [],
  }
}
