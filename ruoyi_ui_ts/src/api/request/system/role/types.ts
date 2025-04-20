import { TreeKey } from "element-plus";

export type QueryParam = {
    pageNum?: number;
    pageSize?: number;
    roleName?: string;
    roleKey?: string;
    status?: string;
}

export type FormParam =  QueryParam & {
    id?: string;
    dataScope?: number;
    deptCheckStrictly?: boolean;
    deptIds?: TreeKey[];
    menuCheckStrictly?: boolean;
    menuIds?: TreeKey[];
    remarks?: string;
    roleSort?: number;
}