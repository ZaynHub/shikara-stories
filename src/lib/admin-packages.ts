// Re-export everything from admin-data.ts for backwards compatibility
export type { AdminPackage, PackageType } from "@/lib/admin-data";
export {
  PACKAGE_TYPES, loadPackages, savePackage, updatePackage, deletePackage, typeColor,
} from "@/lib/admin-data";
