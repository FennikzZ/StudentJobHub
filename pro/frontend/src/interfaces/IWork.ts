export interface WorkInterface {
    ID?: number;
    title?: string;
    description?: string;
    place?: string;
    latitude?: number;
    longitude?: number;
    workuse?: number;
    workcount?: number;
    worktime?: string;
    photo?: string;
    paid?: number | null;       // กรณีเป็นงานแบบ Paid
    volunteer?: number | null;  // กรณีเป็นงานจิตอาสา
    workstatus_id?: number;
    worktype_id?: number;
}