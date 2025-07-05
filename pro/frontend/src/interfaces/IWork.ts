export interface WorkInterface {
    ID?: number;
    title?: string;
    description?: string;
    place?: string;
    latitude?: number;
    longitude?: number;
    workcount?: number;
    worktime?: string;
    photo?: string;
    paid?: number | null;       // กรณีเป็นงานแบบ Paid
    volunteer?: number | null;  // กรณีเป็นงานจิตอาสา
}