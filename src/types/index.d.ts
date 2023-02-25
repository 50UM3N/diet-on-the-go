interface User {
    id: string;
    name: string;
    email: string;
    height: number;
    weight: number;
    dob: Date;
    photoURL: string;
}
interface LinksData {
    link: string;
    label: string;
    icon: Icon;
    links?: { link: string; label: string; access: Roles[] }[];
    exact?: boolean;
}