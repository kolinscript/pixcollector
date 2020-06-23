export interface Store {
  user?: {
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
